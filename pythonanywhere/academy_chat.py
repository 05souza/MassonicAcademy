import importlib
import os
from functools import lru_cache

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import auth
from flask import Flask, jsonify, request


def create_app():
    load_dotenv()
    origin = os.environ["ACADEMY_CHAT_ORIGIN"]
    allowed_uids = set(os.environ["ACADEMY_CHAT_UIDS"].split())
    if not allowed_uids:
        raise ValueError("Configure ao menos um UID autorizado.")
    firebase = firebase_admin.initialize_app(
        options={"projectId": os.environ["ACADEMY_FIREBASE_PROJECT_ID"]},
        name="academy-chat",
    )
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = 8192

    @lru_cache(maxsize=1)
    def load_bot():
        bot = importlib.import_module(os.environ["ACADEMY_BOT_MODULE"])
        loader = getattr(bot, "load_vector_store", None) or bot.load_vector_store_from_url
        loader()
        if not bot.vector_store:
            raise RuntimeError("Base de documentos indisponível.")
        return bot

    @app.after_request
    def headers(response):
        response.headers["Cache-Control"] = "no-store"
        response.headers["Vary"] = "Origin"
        if request.headers.get("Origin") == origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
            response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        return response

    @app.route("/ask", methods=["POST", "OPTIONS"])
    def ask():
        if request.method == "OPTIONS":
            return ("", 204) if request.headers.get("Origin") == origin else ("", 403)

        scheme, _, token = request.headers.get("Authorization", "").partition(" ")
        if scheme.lower() != "bearer" or not token or len(token) > 8192:
            return jsonify(error="login_required"), 401
        try:
            identity = auth.verify_id_token(token, app=firebase, check_revoked=True)
        except (auth.InvalidIdTokenError, auth.UserDisabledError, auth.UserNotFoundError, ValueError):
            return jsonify(error="invalid_session"), 401
        except Exception as error:
            app.logger.warning("Verificação Firebase indisponível: %s", type(error).__name__)
            return jsonify(error="auth_unavailable"), 503
        if identity["uid"] not in allowed_uids:
            return jsonify(error="access_denied"), 403

        data = request.get_json(silent=True)
        question = data.get("question") if isinstance(data, dict) else None
        if not isinstance(question, str) or not 1 <= len(question.strip()) <= 500:
            return jsonify(error="invalid_question"), 400

        try:
            bot = load_bot()
            embedding = bot.get_embedding(question.strip())
            if embedding is None:
                return jsonify(error="embedding_unavailable"), 502
            answer = bot.ask_ai_with_rag(question.strip(), bot.find_relevant_chunks(embedding))
            if not answer or answer.startswith("Desculpe, tive um problema"):
                return jsonify(error="answer_unavailable"), 502
        except Exception as error:
            app.logger.warning("Falha no chat: %s", type(error).__name__)
            return jsonify(error="chat_unavailable"), 502
        return jsonify(answer=answer)

    return app

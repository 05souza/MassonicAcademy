<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/12e51d5c-2b2e-4a55-be19-87b4a40a9ada

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Teste do chat na área logada

O piloto fica desligado enquanto `VITE_ACADEMY_CHAT_URL` estiver vazio. Teste
em um deploy Preview, usando um projeto Firebase de teste nos campos
`VITE_FIREBASE_*`. O portal grava dados no Firestore, então use dados de teste.

1. No Firebase de teste, habilite E-mail/senha, crie um usuário de teste e copie
   seu UID. Cadastre um perfil ativo com o mesmo e-mail em `accessUsers`, sem
   colocar a senha no perfil. A senha deve ficar no Firebase Authentication.
2. Crie uma aplicação web Flask de teste no PythonAnywhere. No ambiente virtual
   usado pela aplicação web, instale `Flask`, `firebase-admin` e as dependências
   do bot existente. Use o mesmo módulo RAG e a mesma base usados pelo bot.
3. Deixe as variáveis abaixo somente no servidor, em um arquivo separado
   das configurações da tarefa do Telegram.

   | Variável | Valor |
   | --- | --- |
   | `GOOGLE_APPLICATION_CREDENTIALS` | Caminho do JSON da conta de serviço do Firebase de teste |
   | `ACADEMY_FIREBASE_PROJECT_ID` | ID do projeto Firebase de teste |
   | `ACADEMY_CHAT_UIDS` | UID de teste. Separe UIDs adicionais por espaços |
   | `ACADEMY_CHAT_ORIGIN` | Origem HTTPS exata do Preview, sem barra no final |
   | `ACADEMY_BOT_MODULE` | Nome do módulo do bot sem `.py`, como `bot_telegram` |

   Configure as credenciais do bot no servidor conforme seu módulo existente.
   A conta de serviço precisa consultar os usuários do Firebase Auth para
   verificar se foram desativados ou se a sessão foi revogada.

4. No WSGI, inclua no `sys.path` as pastas do bot e de `academy_chat.py`.
   Defina a pasta de trabalho como a do bot para que seu índice seja encontrado.
   Carregue o arquivo de configuração do chat pelo caminho absoluto e crie
   a aplicação com `from academy_chat import create_app` e
   `application = create_app()`.
5. No Preview da Vercel, configure `VITE_ACADEMY_CHAT_URL` com a URL HTTPS do
   PythonAnywhere terminada em `/ask`. Entre no portal e abra **Perguntar à
   Academia**. Confira também um UID ausente da lista e uma chamada sem sessão.

O piloto usa a lista de UIDs no servidor para autorizar o chat. A coleção
legada `accessUsers` continua servindo ao cadastro visual do portal. A adoção
em produção exige migrar os usuários existentes e revisar as regras do Firestore.

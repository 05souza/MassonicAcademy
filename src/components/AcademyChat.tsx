import { useState, type FormEvent } from 'react';
import type { User } from 'firebase/auth';

export default function AcademyChat({ endpoint, user }: { endpoint: string; user: User }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim() || pending) return;
    setPending(true);
    setError('');
    setAnswer('');
    try {
      const token = await user.getIdToken();
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() }),
      });
      if (response.status === 401 || response.status === 403) {
        setError('Sua conta não tem acesso ao chat. Entre novamente ou fale com a administração.');
        return;
      }
      if (!response.ok) throw new Error('Falha no chat');
      const result = await response.json();
      if (typeof result.answer !== 'string' || !result.answer.trim()) throw new Error('Resposta vazia');
      setAnswer(result.answer);
    } catch {
      setError('Não foi possível responder agora. Tente novamente em instantes.');
    } finally {
      setPending(false);
    }
  }

  return (
    <details className="mx-auto my-4 w-[calc(100%-2rem)] max-w-3xl rounded-xl border border-[#1c2c36] bg-[#0c1d27] p-4">
      <summary className="cursor-pointer font-semibold text-[#E9C349]">Perguntar à Academia</summary>
      <form onSubmit={ask} className="mt-4 space-y-3">
        <label htmlFor="academy-question" className="block text-sm">Sua pergunta</label>
        <textarea
          id="academy-question"
          className="w-full rounded-lg border border-[#375061] bg-[#05151e] p-3"
          value={question}
          onChange={event => setQuestion(event.target.value)}
          maxLength={500}
          rows={3}
          required
        />
        <button disabled={pending || !question.trim()} className="rounded-lg bg-[#E9C349] px-4 py-2 font-semibold text-[#241a00] disabled:opacity-50">
          {pending ? 'Buscando resposta…' : 'Enviar pergunta'}
        </button>
      </form>
      <div role="status" className="mt-3 whitespace-pre-wrap text-sm">{answer}</div>
      {error && <p role="alert" className="mt-2 text-sm text-rose-300">{error}</p>}
    </details>
  );
}

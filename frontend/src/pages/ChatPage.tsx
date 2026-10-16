import { useEffect, useState, type FormEvent } from 'react';
import { Bot, Send, UserRound, Sparkles } from 'lucide-react';
import { api } from '../api/client';
import { errorMessage } from '../utils/errors';

type Message = { role: 'assistant' | 'user'; content: string };
type ChatResponse = { answer: string; configured: boolean; sources?: { title: string; chunkIndex: number; score: number }[] };
type HistoryTurn = { id: number; question: string; answer: string; createdAt: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'I am CampusConnect AI. Ask about campus workflows or indexed campus documents. Retrieved material is used as context when relevant; verify important policies with official sources.' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { api.get<HistoryTurn[]>('/chat/history').then(({ data }) => { if (data.length) setMessages(data.slice().reverse().flatMap(t => [{ role: 'user' as const, content: t.question }, { role: 'assistant' as const, content: t.answer }])); }).catch(() => {}); }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const message = input.trim();
    if (!message || busy) return;
    setMessages(current => [...current, { role: 'user', content: message }]);
    setInput(''); setBusy(true); setError('');
    try {
      const { data } = await api.post<ChatResponse>('/chat', { message });
      setMessages(current => [...current, { role: 'assistant', content: data.answer }]);
    } catch (e) { setError(errorMessage(e)); }
    finally { setBusy(false); }
  }

  return <div className="chat-page"><div className="page-title-row"><div><span className="eyebrow">AI STUDENT SUPPORT</span><h2>Campus assistant</h2><p className="muted">Connects to an OpenAI-compatible API configured on the backend.</p></div><div className="ai-status"><Sparkles size={16} /> AI workspace</div></div>
    <div className="chat-layout"><aside className="chat-info"><div className="chat-info-icon"><Bot size={26} /></div><h3>CampusConnect AI</h3><p>Use the assistant for general questions. Verify important academic policies with official campus sources.</p><div className="info-divider" /><span className="eyebrow">CURRENT CAPABILITIES</span><ul><li>Provider API integration</li><li>Persisted conversation history</li><li>Campus document retrieval context</li><li>Configuration-aware response</li></ul><div className="chat-warning">Retrieval uses keyword overlap over indexed text chunks. Dense embeddings/vector search are not configured in this edition.</div></aside>
      <section className="chat-window"><div className="chat-window-head"><div className="online-avatar"><Bot size={19} /></div><div><strong>Campus assistant</strong><span><i /> Ready for questions</span></div></div><div className="messages">{messages.map((m, i) => <div className={`message-row ${m.role}`} key={`${i}-${m.role}`}><div className="message-avatar">{m.role === 'assistant' ? <Bot size={16} /> : <UserRound size={16} />}</div><div className="message-bubble"><span className="message-author">{m.role === 'assistant' ? 'CAMPUSCONNECT AI' : 'YOU'}</span><p>{m.content}</p></div></div>)}{busy && <div className="typing">Assistant is generating a response…</div>}{error && <div className="alert">{error}</div>}</div><form className="chat-composer" onSubmit={submit}><textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void submit(e as unknown as FormEvent); } }} rows={2} maxLength={8000} placeholder="Ask a question… (Enter to send, Shift+Enter for new line)" /><button className="primary-button send-button" disabled={busy || !input.trim()} aria-label="Send message"><Send size={17} /></button><span className="composer-note">AI responses can be inaccurate. Do not submit passwords or sensitive personal data.</span></form></section></div>
  </div>;
}

import { useState } from "react";
import { api } from "../api.js";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function send(e) {
    e.preventDefault();
    if (!text.trim() || loading) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setText("");
    setLoading(true);
    setError("");
    try {
      const { result } = await api("/ai/chat", { method: "POST", body: { messages: next.slice(-20) } });
      setMessages([...next, { role: "assistant", content: result }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex h-[65vh] flex-col rounded-xl border border-slate-200 bg-white">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && <p className="text-slate-500">Ask for blog ideas, an outline, or help improving a paragraph.</p>}
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-4 py-2 ${m.role === "user" ? "ml-auto bg-violet-600 text-white" : "bg-slate-100"}`}>{m.content}</div>
        ))}
        {loading && <p className="animate-pulse text-slate-500">Thinking…</p>}
        {error && <p role="alert" className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-slate-200 p-3">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" className="flex-1 rounded-lg border border-slate-300 p-2.5" />
        <button disabled={loading} className="rounded-lg bg-violet-600 px-5 font-medium text-white hover:bg-violet-700 disabled:opacity-50">Send</button>
      </form>
    </section>
  );
}

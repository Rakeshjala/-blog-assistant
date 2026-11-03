import { useState } from "react";
import Tool from "../components/Tool.jsx";
import Chat from "../components/Chat.jsx";
import Saved from "../components/Saved.jsx";

const TABS = [
  { id: "titles", label: "Title Generator" },
  { id: "content", label: "Content Generator" },
  { id: "summary", label: "Summarizer" },
  { id: "chat", label: "Chat Assistant" },
  { id: "saved", label: "Saved" },
];

const TOOLS = {
  titles: { label: "What is your blog about?", placeholder: "e.g. Learning React as a beginner", tone: true },
  content: { label: "Blog topic or outline", placeholder: "e.g. 5 tips for staying productive while studying", tone: true },
  summary: { label: "Paste the text to summarize", placeholder: "Paste an article or your draft here…", tone: false },
};

export default function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState("titles");
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <span className="text-lg font-extrabold tracking-tight">AI Blog Assistant</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-500 sm:inline">Hi, {user.name}</span>
            <button onClick={onLogout} className="rounded-lg border border-slate-300 px-3 py-1.5 hover:border-violet-600">Log out</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <nav className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm ${tab === t.id ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300 bg-white hover:border-violet-600"}`}>
              {t.label}
            </button>
          ))}
        </nav>
        {TOOLS[tab] && <Tool key={tab} kind={tab} {...TOOLS[tab]} />}
        {tab === "chat" && <Chat />}
        {tab === "saved" && <Saved />}
      </main>
    </div>
  );
}

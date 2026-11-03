import { useState } from "react";
import { api } from "../api.js";

export default function Output({ type, prompt, text }) {
  const [note, setNote] = useState("");
  const flash = (m) => { setNote(m); setTimeout(() => setNote(""), 2000); };

  async function copy() {
    try { await navigator.clipboard.writeText(text); flash("Copied!"); } catch { flash("Copy failed"); }
  }
  async function save() {
    try { await api("/posts", { method: "POST", body: { type, prompt, result: text } }); flash("Saved!"); } catch (e) { flash(e.message); }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
      <div className="mt-4 flex items-center gap-2">
        <button onClick={copy} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:border-violet-600">Copy</button>
        {type !== "chat" && <button onClick={save} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:border-violet-600">Save</button>}
        <span role="status" className="text-sm text-violet-700">{note}</span>
      </div>
    </div>
  );
}

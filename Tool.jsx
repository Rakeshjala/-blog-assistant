import { useState } from "react";
import { api } from "../api.js";
import Output from "./Output.jsx";

export default function Tool({ kind, label, placeholder, tone: hasTone }) {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("friendly");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true);
    setError("");
    setResult("");
    try {
      setResult((await api("/ai/" + kind, { method: "POST", body: { input, tone } })).result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <label className="block font-medium">{label}
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} rows={kind === "summary" ? 8 : 3}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 font-normal" />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        {hasTone && (
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="rounded-lg border border-slate-300 bg-white p-2.5" aria-label="Tone">
            {["friendly", "professional", "casual", "persuasive", "funny"].map((t) => <option key={t}>{t}</option>)}
          </select>
        )}
        <button onClick={run} disabled={loading || !input.trim()} className="rounded-lg bg-violet-600 px-5 py-2.5 font-medium text-white hover:bg-violet-700 disabled:opacity-50">
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>
      {loading && <p className="animate-pulse text-slate-500">The AI is writing, this can take a few seconds…</p>}
      {error && <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
      {result && <Output type={kind} prompt={input} text={result} />}
    </section>
  );
}

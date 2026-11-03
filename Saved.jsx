import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Saved() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/posts").then(setPosts).catch((e) => setError(e.message));
  }, []);

  async function remove(id) {
    try { await api("/posts/" + id, { method: "DELETE" }); setPosts(posts.filter((p) => p._id !== id)); } catch (e) { setError(e.message); }
  }

  if (error) return <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{error}</p>;
  if (!posts) return <p className="animate-pulse text-slate-500">Loading…</p>;
  if (!posts.length) return <p className="text-slate-500">Nothing saved yet. Generate something and click Save.</p>;

  return (
    <ul className="space-y-4">
      {posts.map((p) => (
        <li key={p._id} className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-violet-700">{p.type} · {new Date(p.createdAt).toLocaleDateString()}</p>
          <p className="whitespace-pre-wrap leading-relaxed">{p.result}</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => navigator.clipboard.writeText(p.result)} className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:border-violet-600">Copy</button>
            <button onClick={() => remove(p._id)} className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-red-600 hover:border-red-600">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

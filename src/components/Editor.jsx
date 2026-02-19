export function Editor({ markdown, setMarkdown, onParse }) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-glass">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-slate-100">Markdown Editor</h3>
        <button onClick={onParse} className="rounded-lg bg-indigo-400 px-3 py-1 text-xs font-bold text-slate-900">Parse to Slides</button>
      </div>
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="h-64 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100"
        placeholder="## Cover\nHook...\n## Data\nGráfico de RStudio..."
      />
      <p className="mt-2 text-xs text-slate-400">Rule: each <code>##</code> starts a new slide.</p>
    </section>
  );
}

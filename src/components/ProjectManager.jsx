export function ProjectManager({ projects, onOpen, onCreate, onDelete }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Local Project Dashboard</h2>
        <button className="rounded-xl bg-cyan-400 px-3 py-2 text-sm font-bold text-slate-900" onClick={onCreate}>New Project</button>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <article key={p.id} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
            <button className="w-full text-left" onClick={() => onOpen(p.id)}>
              <p className="font-semibold text-slate-100">{p.name}</p>
              <p className="text-xs text-slate-400">Updated: {new Date(p.updatedAt).toLocaleString()}</p>
              <p className="mt-2 line-clamp-3 text-sm text-slate-300">{p.markdown.slice(0, 100)}</p>
            </button>
            <button className="mt-2 text-xs text-rose-300" onClick={() => onDelete(p.id)}>Delete</button>
          </article>
        ))}
      </div>
    </section>
  );
}

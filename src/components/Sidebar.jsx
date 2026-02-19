export function Sidebar({
  audits,
  hints,
  benchmark,
  exportProgress,
  onExportPdf,
  onExportZip,
  onOptimize,
  templateName,
  setTemplateName,
  templates,
  brandName,
  setBrandName,
  showAvatar,
  setShowAvatar,
  onAvatarChange
}) {
  return (
    <aside className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-glass">
      <h3 className="font-semibold text-slate-100">Algorithm Consultant + Premium Template Studio</h3>
      <p className="text-xs text-slate-300">Total words: {audits.totalWords}</p>
      {audits.mobileWarning && <p className="text-xs text-amber-300">Mobile alert: reduce blocks above 320 chars.</p>}
      {audits.quoteIssues.map((q) => <p key={q.index} className="text-xs text-rose-300">Quote slide {q.index} has {q.words} words (&gt;25)</p>)}
      {audits.ctaLooksWeak && <p className="text-xs text-orange-300">Final CTA could trigger stronger comments (add open question).</p>}
      <p className={`text-xs ${benchmark.warning ? 'text-amber-300' : 'text-emerald-300'}`}>Preview FPS: {benchmark.avgFps}</p>
      <p className="text-xs text-cyan-300">Export progress: {exportProgress}%</p>
      <div>
        <label className="text-xs text-slate-300">Premium template family</label>
        <select className="mt-1 w-full rounded-lg bg-slate-800 p-2 text-sm" value={templateName} onChange={(e) => setTemplateName(e.target.value)}>
          {templates.map((name) => <option key={name}>{name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-slate-300">Footer brand</label>
        <input className="mt-1 w-full rounded-lg bg-slate-800 p-2 text-sm" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
      </div>
      <div className="space-y-1 text-xs text-slate-300">
        <label className="flex items-center gap-2"><input type="checkbox" checked={showAvatar} onChange={(e) => setShowAvatar(e.target.checked)} /> Show avatar</label>
        <input type="file" accept="image/*" onChange={onAvatarChange} className="w-full text-xs" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-lg bg-cyan-300 px-2 py-2 text-xs font-bold text-slate-900" onClick={onOptimize}>WASM Optimizer</button>
        <button className="rounded-lg bg-indigo-300 px-2 py-2 text-xs font-bold text-slate-900" onClick={() => onExportPdf('balanced')}>PDF Fast</button>
        <button className="rounded-lg bg-indigo-400 px-2 py-2 text-xs font-bold text-slate-900" onClick={() => onExportPdf('pro')}>PDF Studio</button>
        <button className="rounded-lg bg-violet-300 px-2 py-2 text-xs font-bold text-slate-900" onClick={onExportZip}>Share ZIP</button>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-200">AI-Powered content suggestions</p>
        {hints.length ? hints.map((hint, i) => <p key={i} className="text-xs text-slate-300">• {hint}</p>) : <p className="text-xs text-slate-400">No suggestions yet.</p>}
      </div>
    </aside>
  );
}

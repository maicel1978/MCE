import { LAYOUTS } from '../lib/markdown';

export function SlideManager({ slides, onUpdateSlide, onDuplicate, onDelete }) {
  return (
    <div className="space-y-2 rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
      {slides.map((slide, idx) => (
        <div key={slide.id} className="flex items-center gap-2 rounded-lg bg-slate-800 p-2 text-xs">
          <span className="cursor-grab">⋮⋮</span>
          <input className="flex-1 rounded bg-slate-700 p-1" value={slide.title} onChange={(e) => onUpdateSlide(idx, { title: e.target.value })} />
          <select className="rounded bg-slate-700 p-1" value={slide.layout} onChange={(e) => onUpdateSlide(idx, { layout: e.target.value })}>
            {LAYOUTS.map((layout) => <option key={layout}>{layout}</option>)}
          </select>
          <button onClick={() => onDuplicate(idx)}>Copy</button>
          <button onClick={() => onDelete(idx)} className="text-rose-300">Del</button>
        </div>
      ))}
    </div>
  );
}

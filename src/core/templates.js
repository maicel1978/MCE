export const TEMPLATE_FAMILIES = {
  'Clinical Pro': {
    token: {
      card: 'bg-white text-slate-900 border-slate-300',
      accent: 'text-blue-700',
      footer: 'text-slate-600',
      headline: 'font-bold tracking-tight',
      decor: 'before:absolute before:inset-x-0 before:top-0 before:h-2 before:bg-blue-700',
      font: 'Inter, sans-serif'
    }
  },
  'AI Futurist': {
    token: {
      card: 'bg-slate-950 text-cyan-200 border-cyan-700',
      accent: 'text-lime-300',
      footer: 'text-cyan-300/80',
      headline: 'font-black uppercase tracking-widest',
      decor: 'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_45%)]',
      font: 'Inter, sans-serif'
    }
  },
  'Minimal Research': {
    token: {
      card: 'bg-amber-50 text-zinc-900 border-zinc-300',
      accent: 'text-zinc-700',
      footer: 'text-zinc-500',
      headline: 'font-semibold',
      decor: 'before:absolute before:left-0 before:top-0 before:h-full before:w-2 before:bg-zinc-800',
      font: 'Georgia, serif'
    }
  },
  'Data Storytelling': {
    token: {
      card: 'bg-slate-800 text-orange-100 border-orange-500/40',
      accent: 'text-orange-300',
      footer: 'text-orange-200/75',
      headline: 'font-bold',
      decor: 'before:absolute before:inset-x-0 before:bottom-0 before:h-16 before:bg-gradient-to-t before:from-orange-500/20 before:to-transparent',
      font: 'Roboto, sans-serif'
    }
  },
  'Executive Insight': {
    token: {
      card: 'bg-indigo-950 text-indigo-50 border-indigo-400/50',
      accent: 'text-amber-300',
      footer: 'text-indigo-200/80',
      headline: 'font-black',
      decor: 'before:absolute before:right-0 before:top-0 before:h-24 before:w-24 before:rounded-bl-full before:bg-amber-300/20',
      font: 'Inter, sans-serif'
    }
  }
};

export const TEMPLATE_LAYOUTS = {
  Cover: 'text-center justify-center',
  Index: 'justify-start gap-2',
  'Data-Insight': 'grid grid-rows-[40%_60%] gap-2',
  Quote: 'justify-center text-center',
  Split: 'grid grid-cols-2 gap-3',
  Checklist: 'justify-start gap-2',
  CTA: 'justify-center text-center'
};

export function resolveTemplate(templateName, layout) {
  const family = TEMPLATE_FAMILIES[templateName] ?? TEMPLATE_FAMILIES['Clinical Pro'];
  return {
    ...family,
    layoutClass: TEMPLATE_LAYOUTS[layout] ?? TEMPLATE_LAYOUTS.Split
  };
}

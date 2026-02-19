import { create } from 'zustand';
import { TEMPLATE_FAMILIES } from '../core/templates';
import { auditSlides, makeBenchmarkSample } from '../lib/audit';
import { deleteProject, getProject, listProjects, saveProject } from '../lib/db';
import { markdownToSlides, suggestContentImprovements } from '../lib/markdown';

const seedMarkdown = `## Cover\n# Epidemiología + IA\nConstruye carruseles técnicos con narrativa potente.\n\n## Data-Insight\nGráfico de RStudio: curva ROC por cohorte.\nExplica limitaciones y sesgos.\n\n## CTA\n¿Qué variable clínica agregarías para mejorar este modelo y por qué?`;
const premiumTemplates = Object.keys(TEMPLATE_FAMILIES);

export const useEditorStore = create((set, get) => ({
  projects: [],
  activeProject: null,
  markdown: seedMarkdown,
  slides: markdownToSlides(seedMarkdown),
  templateName: 'Clinical Pro',
  brandName: 'MAICEL MONZON',
  showAvatar: false,
  avatarUrl: '',
  benchmark: { avgFps: 60, warning: false },
  exportProgress: 0,
  premiumTemplates,

  audits: () => auditSlides(get().slides),
  hints: () => suggestContentImprovements(get().slides),

  hydrateProjects: async () => set({ projects: await listProjects() }),
  parseMarkdown: () => set((state) => ({ slides: markdownToSlides(state.markdown) })),
  setMarkdown: (markdown) => set({ markdown }),
  setTemplateName: (templateName) => set({ templateName }),
  setBrandName: (brandName) => set({ brandName }),
  setShowAvatar: (showAvatar) => set({ showAvatar }),
  setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
  setBenchmarkFromFrameTimes: (frameTimes) => set({ benchmark: makeBenchmarkSample(frameTimes) }),
  setExportProgress: (exportProgress) => set({ exportProgress }),

  persist: async () => {
    const { activeProject, brandName, markdown, slides, templateName } = get();
    const saved = await saveProject({ id: activeProject, name: brandName, markdown, slides, templateName });
    set({ activeProject: saved.id, projects: await listProjects() });
  },

  openProject: async (id) => {
    const project = await getProject(id);
    if (!project) return;
    set({
      activeProject: project.id,
      markdown: project.markdown,
      slides: project.slides,
      templateName: project.templateName || 'Clinical Pro',
      brandName: project.name || 'MAICEL MONZON'
    });
  },

  createProject: () => set({ activeProject: null, markdown: seedMarkdown, slides: markdownToSlides(seedMarkdown) }),

  deleteProjectById: async (id) => {
    await deleteProject(id);
    set({ projects: await listProjects() });
  },

  addSlide: () => set((state) => ({
    slides: [...state.slides, { id: crypto.randomUUID(), title: `Slide ${state.slides.length + 1}`, markdown: 'Nuevo contenido', html: '<p>Nuevo contenido</p>', layout: 'Split', elements: {} }]
  })),

  reorderSlides: (oldIndex, newIndex) => set((state) => {
    const copy = [...state.slides];
    const [item] = copy.splice(oldIndex, 1);
    copy.splice(newIndex, 0, item);
    return { slides: copy };
  }),

  duplicateSlide: (idx) => set((state) => {
    const copy = [...state.slides];
    const target = copy[idx];
    copy.splice(idx + 1, 0, { ...target, id: crypto.randomUUID(), title: `${target.title} Copy` });
    return { slides: copy };
  }),

  removeSlide: (idx) => set((state) => ({ slides: state.slides.filter((_, i) => i !== idx) })),
  updateSlide: (idx, patch) => set((state) => ({ slides: state.slides.map((slide, i) => i === idx ? { ...slide, ...patch } : slide) })),
  replaceSlides: (slides) => set({ slides })
}));

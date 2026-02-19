import { useEffect, useMemo, useRef } from 'react';
import Sortable from 'sortablejs';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ProjectManager } from './components/ProjectManager';
import { Sidebar } from './components/Sidebar';
import { SlideManager } from './components/SlideManager';
import { exportCarouselPdf, exportSharePreview, optimizeSlidesWithWorker } from './lib/export';
import { useEditorStore } from './store/useEditorStore';

export default function App() {
  const previewRefs = useRef([]);
  const dragContainer = useRef(null);

  const {
    projects,
    markdown,
    slides,
    templateName,
    brandName,
    showAvatar,
    avatarUrl,
    benchmark,
    exportProgress,
    premiumTemplates,
    hydrateProjects,
    parseMarkdown,
    setMarkdown,
    setTemplateName,
    setBrandName,
    setShowAvatar,
    setAvatarUrl,
    setBenchmarkFromFrameTimes,
    setExportProgress,
    persist,
    openProject,
    createProject,
    deleteProjectById,
    addSlide,
    reorderSlides,
    duplicateSlide,
    removeSlide,
    updateSlide,
    replaceSlides,
    audits,
    hints,
  } = useEditorStore();

  const auditData = useMemo(() => audits(), [slides]);
  const hintData = useMemo(() => hints(), [slides]);

  useEffect(() => {
    hydrateProjects();
  }, [hydrateProjects]);

  useEffect(() => {
    const sample = [];
    let last = performance.now();
    let frame;
    const loop = (now) => {
      sample.push(now - last);
      last = now;
      if (sample.length > 60) sample.shift();
      setBenchmarkFromFrameTimes(sample);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [setBenchmarkFromFrameTimes]);

  useEffect(() => {
    if (!dragContainer.current) return;
    const sortable = Sortable.create(dragContainer.current, {
      animation: 150,
      onEnd: ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex) return;
        reorderSlides(oldIndex, newIndex);
      }
    });
    return () => sortable.destroy();
  }, [reorderSlides, slides]);

  const handleExportPdf = async (quality) => {
    setExportProgress(0);
    await exportCarouselPdf(previewRefs.current.filter(Boolean), {
      quality,
      onProgress: setExportProgress,
      templateName
    });
  };

  return (
    <main className="grid-bg min-h-screen bg-slate-950 p-4 text-slate-100">
      <header className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="mr-auto text-2xl font-black">Maicel's Carousel Engine</h1>
        <button onClick={persist} className="rounded-xl bg-emerald-400 px-3 py-2 text-sm font-bold text-slate-900">Save Local</button>
        <button onClick={addSlide} className="rounded-xl bg-slate-700 px-3 py-2 text-sm">+ Slide</button>
      </header>

      <ProjectManager projects={projects} onOpen={openProject} onCreate={createProject} onDelete={deleteProjectById} />

      <section className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <Editor markdown={markdown} setMarkdown={setMarkdown} onParse={parseMarkdown} />
          <div ref={dragContainer}>
            <SlideManager
              slides={slides}
              onUpdateSlide={updateSlide}
              onDuplicate={duplicateSlide}
              onDelete={removeSlide}
            />
          </div>
        </div>

        <div className="max-h-[80vh] overflow-auto rounded-2xl border border-slate-700 bg-slate-900/60 p-3">
          <Preview slides={slides} templateName={templateName} brandName={brandName} showAvatar={showAvatar} avatarUrl={avatarUrl} previewRefs={previewRefs} />
        </div>

        <Sidebar
          audits={auditData}
          hints={hintData}
          benchmark={benchmark}
          exportProgress={exportProgress}
          templates={premiumTemplates}
          templateName={templateName}
          setTemplateName={setTemplateName}
          brandName={brandName}
          setBrandName={setBrandName}
          showAvatar={showAvatar}
          setShowAvatar={setShowAvatar}
          onAvatarChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setAvatarUrl(URL.createObjectURL(file));
          }}
          onOptimize={async () => replaceSlides(await optimizeSlidesWithWorker(slides))}
          onExportPdf={handleExportPdf}
          onExportZip={() => exportSharePreview({ name: brandName, templateName }, slides.map((s) => s.html))}
        />
      </section>
    </main>
  );
}

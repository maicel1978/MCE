export function auditSlides(slides) {
  const totalWords = slides.reduce((acc, slide) => acc + slide.markdown.split(/\s+/).filter(Boolean).length, 0);
  const quoteIssues = slides
    .map((slide, i) => ({ slide, i }))
    .filter(({ slide }) => slide.layout === 'Quote')
    .map(({ slide, i }) => ({ index: i + 1, words: slide.markdown.split(/\s+/).filter(Boolean).length }))
    .filter(({ words }) => words > 25);

  const cta = slides[slides.length - 1];
  const ctaLooksWeak = cta ? !/(\?|comparte|debate|opin)/i.test(cta.markdown) : true;

  return {
    totalWords,
    quoteIssues,
    ctaLooksWeak,
    mobileWarning: slides.some((s) => s.markdown.length > 320)
  };
}

export function makeBenchmarkSample(frameTimes) {
  if (!frameTimes.length) return { avgFps: 60, warning: false };
  const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
  const fps = Math.round(1000 / avg);
  return { avgFps: fps, warning: fps < 60 };
}

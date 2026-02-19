import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ gfm: true, breaks: true });

export const LAYOUTS = ['Cover', 'Index', 'Data-Insight', 'Quote', 'Split', 'Checklist', 'CTA'];

const layoutRules = [
  { regex: /(gráfico|grafico|rstudio|figure|plot)/i, layout: 'Data-Insight' },
  { regex: /(pasos|checklist|lista|to\s?do)/i, layout: 'Checklist' },
  { regex: /(cita|quote|frase)/i, layout: 'Quote' },
  { regex: /(índice|index|agenda|mapa)/i, layout: 'Index' },
  { regex: /(pregunta|debate|opinión|opinion|qué\s+harías|what\s+would\s+you\s+do)/i, layout: 'CTA' }
];

export function createSlideFromMarkdown(block, index) {
  const heading = block.match(/^##\s+(.+)$/m)?.[1] ?? `Slide ${index + 1}`;
  const content = block.replace(/^##\s+.+$/m, '').trim();
  const layout = layoutRules.find((rule) => rule.regex.test(block))?.layout ?? (index === 0 ? 'Cover' : 'Split');
  const unsafeHtml = marked.parse(content || '');
  const html = DOMPurify.sanitize(unsafeHtml);

  return {
    id: crypto.randomUUID(),
    title: heading,
    markdown: content,
    html,
    layout,
    elements: inferElements(content, layout)
  };
}

function inferElements(content, layout) {
  const lines = content.split('\n').filter(Boolean);
  const text = lines.filter((line) => !/^!\[.*\]\(.*\)$/.test(line));
  const image = lines.find((line) => /^!\[.*\]\(.*\)$/.test(line));

  return {
    header: text.slice(0, 2).join(' '),
    bullets: text.filter((line) => /^[-*]\s+/.test(line)).map((line) => line.replace(/^[-*]\s+/, '')),
    body: text.join('\n'),
    image,
    layout
  };
}

export function markdownToSlides(markdown) {
  const blocks = markdown
    .split(/\n(?=##\s+)/g)
    .map((entry) => entry.trim())
    .filter(Boolean);

  return blocks.map(createSlideFromMarkdown);
}

export function suggestContentImprovements(slides) {
  const hints = [];
  slides.forEach((slide, i) => {
    const words = slide.markdown.split(/\s+/).filter(Boolean).length;
    if (words > 55) hints.push(`Slide ${i + 1}: reduce dense text (${words} words) for mobile readability.`);
    if (/gráfico\s+de\s+rstudio|rstudio/i.test(slide.markdown)) hints.push(`Slide ${i + 1}: add a figure legend and source below the chart.`);
    if (slide.layout === 'CTA' && !/\?/.test(slide.markdown)) hints.push(`Slide ${i + 1}: CTA should end with an open question.`);
    if (/\b(very|muy|bastante|obviamente)\b/gi.test(slide.markdown)) hints.push(`Slide ${i + 1}: replace vague terms with measurable evidence.`);
  });
  return hints;
}

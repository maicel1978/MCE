import html2canvas from 'html2canvas';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export async function optimizeSlidesWithWorker(slides) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./export-worker.js', import.meta.url), { type: 'module' });
    worker.onmessage = (event) => {
      if (event.data.type === 'WASM_DONE') {
        resolve(event.data.payload);
        worker.terminate();
      }
    };
    worker.onerror = reject;
    worker.postMessage({ type: 'SIMULATE_WASM_OPTIMIZATION', payload: slides });
  });
}

async function renderSlidesInChunks(nodeList, quality = 'balanced', onProgress) {
  const scale = quality === 'pro' ? 2.4 : 1.4;
  const chunkSize = quality === 'pro' ? 2 : 3;
  const rendered = [];

  for (let i = 0; i < nodeList.length; i += chunkSize) {
    const batch = nodeList.slice(i, i + chunkSize);
    const canvases = await Promise.all(batch.map((node) => html2canvas(node, { scale, backgroundColor: '#0f172a' })));
    rendered.push(...canvases);
    onProgress?.(Math.round((rendered.length / nodeList.length) * 100));
    await new Promise((r) => setTimeout(r, 0));
  }

  return rendered;
}

export async function exportCarouselPdf(nodeList, options = {}) {
  const pdf = await PDFDocument.create();
  const canvases = await renderSlidesInChunks(nodeList, options.quality, options.onProgress);

  for (const canvas of canvases) {
    const image = await pdf.embedPng(canvas.toDataURL('image/png'));
    const page = pdf.addPage([1080, 1350]);
    page.drawImage(image, { x: 0, y: 0, width: 1080, height: 1350 });
  }

  const bytes = await pdf.save();
  const label = options.templateName ? options.templateName.toLowerCase().replace(/\s+/g, '-') : 'template';
  downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `mce-${label}-carousel.pdf`);
}

export async function exportSharePreview(project, slidesHtml) {
  const zip = new JSZip();
  zip.file('project.json', JSON.stringify(project, null, 2));
  zip.file(
    'preview.html',
    `<!doctype html><html><head><meta charset='utf-8'><title>${project.name}</title><style>body{font-family:Inter,sans-serif;background:#020617;color:#e2e8f0;padding:16px}.slide{margin:20px auto;padding:30px;max-width:900px;border:1px solid #1e293b;border-radius:16px;background:#0f172a}</style></head><body>${slidesHtml
      .map((html) => `<section class='slide'>${html}</section>`)
      .join('')}</body></html>`
  );
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, `${project.name || 'mce'}-share-preview.zip`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

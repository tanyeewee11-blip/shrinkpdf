/**
 * mupdf-worker.js — ES Module Worker
 * mupdf-wasm.js 和 mupdf-wasm.wasm 必须在同一目录
 */
import muPDFInit from './mupdf-wasm.js';

let mupdfInstance = null;

async function getMuPDF() {
  if (!mupdfInstance) {
    // 不传 locateFile，让它用 import.meta.url 自动找 .wasm 文件
    mupdfInstance = await muPDFInit();
  }
  return mupdfInstance;
}

const LEVEL_OPTIONS = {
  light:  'compress,compress-images,compress-fonts,garbage=2,sanitize',
  medium: 'compress,compress-images,compress-fonts,garbage=3,sanitize',
  strong: 'compress,compress-images,compress-fonts,garbage=4,sanitize',
};

self.onmessage = async (e) => {
  const { id, type, payload } = e.data;
  if (type !== 'compress') return;

  const progress = (pct, msg) => self.postMessage({ id, type: 'progress', pct, msg });

  try {
    progress(5, 'Loading MuPDF engine…');
    const mupdf = await getMuPDF();

    progress(20, 'Opening PDF…');
    const uint8 = new Uint8Array(payload.arrayBuffer);
    const doc = mupdf.Document.openDocument(uint8, 'application/pdf');
    const pdfDoc = doc.asPDF();

    progress(50, 'Compressing streams…');
    const saveOpts = LEVEL_OPTIONS[payload.level] || LEVEL_OPTIONS.medium;
    const outputBuffer = pdfDoc.saveToBuffer(saveOpts);

    progress(90, 'Finalising…');
    const outputUint8 = outputBuffer.asUint8Array();
    const resultBuffer = outputUint8.buffer.slice(
      outputUint8.byteOffset,
      outputUint8.byteOffset + outputUint8.byteLength
    );

    pdfDoc.destroy();

    progress(100, 'Done!');
    self.postMessage({ id, type: 'result', buffer: resultBuffer }, [resultBuffer]);

  } catch (err) {
    self.postMessage({ id, type: 'error', message: err.message || String(err) });
  }
};

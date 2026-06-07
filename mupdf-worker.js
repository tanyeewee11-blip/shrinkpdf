/**
 * mupdf-worker.js — ES Module Worker
 * 需要同目录有: mupdf.js, mupdf-wasm.js, mupdf-wasm.wasm
 */
import * as mupdf from './mupdf.js';

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

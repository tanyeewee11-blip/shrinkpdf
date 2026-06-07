/**
 * mupdf-worker.js
 * 放在网站根目录。使用本地 mupdf-wasm.js + mupdf-wasm.wasm
 */

// 加载本地 mupdf-wasm.js（浏览器版）
importScripts('mupdf-wasm.js');

let mupdfInstance = null;

async function getMuPDF() {
  if (!mupdfInstance) {
    // mupdf-wasm.js 暴露全局 _ 函数，调用后返回 mupdf 实例
    mupdfInstance = await self._(
      { locateFile: (file) => file }  // 告诉它从同目录加载 .wasm
    );
  }
  return mupdfInstance;
}

const LEVEL_OPTIONS = {
  light:  "compress,compress-images,compress-fonts,garbage=2,sanitize",
  medium: "compress,compress-images,compress-fonts,garbage=3,sanitize",
  strong: "compress,compress-images,compress-fonts,garbage=4,sanitize",
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

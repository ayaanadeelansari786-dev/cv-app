// src/utils/pdfExtract.js
// Utility to extract plain text from a PDF using pdfjs-dist

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const maxPages = pdf.numPages;
  let fullText = '';
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(' ') + '\n';
  }
  return fullText;
}

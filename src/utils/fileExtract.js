// src/utils/fileExtract.js
// Unified utility to extract plain text from various file formats: PDF, DOCX, Images, and plain text.

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Extracts plain text from a PDF file.
 */
async function extractTextFromPdf(file) {
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

/**
 * Extracts plain text from a DOCX file using mammoth.
 */
async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value; // The raw text extracted from the document
}

/**
 * Extracts plain text from an image file using Tesseract.js OCR.
 */
async function extractTextFromImage(file, onProgress) {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      file,
      'eng',
      {
        logger: m => {
          if (onProgress && m.status === 'recognizing') {
            const pct = Math.round(m.progress * 100);
            onProgress(`OCR in progress: ${pct}%`);
          }
        }
      }
    )
    .then(({ data: { text } }) => {
      resolve(text);
    })
    .catch(err => {
      reject(err);
    });
  });
}

/**
 * Main unified extraction function.
 * @param {File} file - The file object from dropzone or input.
 * @param {Function} [onStatusChange] - Callback to report status/progress updates.
 */
export async function extractTextFromFile(file, onStatusChange) {
  const type = file.type;
  const name = file.name.toLowerCase();

  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    if (onStatusChange) onStatusChange('Extracting PDF text...');
    return await extractTextFromPdf(file);
  } 
  
  if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    name.endsWith('.docx')
  ) {
    if (onStatusChange) onStatusChange('Parsing Word document text...');
    return await extractTextFromDocx(file);
  }
  
  if (
    type.startsWith('image/') || 
    name.endsWith('.png') || 
    name.endsWith('.jpg') || 
    name.endsWith('.jpeg') || 
    name.endsWith('.webp')
  ) {
    if (onStatusChange) onStatusChange('Initializing OCR for image...');
    return await extractTextFromImage(file, onStatusChange);
  }
  
  if (
    type.startsWith('text/') || 
    name.endsWith('.txt') || 
    name.endsWith('.rtf') || 
    name.endsWith('.md') || 
    name.endsWith('.csv')
  ) {
    if (onStatusChange) onStatusChange('Reading text file...');
    return await file.text();
  }

  throw new Error(`Unsupported file format. Please upload PDF, DOCX, JPG, PNG, or TXT.`);
}

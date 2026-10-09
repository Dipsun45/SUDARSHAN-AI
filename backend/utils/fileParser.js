import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const AdmZip = require('adm-zip');

export const parseFileContent = async (file) => {
  if (!file || !file.buffer) return { text: '', isImage: false };

  const filename = file.originalname || 'uploaded_file';
  const extension = filename.split('.').pop().toLowerCase();
  const mimetype = file.mimetype || '';

  try {
    // 1. PDF Documents
    if (extension === 'pdf' || mimetype.includes('pdf')) {
      const parsed = await pdf(file.buffer);
      const cleanText = parsed.text.replace(/\r\n/g, '\n').trim();
      return {
        text: `\n=== PDF DOCUMENT ATTACHMENT: ${filename} (${parsed.numpages} Pages) ===\n${cleanText}\n=== END OF PDF DOCUMENT ===\n`,
        isImage: false
      };
    }

    // 2. Word Documents (DOCX / DOC)
    if (extension === 'docx' || extension === 'doc' || mimetype.includes('word')) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      const cleanText = result.value.trim();
      return {
        text: `\n=== WORD DOCUMENT ATTACHMENT: ${filename} ===\n${cleanText}\n=== END OF WORD DOCUMENT ===\n`,
        isImage: false
      };
    }

    // 3. ZIP Archives
    if (extension === 'zip' || mimetype.includes('zip')) {
      const zip = new AdmZip(file.buffer);
      const zipEntries = zip.getEntries();
      let zipSummary = `\n=== ZIP ARCHIVE ATTACHMENT: ${filename} (Contains ${zipEntries.length} items) ===\n`;

      const codeExtensions = ['txt', 'js', 'jsx', 'ts', 'tsx', 'json', 'md', 'html', 'css', 'py', 'csv', 'java', 'c', 'cpp', 'h', 'php', 'rb', 'go', 'rs', 'sql', 'xml', 'yaml', 'yml', 'env'];

      for (const entry of zipEntries) {
        if (!entry.isDirectory) {
          const entryExt = entry.entryName.split('.').pop().toLowerCase();
          if (codeExtensions.includes(entryExt)) {
            try {
              const content = zip.readAsText(entry);
              zipSummary += `\n--- File: ${entry.entryName} ---\n${content.substring(0, 5000)}\n`;
            } catch (e) {
              zipSummary += `\n--- File: ${entry.entryName} (Size: ${entry.header.size} bytes) ---\n`;
            }
          } else {
            zipSummary += `\n--- File: ${entry.entryName} (Binary/Media File, ${entry.header.size} bytes) ---\n`;
          }
        }
      }
      zipSummary += `\n=== END OF ZIP ARCHIVE ATTACHMENT ===\n`;
      return { text: zipSummary, isImage: false };
    }

    // 4. Images (Multimodal Vision API Support for Gemini)
    if (['png', 'jpg', 'jpeg', 'webp'].includes(extension) || mimetype.includes('image')) {
      const base64Data = file.buffer.toString('base64');
      const imgMime = mimetype || `image/${extension === 'jpg' ? 'jpeg' : extension}`;
      return {
        text: `\n=== IMAGE ATTACHMENT: ${filename} ===\n[An image file ${filename} is attached for analysis]\n=== END OF IMAGE ATTACHMENT ===\n`,
        isImage: true,
        base64: base64Data,
        mimeType: imgMime,
        filename
      };
    }

    // 5. Code, Text, CSV, JSON, Markdown Files
    const textContent = file.buffer.toString('utf8');
    return {
      text: `\n=== FILE ATTACHMENT: ${filename} ===\n${textContent}\n=== END OF ATTACHMENT ===\n`,
      isImage: false
    };

  } catch (err) {
    console.error(`Error parsing file ${filename}:`, err);
    return {
      text: `\n=== ATTACHMENT ERROR: Could not parse ${filename} (${err.message}) ===\n`,
      isImage: false
    };
  }
};

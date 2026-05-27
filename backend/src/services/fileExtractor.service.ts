import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import { logger } from '../utils/logger';

const MAX_SOURCE_TEXT_LENGTH = 12000;

const normalizeText = (value: string): string =>
  value
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_SOURCE_TEXT_LENGTH);

export const titleFromFileName = (fileName: string): string =>
  fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const extractUploadedText = async (file?: Express.Multer.File): Promise<string> => {
  if (!file) return '';

  const name = file.originalname.toLowerCase();
  const mimeType = file.mimetype;

  try {
    if (mimeType === 'application/pdf' || name.endsWith('.pdf')) {
      const parser = new PDFParse({ data: file.buffer });
      try {
        const result = await parser.getText();
        return normalizeText(result.text || '');
      } finally {
        await parser.destroy();
      }
    }

    if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      name.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return normalizeText(result.value || '');
    }

    if (mimeType.startsWith('text/') || name.endsWith('.txt')) {
      return normalizeText(file.buffer.toString('utf8'));
    }
  } catch (error) {
    logger.warn(`Could not extract text from ${file.originalname}: ${error instanceof Error ? error.message : error}`);
  }

  return '';
};

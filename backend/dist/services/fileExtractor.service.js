"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUploadedText = exports.titleFromFileName = void 0;
const mammoth_1 = __importDefault(require("mammoth"));
const pdf_parse_1 = require("pdf-parse");
const logger_1 = require("../utils/logger");
const MAX_SOURCE_TEXT_LENGTH = 12000;
const normalizeText = (value) => value
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_SOURCE_TEXT_LENGTH);
const titleFromFileName = (fileName) => fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
exports.titleFromFileName = titleFromFileName;
const extractUploadedText = async (file) => {
    if (!file)
        return '';
    const name = file.originalname.toLowerCase();
    const mimeType = file.mimetype;
    try {
        if (mimeType === 'application/pdf' || name.endsWith('.pdf')) {
            const parser = new pdf_parse_1.PDFParse({ data: file.buffer });
            try {
                const result = await parser.getText();
                return normalizeText(result.text || '');
            }
            finally {
                await parser.destroy();
            }
        }
        if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            name.endsWith('.docx')) {
            const result = await mammoth_1.default.extractRawText({ buffer: file.buffer });
            return normalizeText(result.value || '');
        }
        if (mimeType.startsWith('text/') || name.endsWith('.txt')) {
            return normalizeText(file.buffer.toString('utf8'));
        }
    }
    catch (error) {
        logger_1.logger.warn(`Could not extract text from ${file.originalname}: ${error instanceof Error ? error.message : error}`);
    }
    return '';
};
exports.extractUploadedText = extractUploadedText;
//# sourceMappingURL=fileExtractor.service.js.map
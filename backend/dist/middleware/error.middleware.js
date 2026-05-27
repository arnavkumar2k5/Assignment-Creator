"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, _next) => {
    const isFileTooLarge = err.code === 'LIMIT_FILE_SIZE';
    const statusCode = isFileTooLarge ? 413 : err.statusCode || 500;
    const message = isFileTooLarge ? 'Uploaded file is too large. Maximum size is 5 MB.' : err.message || 'Internal Server Error';
    logger_1.logger.error(`❌ ${req.method} ${req.url} - ${statusCode}: ${message}`);
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
const notFound = (req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};
exports.notFound = notFound;
//# sourceMappingURL=error.middleware.js.map
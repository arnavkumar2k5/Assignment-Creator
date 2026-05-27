import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

export const errorHandler = (err: AppError, req: Request, res: Response, _next: NextFunction) => {
  const isFileTooLarge = err.code === 'LIMIT_FILE_SIZE';
  const statusCode = isFileTooLarge ? 413 : err.statusCode || 500;
  const message = isFileTooLarge ? 'Uploaded file is too large. Maximum size is 5 MB.' : err.message || 'Internal Server Error';

  logger.error(`❌ ${req.method} ${req.url} - ${statusCode}: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

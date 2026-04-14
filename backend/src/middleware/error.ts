import type { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error('[ERROR]', err);

  if (err.message === 'Unauthorized') {
    return sendError(res, 'Unauthorized', 401);
  }

  if (err.message === 'Forbidden') {
    return sendError(res, 'Forbidden', 403);
  }

  if (err.message === 'Not Found') {
    return sendError(res, 'Not Found', 404);
  }

  sendError(res, err.message || 'Internal server error', 500);
}

export function notFoundHandler(req: Request, res: Response) {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
}

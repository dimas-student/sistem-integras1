import type { Response } from 'express';
import type { ApiResponse } from '../types/index.js';

export function sendSuccess<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  res.status(statusCode).json(response);
}

export function sendError(res: Response, error: string, statusCode = 400) {
  const response: ApiResponse<null> = {
    success: false,
    error,
  };
  res.status(statusCode).json(response);
}

export function sendPaginatedSuccess<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Success',
  statusCode = 200
) {
  const response = {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    message,
  };
  res.status(statusCode).json(response);
}

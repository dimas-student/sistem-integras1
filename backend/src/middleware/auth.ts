import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';
import type { JwtPayload } from '../types/index.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Missing or invalid authorization header', 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);

  if (!payload) {
    return sendError(res, 'Invalid or expired token', 401);
  }

  req.user = payload;
  next();
}

export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'User not authenticated', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Insufficient permissions', 403);
    }

    next();
  };
}

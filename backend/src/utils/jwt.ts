import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { JwtPayload } from '../types/index.js';

export function generateToken(payload: JwtPayload, expiresIn: string = env.JWT_EXPIRY): string {
  return jwt.sign(payload, env.JWT_SECRET as string, { expiresIn } as any);
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET as string) as JwtPayload;
  } catch {
    return null;
  }
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}

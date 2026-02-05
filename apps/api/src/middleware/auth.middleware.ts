import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

export interface JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      userId?: string;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret-change-me'
    ) as JwtPayload;

    req.user = decoded;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid or expired token', 401));
    } else {
      next(error);
    }
  }
}

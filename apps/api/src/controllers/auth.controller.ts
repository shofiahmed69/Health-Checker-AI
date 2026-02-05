import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess } from '../utils/response.utils';
import { validate } from '../middleware/validate.middleware';
import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must include uppercase, lowercase, and number'),
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
];

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await authService.register(req.body);
    sendSuccess(res, result, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
}

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

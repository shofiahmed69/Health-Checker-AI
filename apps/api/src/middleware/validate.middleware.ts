import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from '../utils/AppError';

export function validate(validations: ValidationChain[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    await Promise.all(validations.map((v) => v.run(req)));
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const message = errors.array().map((e) => `${(e as { path?: string }).path ?? 'field'}: ${e.msg}`).join(', ');
    next(new AppError(message, 400));
  };
}

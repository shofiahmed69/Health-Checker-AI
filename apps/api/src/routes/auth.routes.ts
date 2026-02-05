import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.post(
  '/register',
  validate(authController.registerValidation),
  authController.register
);

router.post(
  '/login',
  validate(authController.loginValidation),
  authController.login
);

export default router;

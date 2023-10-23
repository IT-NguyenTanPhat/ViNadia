import { Router } from 'express';
import { errorHandler, upload } from '../middlewares';
import { AuthController } from '../controllers';
import {
  loginValidator,
  refreshTokenValidator,
  registerValidator,
} from '../validators/auth.validator';

const router = Router();

// PATH: /auth

router.post('/login', loginValidator, errorHandler, AuthController.login);

router.get('/google', AuthController.google);

router.post(
  '/register',
  upload.single('avatar'),
  registerValidator,
  errorHandler,
  AuthController.register
);

router.post(
  '/refresh-token',
  refreshTokenValidator,
  errorHandler,
  AuthController.refreshToken
);

export default router;

import { Router } from 'express';
import { upload } from '../middlewares';
import { AuthController } from './auth.controller';

const router = Router();

// PATH: /auth

router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/register', upload.single('avatar'), AuthController.register);

export { router as AuthRoute };

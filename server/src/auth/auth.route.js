import { Router } from 'express';
import { upload } from '../middlewares/index.js';
import { AuthController } from './auth.controller.js';

const router = Router();

// PATH: /auth

router.post('/login', AuthController.login);
router.post('/register', upload.single('avatar'), AuthController.register);

export { router as AuthRoute };

import { Router } from 'express';
import { upload } from '../middlewares';
import { AuthController } from './auth.controller';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', upload.single('avatar'), AuthController.register);

export { router as AuthRoute };

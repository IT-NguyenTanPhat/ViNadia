import { Router } from 'express';
const router = Router();
import { verifyToken } from '../middlewares/index.js';
import { UserController } from './user.controller.js';

// PATH: /users

router.use(verifyToken);
router.get('/:id', UserController.getUser);
router.get('/:id/posts', UserController.getUserPosts);
router.get('/:id/suggested-friends', UserController.getSuggestedFriends);

export { router as UserRoute };

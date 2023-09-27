import { Router } from 'express';
const router = Router();
import { verifyToken } from '../middlewares';
import { UserController } from './user.controller';

// PATH: /users

router.use(verifyToken);
router.get('/:id', UserController.getUserProfile);
router.get('/:id/posts', UserController.getUserPosts);
router.get('/:id/suggested-friends', UserController.getSuggestedFriends);

export { router as UserRoute };

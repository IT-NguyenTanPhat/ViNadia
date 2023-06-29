import { Router } from 'express';
const router = Router();
import { verifyToken } from '../middlewares/index.js';
import { UserController } from './user.controller.js';

// PATH: /users

router.use(verifyToken);
router.get('/:id', UserController.getUser);

router.get('/:id/friends', UserController.getUserFriends);
router.get('/:id/suggested-friends', UserController.getSuggestedFriends);

router.patch('/:id/:friendId', UserController.addRemoveFriend);

export { router as UserRoute };

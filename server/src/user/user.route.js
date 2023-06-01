import { Router } from 'express';
const router = Router();
import { verifyToken } from '../middlewares/index.js';
import { UserController } from './user.controller.js';

router.use(verifyToken);

router.get('/:id', UserController.getUser);
router.get('/:id/friends', UserController.getUserFriends);

router.patch('/:id/:friendId', UserController.addRemoveFriend);

export { router as UserRoute };

import { Router } from 'express';
const router = Router();
import { verifyToken } from '../middlewares';
import { UserController } from './user.controller';

router.use(verifyToken);

router.get('/:id', UserController.getUser);
router.get('/:id/friends', UserController.getUserFriends);

router.patch('/:id/:friendId', UserController.addRemoveFriend);

export { router as UserRoute };

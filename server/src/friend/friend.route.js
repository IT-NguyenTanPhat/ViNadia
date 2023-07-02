import { Router } from 'express';
const router = Router();
import { verifyToken } from '../middlewares/index.js';
import { FriendController } from './friend.controller.js';

// PATH: /friends

router.use(verifyToken);
router.get('/:userId', FriendController.getUserFriends);
router.get('/:userId/:friendId', FriendController.getFriendStatus);
router.post('/:userId', FriendController.createFriendRequest);
router.patch('/:userId', FriendController.acceptFriendRequest);
router.delete('/:userId', FriendController.rejectOrUnFriend);

export { router as FriendRoute };

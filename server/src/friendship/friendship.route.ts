import { Router } from 'express';
const router = Router();
import { verifyToken } from '../middlewares';
import { FriendshipController } from './friendship.controller';

// PATH: /friends

router.use(verifyToken);
router.get('/:userId', FriendshipController.getUserFriends);
router.get('/:userId/:friendId', FriendshipController.getFriendStatus);
router.post('/:userId', FriendshipController.createFriendRequest);
router.patch('/:userId', FriendshipController.acceptFriendRequest);
router.delete('/:userId', FriendshipController.rejectOrUnFriend);

export { router as FriendshipRoute };

import { Router } from 'express';
const router = Router();
import { errorHandler, verifyToken } from '../middlewares';
import { FriendshipController } from '../controllers';
import {
  friendRequestValidator,
  getFriendStatusValidator,
  getUserFriendsValidator,
} from '../validators/friendship.validator';

// PATH: /friends

router.use(verifyToken);

router.get(
  '/:userId',
  getUserFriendsValidator,
  errorHandler,
  FriendshipController.getUserFriends
);

router.get(
  '/:userId/:friendId',
  getFriendStatusValidator,
  errorHandler,
  FriendshipController.getFriendStatus
);

router.post(
  '/:userId',
  friendRequestValidator,
  errorHandler,
  FriendshipController.createFriendRequest
);

router.patch(
  '/:userId',
  friendRequestValidator,
  errorHandler,
  FriendshipController.acceptFriendRequest
);

router.delete(
  '/:userId',
  friendRequestValidator,
  errorHandler,
  FriendshipController.rejectOrUnFriend
);

export default router;

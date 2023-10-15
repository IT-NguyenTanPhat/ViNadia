import { Router } from 'express';
const router = Router();
import { errorHandler, verifyToken } from '../middlewares';
import { UserController } from '../controllers';
import { userIdValidator } from '../validators/user.validator';

// PATH: /users

router.use(verifyToken);

router.get(
  '/:userId',
  userIdValidator,
  errorHandler,
  UserController.getUserProfile
);

router.get(
  '/:userId/posts',
  userIdValidator,
  errorHandler,
  UserController.getUserPosts
);

router.get(
  '/:userId/suggested-friends',
  userIdValidator,
  errorHandler,
  UserController.getSuggestedFriends
);

export default router;

import { Router } from 'express';
const router = Router();
import { errorHandler, upload, verifyToken } from '../middlewares';
import { PostController } from '../controllers';
import {
  createPostValidator,
  likeOrDislikePostValidator,
} from '../validators/post.validator';

// PATH: /posts

router.get('/feed', PostController.getFeedPosts);

router.use(verifyToken);

router.post(
  '/',
  upload.single('post'),
  createPostValidator,
  errorHandler,
  PostController.createPost
);
router.patch(
  '/:postId/like',
  likeOrDislikePostValidator,
  errorHandler,
  PostController.likeOrDislikePost
);

export default router;

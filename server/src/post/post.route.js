import { Router } from 'express';
const router = Router();
import { upload, verifyToken } from '../middlewares';
import { PostController } from './post.controller';

router.get('/', PostController.getFeedPosts);

router.use(verifyToken);

router.post('/', upload.single('post'), PostController.createPost);
router.get('/:userId/posts', PostController.getUserPosts);
router.patch('/:id/like', PostController.likePost);

export { router as PostRoute };

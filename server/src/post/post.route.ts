import { Router } from 'express';
const router = Router();
import { upload, verifyToken } from '../middlewares';
import { PostController } from './post.controller';

// PATH: /posts

router.get('/feed', PostController.getFeedPosts);

router.use(verifyToken);

router.post('/', upload.single('post'), PostController.createPost);
router.patch('/:id/like', PostController.likeOrDislikePost);

export { router as PostRoute };

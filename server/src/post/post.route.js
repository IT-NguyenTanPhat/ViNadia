import { Router } from 'express';
const router = Router();
import { upload, verifyToken } from '../middlewares/index.js';
import { PostController } from './post.controller.js';

// PATH: /posts

router.get('/', PostController.getFeedPosts);

router.use(verifyToken);

router.post('/', upload.single('post'), PostController.createPost);
router.patch('/:id/like', PostController.likePost);

export { router as PostRoute };

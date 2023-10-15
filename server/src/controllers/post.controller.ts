import { Request, Response } from 'express';
import { PostModel, UserModel } from '../models';
import { catchAsync } from '../middlewares';
import redis from '../config/redis';

export const PostController = {
  // POST /posts
  createPost: catchAsync(async (req: Request, res: Response) => {
    const image = req.file?.path?.replace('public', '');
    const post = await PostModel.create({ ...req.body, image });

    // Reset related data on redis
    await redis.del(`${req.body.author}-posts`);
    res.status(201).json({ post });
  }),

  // GET /posts/feed
  getFeedPosts: catchAsync(async (req: Request, res: Response) => {
    const posts = await PostModel.find()
      .populate({
        path: 'author',
        select: 'name avatar',
      })
      .lean();
    res.status(200).json({ posts });
  }),

  // PATCH /posts/:id/like
  likeOrDislikePost: catchAsync(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { userId } = req.body;

    // Check existed user
    const isExistedUser = await UserModel.exists({ _id: userId });
    if (!isExistedUser)
      return res.status(404).json({ message: 'User not found' });

    // Check existed post
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Liked or not
    const isLiked = post.likes.includes(userId);
    if (!isLiked) post.likes.push(userId);
    else post.likes = post.likes.filter((like) => like != userId);

    const updated = await PostModel.findByIdAndUpdate(
      postId,
      { likes: post.likes },
      { new: true }
    )
      .populate({ path: 'author', select: 'name avatar' })
      .lean();

    await redis.del(`${post.author}-posts`);
    res.status(200).json({ post: updated });
  }),
};

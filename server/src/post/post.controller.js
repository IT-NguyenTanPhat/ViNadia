import { PostModel } from './post.model.js';

export const PostController = {
  // POST /posts
  createPost: async (req, res) => {
    try {
      const image = req.file?.path?.replace('public', '');
      const post = await PostModel.create({ ...req.body, image });
      res.status(201).json(post);
    } catch (error) {
      console.log(`createPost: ${error}`);
      res.status(409).json({ error: error.message });
    }
  },

  // GET /posts
  getFeedPosts: async (req, res) => {
    try {
      const posts = await PostModel.find()
        .populate({
          path: 'author',
          select: 'name avatar',
        })
        .lean();
      res.status(200).json(posts);
    } catch (error) {
      console.log(`getFeedPosts: ${error}`);
      res.status(404).json({ error: error.message });
    }
  },

  // PATCH /posts/:id/like
  likePost: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id: userId } = req.user;

      const post = await PostModel.findById(id);
      const isLiked = post.likes.includes(userId);

      if (!isLiked) {
        post.likes.push(userId);
      } else {
        post.likes = post.likes.filter((like) => like != userId);
      }

      const updated = await PostModel.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
      )
        .populate({
          path: 'author',
          select: 'name avatar',
        })
        .lean();
      res.status(200).json(updated);
    } catch (error) {
      console.log(`likePost: ${error}`);
      res.status(500).json({ error: error.message });
    }
  },
};

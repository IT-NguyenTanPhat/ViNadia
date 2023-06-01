import { PostModel } from './post.model';

export const PostController = {
  createPost: async (req, res) => {
    try {
      const post = await PostModel.create({ ...req.body });
      res.status(201).json(post);
    } catch (error) {
      console.log(error);
      res.status(409).json({ error: error.message });
    }
  },

  getFeedPosts: async (req, res) => {
    try {
      const posts = await PostModel.find().populate('user').lean();
      res.status(200).json(posts);
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: error.message });
    }
  },

  getUserPosts: async (req, res) => {
    try {
      const posts = await PostModel.find({ user: req.params.userId })
        .populate('user')
        .lean();
      res.status(200).json(posts);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  likePost: async (req, res) => {
    try {
      const { id } = req.params;
      const { user } = req.body;

      const post = await PostModel.findById(id);
      const isLiked = post.likes.get(user);

      if (!isLiked) {
        post.likes.set(user, true);
      } else {
        post.likes.delete(user);
      }

      const updated = await PostModel.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
      );
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

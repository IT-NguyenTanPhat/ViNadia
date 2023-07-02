import { UserModel } from './user.model.js';
import { PostModel } from '../post/index.js';
import { isFriend } from '../friend/friend.controller.js';

export const UserController = {
  // GET /users/:id
  getUser: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id, '-password');
      res.status(200).json(user);
    } catch (error) {
      console.log(`getUser: ${error}`);
      res.status(404).json({ error: error.message });
    }
  },

  // GET /users/:id/posts
  getUserPosts: async (req, res) => {
    try {
      const posts = await PostModel.find({ author: req.params.id })
        .populate({
          path: 'author',
          select: 'name avatar',
        })
        .lean();
      res.status(200).json(posts);
    } catch (error) {
      console.log(`getUserPosts: ${error}`);
      res.status(404).json({ error: error.message });
    }
  },

  // GET /users/:id/suggested-friends
  getSuggestedFriends: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id, '-password');
      let friends = await UserModel.find(
        {
          _id: { $ne: req.user._id },
          $or: [
            { location: { $regex: user.location, $options: 'i' } },
            { occupation: { $regex: user.occupation, $options: 'i' } },
          ],
        },
        'name avatar'
      );

      friends = await Promise.all(friends.map(async (friend) => {
        const check = await isFriend(user._id, friend._id);
        return !check ? friend : false;
      }));
      
      friends = friends.filter(Boolean);

      res.status(200).json(friends);
    } catch (error) {
      console.log(`getSuggestedFriends: ${error}`);
      res.status(404).json({ error: error.message });
    }
  },
};

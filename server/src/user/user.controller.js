import { UserModel } from './user.model.js';

export const UserController = {
  getUser: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUserFriends: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      res.status(200).json(user.friends);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  addRemoveFriend: async (req, res) => {
    try {
      const { id, friendId } = req.params;
      const user = await UserModel.findById(id);
      const friend = await UserModel.findById(friendId);

      if (user.friends.includes(friend)) {
        user.friends = user.friends.filter((id) => friendId !== id);
        friend.friends = friend.friends.filter((id) => id !== id);
      } else {
        user.friends.push(friendId);
        friend.friends.push(id);
      }
      await user.save();
      await friend.save();

      res.status(200).json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

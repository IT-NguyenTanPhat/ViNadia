import { UserModel } from './user.model.js';

export const UserController = {
  // GET /users/:id
  getUser: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /users/:id/friends
  getUserFriends: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      res.status(200).json(user.friends);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /users/:id/suggested-friends
  getSuggestedFriends: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      const users = await UserModel.find({
        _id: { $ne: req.user._id },
        $or: [
          { location: { $regex: user.location, $options: 'i' } },
          { occupation: { $regex: user.occupation, $options: 'i' } },
        ],
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // PATCH /users/:id/:friendId
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

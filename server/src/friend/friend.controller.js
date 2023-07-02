import { FriendModel } from './friend.model.js';

export const isFriend = async (userId, friendId) => {
  const isExisted = await FriendModel.exists({
    $or: [
      { from: userId, to: friendId },
      { from: friendId, to: userId },
    ],
  });
  console.log(isExisted);
  return isExisted ? true : false;
};

export const FriendController = {
  // GET /friends/:userId
  getUserFriends: async (req, res) => {
    try {
      const { userId } = req.params;
      const list = await FriendModel.find({
        status: 'accepted',
        $or: [{ from: userId }, { to: userId }],
      });

      const friends = list.map((item) =>
        item.from == userId ? item.to : item.from
      );
      res.status(200).json(friends);
    } catch (error) {
      console.log(`getUserFriends: ${error}`);
      res.status(404).json({ error: error.message });
    }
  },

  // GET /friends/:userId/:friendId
  getFriendStatus: async (req, res) => {
    try {
      const { userId, friendId } = req.params;
      const relationship = await FriendModel.findOne({
        from: userId,
        to: friendId,
      });

      res.status(200).json({ status: relationship?.status ?? 'not' });
    } catch (error) {
      console.log(`getFriendStatus: ${error}`);
      res.status(404).json({ error: error.message });
    }
  },

  // POST /friends/:userId
  createFriendRequest: async (req, res) => {
    try {
      const { userId } = req.params;
      const { friendId } = req.body;

      const isExisted = await FriendModel.exists({
        $or: [
          { from: userId, to: friendId },
          { from: friendId, to: userId },
        ],
      });

      if (isExisted)
        return res
          .status(400)
          .send({ message: 'Both of you were friend or already requested' });

      const request = await FriendModel.create({ from: userId, to: friendId });
      res.status(201).json(request);
    } catch (error) {
      console.log(`createFriendRequest: ${error}`);
      res.status(409).json({ error: error.message });
    }
  },

  // PATCH /friends/:userId
  acceptFriendRequest: async (req, res) => {
    try {
      const { userId } = req.params;
      const { friendId } = req.body;

      let request = await FriendModel.findOne({
        from: friendId,
        to: userId,
      });

      if (!request)
        return res
          .status(400)
          .send({ message: 'Friend request is not existed.' });

      if (request.status === 'accepted')
        return res.status(400).send({ message: 'You guys were friend.' });

      request = await FriendModel.findByIdAndUpdate(
        request._id,
        {
          status: 'accepted',
        },
        { new: true }
      );
      res.status(200).json(request);
    } catch (error) {
      console.log(`acceptFriendRequest: ${error}`);
      res.status(500).json({ error: error.message });
    }
  },

  // Delete /friends/:userId
  rejectOrUnFriend: async (req, res) => {
    try {
      const { userId } = req.params;
      const { friendId } = req.body;

      await FriendModel.findOneAndDelete({
        $or: [
          { from: userId, to: friendId },
          { from: friendId, to: userId },
        ],
      });

      res.status(200).json({ status: 'not' });
    } catch (error) {
      console.log(`rejectOrUnFriend: ${error}`);
      res.status(500).json({ error: error.message });
    }
  },
};

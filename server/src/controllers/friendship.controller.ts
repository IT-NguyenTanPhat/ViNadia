import { Request, Response } from 'express';
import { FriendshipModel } from '../models';
import { catchAsync } from '../middlewares';
import redis from '../config/redis';

export const FriendshipController = {
  isFriend: async (userId: string, friendId: string) => {
    const isExisted = await FriendshipModel.exists({
      $or: [
        { from: userId, to: friendId },
        { from: friendId, to: userId },
      ],
    });
    return isExisted ? true : false;
  },

  // GET /friendships/:userId
  getUserFriends: catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const cachedFriends = await redis.get(`${userId}-friends`);
    if (cachedFriends) {
      return res.status(200).json({ friends: JSON.parse(cachedFriends) });
    }

    const list = await FriendshipModel.find({
      status: 'accepted',
      $or: [{ from: userId }, { to: userId }],
    }); // Find relationships

    const friends = list.map((item) =>
      item.from.toString() === userId ? item.to : item.from
    ); // Formatting friend list

    await redis.set(`${userId}-friends`, JSON.stringify(friends));
    res.status(200).json({ friends });
  }),

  // GET /friendships/:userId/:friendId
  getFriendStatus: catchAsync(async (req: Request, res: Response) => {
    const { userId, friendId } = req.params;

    const cachedFriendStatus = await redis.get(
      `${userId}-${friendId}-friend-status`
    );
    if (cachedFriendStatus) {
      return res.status(200).json({ status: cachedFriendStatus });
    }

    const relationship = await FriendshipModel.findOne({
      from: userId,
      to: friendId,
    });

    const status = relationship?.status ?? 'not';
    await redis.set(`${userId}-${friendId}-friend-status`, status);
    res.status(200).json({ status });
  }),

  // POST /friendships/:userId
  createFriendRequest: catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { friendId } = req.body;

    const isExisted = await FriendshipModel.exists({
      $or: [
        { from: userId, to: friendId },
        { from: friendId, to: userId },
      ],
    }); // Check existed relationship
    if (isExisted)
      return res
        .status(400)
        .send({ message: 'Both of you were friend or requested' });

    const friendship = await FriendshipModel.create({
      from: userId,
      to: friendId,
    });
    res.status(201).json({ friendship });
  }),

  // PATCH /friendships/:userId
  acceptFriendRequest: catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { friendId } = req.body;

    let friendship = await FriendshipModel.findOne({
      from: friendId,
      to: userId,
    });

    if (!friendship)
      return res
        .status(404)
        .send({ message: 'Friend request is not existed.' });

    if (friendship.status === 'accepted')
      return res.status(400).send({ message: 'Both of you were friend.' });

    friendship = await FriendshipModel.findByIdAndUpdate(
      friendship._id,
      {
        status: 'accepted',
      },
      { new: true }
    );

    // Reset related data on redis
    await Promise.all([
      redis.del(`${userId}-friends`),
      redis.del(`${friendId}-friends`),
      redis.del(`${userId}-${friendId}-friend-status`),
      redis.del(`${friendId}-${userId}-friend-status`),
    ]);
    res.status(200).json({ friendship });
  }),

  // Delete /friendships/:userId
  rejectOrUnFriend: catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { friendId } = req.body;

    await FriendshipModel.findOneAndDelete({
      $or: [
        { from: userId, to: friendId },
        { from: friendId, to: userId },
      ],
    });

    // Reset related data on redis
    await Promise.all([
      redis.del(`${userId}-friends`),
      redis.del(`${friendId}-friends`),
      redis.del(`${userId}-${friendId}-friend-status`),
      redis.del(`${friendId}-${userId}-friend-status`),
    ]);
    res.status(200).json({ message: 'Delete friendship successfully' });
  }),
};

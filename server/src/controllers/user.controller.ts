import { UserModel, PostModel } from '../models';
import { FriendshipController } from '../controllers';
import { Request, Response } from 'express';
import { catchAsync } from '../middlewares';
import redis from '../config/redis';

export const UserController = {
  // GET /users/:userId
  getUserProfile: catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;

    // Check cached data
    const cachedProfile = await redis.get(`${userId}-profile`);
    if (cachedProfile)
      return res.status(200).json({ user: JSON.parse(cachedProfile) });

    const user = await UserModel.findById(userId, '-password');
    await redis.set(`${userId}-profile`, JSON.stringify(user));
    res.status(200).json({ user });
  }),

  // GET /users/:userId/posts
  getUserPosts: catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;

    // Find user
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check cached data
    const cachedPosts = await redis.get(`${userId}-posts`);
    if (cachedPosts)
      return res.status(200).json({ posts: JSON.parse(cachedPosts) });

    // Find user's post
    const posts = await PostModel.find({ author: user._id })
      .populate({
        path: 'author',
        select: 'name avatar',
      })
      .lean();

    await redis.set(`${userId}-posts`, JSON.stringify(user));
    res.status(200).json({ posts });
  }),

  // GET /users/:userId/suggested-friends
  getSuggestedFriends: catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;

    // Find user
    const user = await UserModel.findById(userId, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check cached data
    const cachedSuggestedFriends = await redis.get(
      `${userId}-suggested-friends`
    );
    if (cachedSuggestedFriends)
      return res
        .status(200)
        .json({ friends: JSON.parse(cachedSuggestedFriends) });

    // Find friends by location and occupation
    const records = await UserModel.find(
      {
        _id: { $ne: user._id },
        $or: [
          { location: { $regex: user.location ?? '', $options: 'i' } },
          { occupation: { $regex: user.occupation ?? '', $options: 'i' } },
        ],
      },
      'name avatar'
    );

    // Filter already was friend
    let friends = await Promise.all(
      records.map(async (record) => {
        const check = await FriendshipController.isFriend(
          user._id.toString(),
          record._id.toString()
        );
        return !check ? record : false;
      })
    );

    friends = friends.filter(Boolean);
    await redis.set(`${userId}-suggested-friends`, JSON.stringify(friends));
    res.status(200).json({ friends });
  }),
};

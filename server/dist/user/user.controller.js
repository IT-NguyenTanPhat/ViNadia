"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_model_1 = require("./user.model");
const post_1 = require("../post");
const friendship_1 = require("../friendship");
const middlewares_1 = require("../middlewares");
const __1 = require("..");
exports.UserController = {
    // GET /users/:id
    getUserProfile: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.id;
        // Check cached data
        const cachedProfile = yield __1.redis.get(`${userId}-profile`);
        if (cachedProfile)
            return res.status(200).json({ user: JSON.parse(cachedProfile) });
        const user = yield user_model_1.UserModel.findById(userId, '-password');
        yield __1.redis.set(`${userId}-profile`, JSON.stringify(user));
        res.status(200).json({ user });
    })),
    // GET /users/:id/posts
    getUserPosts: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.id;
        // Find user
        const user = yield user_model_1.UserModel.findById(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // Check cached data
        const cachedPosts = yield __1.redis.get(`${userId}-posts`);
        if (cachedPosts)
            return res.status(200).json({ posts: JSON.parse(cachedPosts) });
        // Find user's post
        const posts = yield post_1.PostModel.find({ author: user._id })
            .populate({
            path: 'author',
            select: 'name avatar',
        })
            .lean();
        yield __1.redis.set(`${userId}-posts`, JSON.stringify(user));
        res.status(200).json({ posts });
    })),
    // GET /users/:id/suggested-friends
    getSuggestedFriends: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const userId = req.params.id;
        // Find user
        const user = yield user_model_1.UserModel.findById(userId, '-password');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // Check cached data
        const cachedSuggestedFriends = yield __1.redis.get(`${userId}-suggested-friends`);
        if (cachedSuggestedFriends)
            return res
                .status(200)
                .json({ friends: JSON.parse(cachedSuggestedFriends) });
        // Find friends by location and occupation
        const records = yield user_model_1.UserModel.find({
            _id: { $ne: user._id },
            $or: [
                { location: { $regex: (_a = user.location) !== null && _a !== void 0 ? _a : '', $options: 'i' } },
                { occupation: { $regex: (_b = user.occupation) !== null && _b !== void 0 ? _b : '', $options: 'i' } },
            ],
        }, 'name avatar');
        // Filter already was friend
        let friends = yield Promise.all(records.map((record) => __awaiter(void 0, void 0, void 0, function* () {
            const check = yield friendship_1.FriendshipController.isFriend(user._id.toString(), record._id.toString());
            return !check ? record : false;
        })));
        friends = friends.filter(Boolean);
        yield __1.redis.set(`${userId}-suggested-friends`, JSON.stringify(friends));
        res.status(200).json({ friends });
    })),
};

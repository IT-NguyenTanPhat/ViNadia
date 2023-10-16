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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const models_1 = require("../models");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const redis_1 = __importDefault(require("../config/redis"));
exports.UserController = {
    // GET /users/:userId
    getUserProfile: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        // Check cached data
        const cachedProfile = yield redis_1.default.get(`${userId}-profile`);
        if (cachedProfile)
            return res.status(200).json({ user: JSON.parse(cachedProfile) });
        const user = yield models_1.UserModel.findById(userId, '-password');
        yield redis_1.default.set(`${userId}-profile`, JSON.stringify(user));
        res.status(200).json({ user });
    })),
    // GET /users/:userId/posts
    getUserPosts: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        // Find user
        const user = yield models_1.UserModel.findById(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // Check cached data
        const cachedPosts = yield redis_1.default.get(`${userId}-posts`);
        if (cachedPosts)
            return res.status(200).json({ posts: JSON.parse(cachedPosts) });
        // Find user's post
        const posts = yield models_1.PostModel.find({ author: user._id })
            .populate({
            path: 'author',
            select: 'name avatar',
        })
            .lean();
        yield redis_1.default.set(`${userId}-posts`, JSON.stringify(user));
        res.status(200).json({ posts });
    })),
    // GET /users/:userId/suggested-friends
    getSuggestedFriends: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { userId } = req.params;
        // Find user
        const user = yield models_1.UserModel.findById(userId, '-password');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // Check cached data
        const cachedSuggestedFriends = yield redis_1.default.get(`${userId}-suggested-friends`);
        if (cachedSuggestedFriends)
            return res
                .status(200)
                .json({ friends: JSON.parse(cachedSuggestedFriends) });
        // Find friends by location and occupation
        const records = yield models_1.UserModel.find({
            _id: { $ne: user._id },
            $or: [
                { location: { $regex: (_a = user.location) !== null && _a !== void 0 ? _a : '', $options: 'i' } },
                { occupation: { $regex: (_b = user.occupation) !== null && _b !== void 0 ? _b : '', $options: 'i' } },
            ],
        }, 'name avatar');
        // Filter already was friend
        let friends = yield Promise.all(records.map((record) => __awaiter(void 0, void 0, void 0, function* () {
            const check = yield controllers_1.FriendshipController.isFriend(user._id.toString(), record._id.toString());
            return !check ? record : false;
        })));
        friends = friends.filter(Boolean);
        yield redis_1.default.set(`${userId}-suggested-friends`, JSON.stringify(friends));
        res.status(200).json({ friends });
    })),
};

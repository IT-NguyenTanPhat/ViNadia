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
exports.PostController = void 0;
const post_model_1 = require("./post.model");
const user_1 = require("../user");
const middlewares_1 = require("../middlewares");
const __1 = require("..");
exports.PostController = {
    // POST /posts
    createPost: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const image = (_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0 ? void 0 : _b.replace('public', '');
        const post = yield post_model_1.PostModel.create(Object.assign(Object.assign({}, req.body), { image }));
        // Reset related data on redis
        yield __1.redis.del(`${req.body.author}-posts`);
        res.status(201).json({ post });
    })),
    // GET /posts/feed
    getFeedPosts: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const posts = yield post_model_1.PostModel.find()
            .populate({
            path: 'author',
            select: 'name avatar',
        })
            .lean();
        res.status(200).json({ posts });
    })),
    // PATCH /posts/:id/like
    likeOrDislikePost: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { userId } = req.body;
        // Check existed user
        const isExistedUser = yield user_1.UserModel.exists({ _id: userId });
        if (!isExistedUser)
            return res.status(404).json({ message: 'User not found' });
        // Check existed post
        const post = yield post_model_1.PostModel.findById(id);
        if (!post)
            return res.status(404).json({ message: 'Post not found' });
        // Liked or not
        const isLiked = post.likes.includes(userId);
        if (!isLiked)
            post.likes.push(userId);
        else
            post.likes = post.likes.filter((like) => like != userId);
        const updated = yield post_model_1.PostModel.findByIdAndUpdate(id, { likes: post.likes }, { new: true })
            .populate({
            path: 'author',
            select: 'name avatar',
        })
            .lean();
        yield __1.redis.del(`${post.author}-posts`);
        res.status(200).json({ post: updated });
    })),
};

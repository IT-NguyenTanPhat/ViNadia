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
exports.FriendshipController = void 0;
const models_1 = require("../models");
const middlewares_1 = require("../middlewares");
const redis_1 = __importDefault(require("../config/redis"));
exports.FriendshipController = {
    isFriend: (userId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
        const isExisted = yield models_1.FriendshipModel.exists({
            $or: [
                { from: userId, to: friendId },
                { from: friendId, to: userId },
            ],
        });
        return isExisted ? true : false;
    }),
    // GET /friendships/:userId
    getUserFriends: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        const cachedFriends = yield redis_1.default.get(`${userId}-friends`);
        if (cachedFriends) {
            return res.status(200).json({ friends: JSON.parse(cachedFriends) });
        }
        const list = yield models_1.FriendshipModel.find({
            status: 'accepted',
            $or: [{ from: userId }, { to: userId }],
        }); // Find relationships
        const friends = list.map((item) => item.from.toString() === userId ? item.to : item.from); // Formatting friend list
        yield redis_1.default.set(`${userId}-friends`, JSON.stringify(friends));
        res.status(200).json({ friends });
    })),
    // GET /friendships/:userId/:friendId
    getFriendStatus: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { userId, friendId } = req.params;
        const cachedFriendStatus = yield redis_1.default.get(`${userId}-${friendId}-friend-status`);
        if (cachedFriendStatus) {
            return res.status(200).json({ status: cachedFriendStatus });
        }
        const relationship = yield models_1.FriendshipModel.findOne({
            from: userId,
            to: friendId,
        });
        const status = (_a = relationship === null || relationship === void 0 ? void 0 : relationship.status) !== null && _a !== void 0 ? _a : 'not';
        yield redis_1.default.set(`${userId}-${friendId}-friend-status`, status);
        res.status(200).json({ status });
    })),
    // POST /friendships/:userId
    createFriendRequest: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        const { friendId } = req.body;
        const isExisted = yield models_1.FriendshipModel.exists({
            $or: [
                { from: userId, to: friendId },
                { from: friendId, to: userId },
            ],
        }); // Check existed relationship
        if (isExisted)
            return res
                .status(400)
                .send({ message: 'Both of you were friend or requested' });
        const friendship = yield models_1.FriendshipModel.create({
            from: userId,
            to: friendId,
        });
        res.status(201).json({ friendship });
    })),
    // PATCH /friendships/:userId
    acceptFriendRequest: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        const { friendId } = req.body;
        let friendship = yield models_1.FriendshipModel.findOne({
            from: friendId,
            to: userId,
        });
        if (!friendship)
            return res
                .status(404)
                .send({ message: 'Friend request is not existed.' });
        if (friendship.status === 'accepted')
            return res.status(400).send({ message: 'Both of you were friend.' });
        friendship = yield models_1.FriendshipModel.findByIdAndUpdate(friendship._id, {
            status: 'accepted',
        }, { new: true });
        // Reset related data on redis
        yield Promise.all([
            redis_1.default.del(`${userId}-friends`),
            redis_1.default.del(`${friendId}-friends`),
            redis_1.default.del(`${userId}-${friendId}-friend-status`),
            redis_1.default.del(`${friendId}-${userId}-friend-status`),
        ]);
        res.status(200).json({ friendship });
    })),
    // Delete /friendships/:userId
    rejectOrUnFriend: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        const { friendId } = req.body;
        yield models_1.FriendshipModel.findOneAndDelete({
            $or: [
                { from: userId, to: friendId },
                { from: friendId, to: userId },
            ],
        });
        // Reset related data on redis
        yield Promise.all([
            redis_1.default.del(`${userId}-friends`),
            redis_1.default.del(`${friendId}-friends`),
            redis_1.default.del(`${userId}-${friendId}-friend-status`),
            redis_1.default.del(`${friendId}-${userId}-friend-status`),
        ]);
        res.status(200).json({ message: 'Delete friendship successfully' });
    })),
};

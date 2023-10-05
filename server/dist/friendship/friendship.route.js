"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendshipRoute = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.FriendshipRoute = router;
const middlewares_1 = require("../middlewares");
const friendship_controller_1 = require("./friendship.controller");
// PATH: /friends
router.use(middlewares_1.verifyToken);
router.get('/:userId', friendship_controller_1.FriendshipController.getUserFriends);
router.get('/:userId/:friendId', friendship_controller_1.FriendshipController.getFriendStatus);
router.post('/:userId', friendship_controller_1.FriendshipController.createFriendRequest);
router.patch('/:userId', friendship_controller_1.FriendshipController.acceptFriendRequest);
router.delete('/:userId', friendship_controller_1.FriendshipController.rejectOrUnFriend);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const friendship_validator_1 = require("../validators/friendship.validator");
// PATH: /friends
router.use(middlewares_1.verifyToken);
router.get('/:userId', friendship_validator_1.getUserFriendsValidator, middlewares_1.errorHandler, controllers_1.FriendshipController.getUserFriends);
router.get('/:userId/:friendId', friendship_validator_1.getFriendStatusValidator, middlewares_1.errorHandler, controllers_1.FriendshipController.getFriendStatus);
router.post('/:userId', friendship_validator_1.friendRequestValidator, middlewares_1.errorHandler, controllers_1.FriendshipController.createFriendRequest);
router.patch('/:userId', friendship_validator_1.friendRequestValidator, middlewares_1.errorHandler, controllers_1.FriendshipController.acceptFriendRequest);
router.delete('/:userId', friendship_validator_1.friendRequestValidator, middlewares_1.errorHandler, controllers_1.FriendshipController.rejectOrUnFriend);
exports.default = router;

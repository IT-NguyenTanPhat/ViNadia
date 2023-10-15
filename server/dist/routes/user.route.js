"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const user_validator_1 = require("../validators/user.validator");
// PATH: /users
router.use(middlewares_1.verifyToken);
router.get('/:userId', user_validator_1.userIdValidator, middlewares_1.errorHandler, controllers_1.UserController.getUserProfile);
router.get('/:userId/posts', user_validator_1.userIdValidator, middlewares_1.errorHandler, controllers_1.UserController.getUserPosts);
router.get('/:userId/suggested-friends', user_validator_1.userIdValidator, middlewares_1.errorHandler, controllers_1.UserController.getSuggestedFriends);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.UserRoute = router;
const middlewares_1 = require("../middlewares");
const user_controller_1 = require("./user.controller");
// PATH: /users
router.use(middlewares_1.verifyToken);
router.get('/:id', user_controller_1.UserController.getUserProfile);
router.get('/:id/posts', user_controller_1.UserController.getUserPosts);
router.get('/:id/suggested-friends', user_controller_1.UserController.getSuggestedFriends);

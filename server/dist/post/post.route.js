"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoute = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.PostRoute = router;
const middlewares_1 = require("../middlewares");
const post_controller_1 = require("./post.controller");
// PATH: /posts
router.get('/feed', post_controller_1.PostController.getFeedPosts);
router.use(middlewares_1.verifyToken);
router.post('/', middlewares_1.upload.single('post'), post_controller_1.PostController.createPost);
router.patch('/:id/like', post_controller_1.PostController.likeOrDislikePost);

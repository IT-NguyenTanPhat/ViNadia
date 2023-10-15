"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const middlewares_1 = require("../middlewares");
const controllers_1 = require("../controllers");
const post_validator_1 = require("../validators/post.validator");
// PATH: /posts
router.get('/feed', controllers_1.PostController.getFeedPosts);
router.use(middlewares_1.verifyToken);
router.post('/', middlewares_1.upload.single('post'), post_validator_1.createPostValidator, middlewares_1.errorHandler, controllers_1.PostController.createPost);
router.patch('/:postId/like', post_validator_1.likeOrDislikePostValidator, middlewares_1.errorHandler, controllers_1.PostController.likeOrDislikePost);
exports.default = router;

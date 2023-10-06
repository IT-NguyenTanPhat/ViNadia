"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../auth");
const user_1 = require("../user");
const post_1 = require("../post");
const friendship_1 = require("../friendship");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("../docs/swagger"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.redirect('/api-docs');
});
router.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, { explorer: true }));
router.use('/auth', auth_1.AuthRoute);
router.use('/users', user_1.UserRoute);
router.use('/posts', post_1.PostRoute);
router.use('/friendships', friendship_1.FriendshipRoute);
exports.default = router;

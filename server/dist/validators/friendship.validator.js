"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendRequestValidator = exports.getFriendStatusValidator = exports.getUserFriendsValidator = void 0;
const express_validator_1 = require("express-validator");
exports.getUserFriendsValidator = [
    (0, express_validator_1.param)('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isMongoId()
        .withMessage('userId must be a valid ID'),
];
exports.getFriendStatusValidator = [
    (0, express_validator_1.param)('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isMongoId()
        .withMessage('userId must be a valid ID'),
    (0, express_validator_1.param)('friendId')
        .notEmpty()
        .withMessage('friendId is required')
        .isMongoId()
        .withMessage('friendId must be a valid ID'),
];
exports.friendRequestValidator = [
    (0, express_validator_1.param)('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isMongoId()
        .withMessage('userId must be a valid ID'),
    (0, express_validator_1.body)('friendId')
        .notEmpty()
        .withMessage('friendId is required')
        .isMongoId()
        .withMessage('friendId must be a valid ID'),
];

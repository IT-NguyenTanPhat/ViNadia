"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeOrDislikePostValidator = exports.createPostValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createPostValidator = [
    (0, express_validator_1.body)('author')
        .notEmpty()
        .withMessage('author is required')
        .isMongoId()
        .withMessage('author must be a valid ID'),
    (0, express_validator_1.body)('description')
        .optional()
        .isString()
        .withMessage('description must be a string'),
];
exports.likeOrDislikePostValidator = [
    (0, express_validator_1.body)('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isMongoId()
        .withMessage('userId must be a valid ID'),
    (0, express_validator_1.param)('postId')
        .notEmpty()
        .withMessage('postId is required')
        .isMongoId()
        .withMessage('postId must be a valid ID'),
];

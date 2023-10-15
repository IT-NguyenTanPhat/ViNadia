"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenValidator = exports.registerValidator = exports.loginValidator = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidator = [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('email must be a valid email address'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('password is required')
        .isString()
        .withMessage('password must be a string'),
];
exports.registerValidator = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('name is required')
        .isString()
        .withMessage('name must be a string'),
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('email must be a valid email address'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('password is required')
        .isString()
        .withMessage('password must be a string'),
];
exports.refreshTokenValidator = [
    (0, express_validator_1.body)('token')
        .notEmpty()
        .withMessage('token is required')
        .isString()
        .withMessage('token must be a string'),
];

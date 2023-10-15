"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdValidator = void 0;
const express_validator_1 = require("express-validator");
exports.userIdValidator = [
    (0, express_validator_1.param)('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isMongoId()
        .withMessage('userId must be a valid ID'),
];

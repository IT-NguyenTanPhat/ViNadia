"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const errorHandler = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        if (req.file)
            fs_1.default.rmSync(req.file.path);
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
};
exports.errorHandler = errorHandler;

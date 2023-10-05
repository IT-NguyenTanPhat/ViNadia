"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = function (payload) {
    const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'vinadia_access_token', { expiresIn: '10m' });
    return accessToken;
};
exports.generateAccessToken = generateAccessToken;

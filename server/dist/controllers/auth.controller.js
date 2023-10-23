"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const models_1 = require("../models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const middlewares_1 = require("../middlewares");
const axios_1 = __importDefault(require("axios"));
const google_1 = require("../config/google");
function generateAccessToken(userId) {
    const accessToken = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || 'vinadia_access_token', { expiresIn: '8h' });
    return accessToken;
}
function generateRefreshToken(userId) {
    const refreshToken = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || 'vinadia_refresh_token', { expiresIn: '7d' });
    return refreshToken;
}
exports.AuthController = {
    // POST /auth/login
    login: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        // Find user
        const userWithPassword = yield models_1.UserModel.findOne({ email }, '-__v -createdAt -updatedAt');
        if (!userWithPassword || !userWithPassword.password)
            return res.status(400).json({ message: 'Invalid email or password.' });
        // Compare password
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, userWithPassword.password);
        if (!isPasswordMatched)
            return res.status(400).json({ message: 'Invalid email or password.' });
        // Generate tokens
        const accessToken = generateAccessToken(userWithPassword._id.toString());
        const refreshToken = generateRefreshToken(userWithPassword._id.toString());
        const _a = userWithPassword.toObject(), { password: del } = _a, userWithoutPassword = __rest(_a, ["password"]); // Remove password
        res
            .status(200)
            .json({ user: userWithoutPassword, accessToken, refreshToken });
    })),
    // GET /auth/google
    google: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const code = req.query.code;
        const googleRes = yield google_1.ggClient.getToken(code);
        google_1.ggClient.setCredentials(googleRes.tokens);
        const userRes = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json`, { headers: { Authorization: 'Bearer ' + googleRes.tokens.access_token } });
        let user = yield models_1.UserModel.findOne({ email: userRes.data.email });
        if (!user) {
            user = yield models_1.UserModel.create({
                name: userRes.data.name,
                email: userRes.data.email,
                avatar: userRes.data.picture,
            });
        }
        // Generate tokens
        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());
        res.status(200).json({ user, accessToken, refreshToken });
    })),
    // POST /auth/register
    register: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Check existed user
        const isExist = yield models_1.UserModel.exists({ email: req.body.email });
        if (isExist)
            return res.status(400).json({ message: 'Email is already existed.' });
        const userWithPassword = yield models_1.UserModel.create(Object.assign({}, req.body));
        const _b = userWithPassword.toObject(), { password } = _b, userWithoutPassword = __rest(_b, ["password"]); // Remove password
        res.status(201).json({ user: userWithoutPassword });
    })),
    // POST /auth/refresh-token
    refreshToken: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const refresh_token = req.body.token;
        if (!refresh_token)
            return res.status(403).json({ message: 'Missing token' });
        // Verify refresh token
        const verified = jsonwebtoken_1.default.verify(refresh_token, process.env.JWT_SECRET || 'vinadia_refresh_token');
        if (typeof verified === 'string')
            return res.status(403).json({ message: 'Invalid token' });
        const accessToken = generateAccessToken(verified.userId);
        res.status(200).json({ token: accessToken });
    })),
};

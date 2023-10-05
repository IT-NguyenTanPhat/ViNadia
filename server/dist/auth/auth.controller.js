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
const user_1 = require("../user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const access_token_1 = require("../utils/access_token");
const middlewares_1 = require("../middlewares");
exports.AuthController = {
    // POST /auth/login
    login: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        // Find user
        const userWithPassword = yield user_1.UserModel.findOne({ email }, '-__v -createdAt -updatedAt');
        if (!userWithPassword)
            return res.status(400).json({ message: 'Invalid email or password.' });
        // Compare password
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, userWithPassword.password);
        if (!isPasswordMatched)
            return res.status(400).json({ message: 'Invalid email or password.' });
        // Generate tokens
        const accessToken = (0, access_token_1.generateAccessToken)({
            _id: userWithPassword._id,
        });
        const refreshToken = jsonwebtoken_1.default.sign({ _id: userWithPassword._id }, process.env.JWT_SECRET || 'vinadia_refresh_token', { expiresIn: '30d' });
        const _a = userWithPassword.toObject(), { password: del } = _a, userWithoutPassword = __rest(_a, ["password"]); // Remove password
        res
            .status(200)
            .json({ user: userWithoutPassword, accessToken, refreshToken });
    })),
    // POST /auth/register
    register: (0, middlewares_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Check existed user
        const isExist = yield user_1.UserModel.exists({ email: req.body.email });
        if (isExist)
            return res.status(400).json({ message: 'Email is already existed.' });
        const userWithPassword = yield user_1.UserModel.create(Object.assign({}, req.body));
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
        const accessToken = (0, access_token_1.generateAccessToken)({ _id: verified._id });
        res.status(200).json({ token: accessToken });
    })),
};

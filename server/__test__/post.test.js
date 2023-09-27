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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../src/app"));
const supertest_1 = __importDefault(require("supertest"));
const post_1 = require("../src/post");
const mongoose_1 = require("mongoose");
const user_1 = require("../src/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let mockData;
let token;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.UserModel.create({
        name: 'fake',
        email: 'fake@email.com',
        password: 'fake',
    });
    mockData = { user, post: yield post_1.PostModel.create({ author: user._id }) };
    token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET || 'vinadia', {
        expiresIn: '30m',
    });
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.UserModel.findByIdAndDelete(mockData.user._id);
    yield post_1.PostModel.findByIdAndDelete(mockData.post._id);
}));
// getFeedPosts
describe('GET /posts', () => {
    test('should return status 200 and post list', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default).get(`/posts`);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('posts');
        expect(Array.isArray(body.posts)).toBe(true);
    }));
});
// createPost
describe('POST /posts', () => {
    test('should return status 201 if create successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .post(`/posts`)
            .send({ author: mockData.user._id })
            .set('Authorization', token);
        expect(statusCode).toBe(201);
        expect(body).toHaveProperty('post');
        expect(typeof body.post === 'object').toBe(true);
        yield post_1.PostModel.findByIdAndDelete(body.post._id);
    }));
});
// likeOrDislikePost
describe('PATCH /posts/:id', () => {
    test('should return status 404 if post not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .patch(`/posts/${new mongoose_1.Types.ObjectId()}/like`)
            .send({ userId: mockData.user._id })
            .set('Authorization', token);
        expect(statusCode).toBe(404);
        expect(body).toEqual({ message: 'Post not found' });
    }));
    test('should return status 200 if update successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .patch(`/posts/${mockData.post._id}/like`)
            .send({ userId: mockData.user._id })
            .set('Authorization', token);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('post');
        expect(typeof body.post === 'object').toBe(true);
    }));
});

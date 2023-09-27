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
const mongoose_1 = require("mongoose");
const user_1 = require("../src/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let user;
let token;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    user = yield user_1.UserModel.create({
        name: 'fake',
        email: 'fake@email.com',
        password: 'fake',
    });
    token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET || 'vinadia', {
        expiresIn: '30m',
    });
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.UserModel.findByIdAndDelete(user._id);
}));
// getUserProfile
describe('GET /users/:id', () => {
    test('should return status 200 and user', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .get(`/users/${user._id}`)
            .set('Authorization', token);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('user');
        expect(typeof body.user === 'object').toBe(true);
    }));
});
// getUserPosts
describe('GET /users/:id/posts', () => {
    test('should return status 200 and post list', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .get(`/users/${user._id}/posts`)
            .set('Authorization', token);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('posts');
        expect(Array.isArray(body.posts)).toBe(true);
    }));
    test('should return status 404 if user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .get(`/users/${new mongoose_1.Types.ObjectId()}/posts`)
            .set('Authorization', token);
        expect(statusCode).toBe(404);
        expect(body).toEqual({ message: 'User not found' });
    }));
});
// getSuggestedFriends
describe('GET /users/:id/suggested-friends', () => {
    test('should return status 200 and friend list', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .get(`/users/${user._id}/suggested-friends`)
            .set('Authorization', token);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('friends');
        expect(Array.isArray(body.friends)).toBe(true);
    }));
    test('should return status 404 if user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .get(`/users/${new mongoose_1.Types.ObjectId()}/suggested-friends`)
            .set('Authorization', token);
        expect(statusCode).toBe(404);
        expect(body).toEqual({ message: 'User not found' });
    }));
});

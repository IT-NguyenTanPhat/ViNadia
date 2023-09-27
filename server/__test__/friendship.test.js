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
const friendship_1 = require("../src/friendship");
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
    mockData = {
        user,
        relation: yield friendship_1.FriendshipModel.create({
            from: user._id,
            to: new mongoose_1.Types.ObjectId(),
        }),
    };
    token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET || 'vinadia', {
        expiresIn: '30m',
    });
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.UserModel.findByIdAndDelete(mockData.user._id);
    yield friendship_1.FriendshipModel.findByIdAndDelete(mockData.relation._id);
}));
// getUserFriends
describe('GET /friendships/:userId', () => {
    test('should return status 200 and friend list', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .get(`/friendships/${mockData.user._id}`)
            .set('Authorization', token);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('friends');
        expect(Array.isArray(body.friends)).toBe(true);
    }));
});
// getFriendStatus
describe('GET /friendships/:userId/:friendId', () => {
    test('should return status 200 and friend status', () => __awaiter(void 0, void 0, void 0, function* () {
        const path = `/friendships/${mockData.relation.from}/${mockData.relation.to}`;
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .get(path)
            .set('Authorization', token);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('status');
        expect(typeof body.status === 'string').toBe(true);
    }));
});
// createFriendRequest
describe('POST /friendships/:userId', () => {
    test('should return status 400 when were already friend', () => __awaiter(void 0, void 0, void 0, function* () {
        const path = `/friendships/${mockData.relation.from}`;
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .post(path)
            .send({ friendId: mockData.relation.to })
            .set('Authorization', token);
        expect(statusCode).toBe(400);
        expect(body).toEqual({
            message: 'Both of you were friend or requested',
        });
    }));
    test('should return status 201 if request successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const path = `/friendships/${mockData.relation.from}`;
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .post(path)
            .send({ friendId: new mongoose_1.Types.ObjectId() })
            .set('Authorization', token);
        expect(statusCode).toBe(201);
        expect(body).toHaveProperty('friendship');
        expect(typeof body.friendship === 'object').toBe(true);
        yield friendship_1.FriendshipModel.findByIdAndDelete(body.friendship._id);
    }));
});
// acceptFriendRequest
describe('PATCH /friendships/:userId', () => {
    test('should return status 404 if request is not existed', () => __awaiter(void 0, void 0, void 0, function* () {
        const path = `/friendships/${new mongoose_1.Types.ObjectId()}`;
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .patch(path)
            .send({ friendId: new mongoose_1.Types.ObjectId() })
            .set('Authorization', token);
        expect(statusCode).toBe(404);
        expect(body).toEqual({
            message: 'Friend request is not existed.',
        });
    }));
    test('should return status 200 if update successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const path = `/friendships/${mockData.relation.to}`;
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .patch(path)
            .send({ friendId: mockData.relation.from })
            .set('Authorization', token);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('friendship');
        expect(typeof body.friendship === 'object').toBe(true);
    }));
    test('should return status 400 if they were friend', () => __awaiter(void 0, void 0, void 0, function* () {
        const path = `/friendships/${mockData.relation.to}`;
        yield friendship_1.FriendshipModel.findByIdAndUpdate(mockData.relation._id, {
            status: 'accepted',
        });
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .patch(path)
            .send({ friendId: mockData.relation.from })
            .set('Authorization', token);
        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: 'Both of you were friend.' });
    }));
});
// rejectOrUnFriend
describe('DELETE /friendships/:userId', () => {
    test('should return status 200 if update successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const path = `/friendships/${mockData.relation.from}`;
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default)
            .delete(path)
            .send({ friendId: mockData.relation.to })
            .set('Authorization', token);
        expect(statusCode).toBe(200);
        expect(body).toEqual({ message: 'Delete friendship successfully' });
    }));
});

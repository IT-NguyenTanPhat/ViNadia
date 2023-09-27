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
const user_1 = require("../src/user");
let mockUser;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    mockUser = yield user_1.UserModel.create({
        name: 'fake',
        email: 'fake@email.com',
        password: 'fake',
    });
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.UserModel.findByIdAndDelete(mockUser._id);
}));
// login
describe('POST /auth/login', () => {
    const path = '/auth/login';
    test('should return status 400 if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default).post(path).send({
            email: 'test',
            password: 'test',
        });
        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: 'Invalid email or password.' });
    }));
    test('should return status 400 if password does not match', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default).post(path).send({
            email: 'fake@email.com',
            password: 'test',
        });
        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: 'Invalid email or password.' });
    }));
    test('should return status 200 and a token if login successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default).post(path).send({
            email: 'fake@email.com',
            password: 'fake',
        });
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('user');
        expect(body).toHaveProperty('accessToken');
        expect(body).toHaveProperty('refreshToken');
    }));
});
// register
describe('POST /auth/register', () => {
    const path = '/auth/register';
    test('should return status 400 if user existed', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default).post(path).send({
            name: 'fake',
            email: 'fake@email.com',
            password: 'test',
        });
        expect(statusCode).toBe(400);
        expect(body).toEqual({ message: 'Email is already existed.' });
    }));
    test('should return status 201 if register successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const { statusCode, body } = yield (0, supertest_1.default)(app_1.default).post(path).send({
            name: 'fake',
            email: 'new@email.com',
            password: 'fake',
        });
        expect(statusCode).toBe(201);
        expect(body).toHaveProperty('user');
        expect(typeof body.user === 'object').toBe(true);
        yield user_1.UserModel.findOneAndDelete({ email: 'new@email.com' });
    }));
});

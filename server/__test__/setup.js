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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../src/app"));
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const port = 80;
    const MONGODB_URL = `${process.env.MONGODB_URL}/test` || '';
    mongoose_1.default
        .connect(MONGODB_URL)
        .then(() => {
        server = app_1.default.listen(port, () => console.log('Server listening on http://localhost:' + port));
        server.close();
    })
        .catch((error) => console.log(`Server is not connected: ${error.message}`));
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    server.close();
    yield mongoose_1.default.disconnect();
}));

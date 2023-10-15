"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./config/app"));
const http_1 = require("http");
const redis_1 = __importDefault(require("./config/redis"));
const httpServer = (0, http_1.createServer)(app_1.default);
// Redis connection
redis_1.default.connect();
redis_1.default.on('connect', () => console.log('[Server]: Connected to Redis cloud.'));
redis_1.default.on('error', (err) => console.error('[Redis]: ' + err));
// MongoDB connection
const MONGODB_URL = `${process.env.MONGODB_URL}/production` || '';
mongoose_1.default
    .connect(MONGODB_URL)
    .then(() => console.log('[Server]: Connected to MongoDB cluster.'))
    .catch((error) => console.error(`[MongoDB]: ${error}`));
// Start the server
const port = process.env.PORT || 8080;
httpServer.listen(port, () => console.log('[Server]: Server is listening on http://localhost:' + port));

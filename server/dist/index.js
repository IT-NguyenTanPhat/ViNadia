"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app/app"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const redis_1 = require("redis");
const httpServer = (0, http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(httpServer);
const port = process.env.PORT || 8080;
// Redis configuration
const redis = (0, redis_1.createClient)({
    password: 'YZqNw4CcJkVWqqJVGkxE2IqtVcspTZsn',
    socket: {
        host: 'redis-16397.c245.us-east-1-3.ec2.cloud.redislabs.com',
        port: 16397,
    },
});
exports.redis = redis;
redis.connect();
redis.on('connect', () => {
    console.log('Connected to Redis cloud');
});
// DB CONFIG
const MONGODB_URL = `${process.env.MONGODB_URL}/production` || '';
mongoose_1.default
    .connect(MONGODB_URL)
    .then(() => {
    io.on('connection', (socket) => {
        console.log('A client connected.');
        socket.on('disconnected', () => {
            console.log('A client disconnected.');
        });
    });
    httpServer.listen(port, () => {
        console.log('Connected to MongoDB cluster');
        console.log('Server is listening on http://localhost:' + port);
    });
})
    .catch((error) => console.error(`Server is not connected: ${error}`));

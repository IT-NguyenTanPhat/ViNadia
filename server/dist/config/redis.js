"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Redis configuration
const redis_1 = require("redis");
const redis = (0, redis_1.createClient)({
    password: 'YZqNw4CcJkVWqqJVGkxE2IqtVcspTZsn',
    socket: {
        host: 'redis-16397.c245.us-east-1-3.ec2.cloud.redislabs.com',
        port: 16397,
    },
});
exports.default = redis;

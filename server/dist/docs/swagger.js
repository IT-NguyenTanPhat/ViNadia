"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    openapi: '3.1.0',
    info: {
        title: 'Express API for Stock Screener',
        version: '1.0.0',
        description: 'This is a REST API application made with Express. It retrieves data from Stock Screener.',
        license: {
            name: 'Licensed Under MIT',
            url: 'https://spdx.org/licenses/MIT.html',
        },
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 8080}`,
            description: 'Development',
        },
    ],
    paths: {
        '/api/users': {
            get: {
                summary: 'Get a list of users',
                description: 'Retrieve a list of user records',
                responses: {
                    '200': {
                        description: 'A list of user records',
                    },
                    '500': {
                        description: 'Internal server error',
                    },
                },
            },
        },
    },
};

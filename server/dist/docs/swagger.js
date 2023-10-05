"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    openapi: '3.1.0',
    info: {
        title: 'Vinadia API',
        version: '1.0.0',
        description: 'API documentation for a social media webapp',
    },
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

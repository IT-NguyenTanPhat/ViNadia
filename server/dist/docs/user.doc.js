"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userDoc = {
    '/users/:userId': {
        get: {
            summary: 'Get a user profile.',
            security: [{ access_token: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'userId',
                    description: 'ID of the user',
                    schema: { type: 'string' },
                    required: true,
                },
            ],
            responses: {
                '200': {
                    description: 'Returned data successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    user: {
                                        type: 'object',
                                        example: '{ name: Admin, email: admin@gmail.com }',
                                    },
                                },
                            },
                        },
                    },
                },
                '400': { $ref: '#/components/responses/InvalidInput' },
                '403': { $ref: '#/components/responses/Forbidden' },
            },
        },
    },
    '/users/:userId/posts': {
        get: {
            summary: 'Get post list of user.',
            security: [{ access_token: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'userId',
                    description: 'ID of the user',
                    schema: { type: 'string' },
                    required: true,
                },
            ],
            responses: {
                '200': {
                    description: 'Returned data successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    posts: { type: 'array', example: '[{}, {},... ]' },
                                },
                            },
                        },
                    },
                },
                '400': { $ref: '#/components/responses/InvalidInput' },
                '404': { $ref: '#/components/responses/NotFound' },
                '403': { $ref: '#/components/responses/Forbidden' },
            },
        },
    },
    '/users/:userId/suggested-friends': {
        get: {
            summary: 'Get suggested friends of user.',
            security: [{ access_token: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'userId',
                    description: 'ID of the user',
                    schema: { type: 'string' },
                    required: true,
                },
            ],
            responses: {
                '200': {
                    description: 'Returned data successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    posts: { type: 'array', example: '[{}, {},... ]' },
                                },
                            },
                        },
                    },
                },
                '400': { $ref: '#/components/responses/InvalidInput' },
                '404': { $ref: '#/components/responses/NotFound' },
                '403': { $ref: '#/components/responses/Forbidden' },
            },
        },
    },
};
exports.default = userDoc;

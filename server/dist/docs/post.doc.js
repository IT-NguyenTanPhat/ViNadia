"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postDoc = {
    '/posts': {
        post: {
            summary: 'Create a new post.',
            security: [{ access_token: [] }],
            requestBody: {
                content: {
                    'multipart/form-data': {
                        schema: {
                            type: 'object',
                            properties: {
                                author: { type: 'string' },
                                description: { type: 'string' },
                                file: { type: 'string', format: 'binary' },
                            },
                            required: ['file', 'author'],
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    post: {
                                        type: 'object',
                                        example: '{ author: id, description: "", ... }',
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
    '/posts/feed': {
        get: {
            summary: 'Get newfeed.',
            responses: {
                '200': {
                    description: 'Returned data successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    posts: { type: 'array', example: '[{}, {}, ...]' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/posts/:postId/like': {
        patch: {
            summary: 'Like or dislike a post.',
            security: [{ access_token: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'postId',
                    description: 'ID of the post',
                    schema: { type: 'string' },
                    required: true,
                },
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: { userId: { type: 'string' } },
                            required: ['userId'],
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    post: {
                                        type: 'object',
                                        example: '{ author: id, description: ""}',
                                    },
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
exports.default = postDoc;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    openapi: '3.1.0',
    info: {
        title: 'Express API for ViNadia',
        version: '1.0.0',
        description: 'This is a REST API application made with Express. It retrieves data from Vinadia.',
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
    paths: {},
};

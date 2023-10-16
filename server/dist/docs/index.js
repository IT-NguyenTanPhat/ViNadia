"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const components_1 = __importDefault(require("./components"));
const auth_doc_1 = __importDefault(require("./auth.doc"));
const friendship_doc_1 = __importDefault(require("./friendship.doc"));
const post_doc_1 = __importDefault(require("./post.doc"));
const user_doc_1 = __importDefault(require("./user.doc"));
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
    securityDefinitions: {
        API_KEY: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'API key',
        },
    },
    paths: Object.assign(Object.assign(Object.assign(Object.assign({}, friendship_doc_1.default), post_doc_1.default), user_doc_1.default), auth_doc_1.default),
    components: Object.assign(Object.assign({}, components_1.default), { securitySchemes: {
            access_token: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjAyMkMwNDYxNjgiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5NzA5NzgyNSwiZXhwIjoxNjk3MTI2NjI1fQ.ldiuxcPXlz11vzOkHo6BlSbMMqBakWdXaqtBvtTC_y8',
            },
        } }),
};

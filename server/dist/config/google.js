"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ggClient = void 0;
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const GG_CLIENT_ID = process.env.GG_CLIENT_ID;
const GG_CLIENT_SECRET = process.env.GG_CLIENT_SECRET;
exports.ggClient = new googleapis_1.google.auth.OAuth2(GG_CLIENT_ID, GG_CLIENT_SECRET, 'postmessage');

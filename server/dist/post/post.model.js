"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    image: String,
    description: String,
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    comments: Array,
}, {
    timestamps: true,
});
exports.PostModel = (0, mongoose_1.model)('Post', PostSchema);

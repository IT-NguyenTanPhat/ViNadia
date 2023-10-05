"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendshipModel = void 0;
const mongoose_1 = require("mongoose");
const FriendshipSchema = new mongoose_1.Schema({
    from: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['requested', 'accepted'],
        default: 'requested',
    },
}, {
    timestamps: true,
});
exports.FriendshipModel = (0, mongoose_1.model)('Friendship', FriendshipSchema);

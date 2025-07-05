"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    articleId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
    },
    username: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    isLiked: { type: Boolean, default: false },
    parentId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Comment', default: null },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Comment', commentSchema);

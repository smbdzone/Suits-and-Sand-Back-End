"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    type: { type: String, enum: ['comment', 'contact', 'application'], required: true },
    user: {
        name: { type: String },
        avatar: { type: String, default: '' }
    },
    articleId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Article' },
    articleTitle: { type: String },
    description: { type: String },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Notification', notificationSchema);

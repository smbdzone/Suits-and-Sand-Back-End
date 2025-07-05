"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const arrayLimit = (val) => val.length <= 4;
const articleSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 80,
    },
    category: {
        type: String,
        required: true,
        enum: ['News', 'Regulations', 'Announcements'],
    },
    bannerUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageAlt: {
        type: String,
        maxlength: 30,
    },
    seoTitle: {
        type: String,
        maxlength: 80,
    },
    seoDescription: {
        type: String,
    },
    articleSchemas: {
        type: [mongoose_1.default.Schema.Types.Mixed],
        default: [],
        validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
    },
}, {
    timestamps: true,
});
exports.Article = mongoose_1.default.model('Article', articleSchema);

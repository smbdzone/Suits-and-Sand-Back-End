"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.createComment = exports.toggleLike = exports.getCommentsByArticle = void 0;
const comment_model_1 = __importDefault(require("../../models/comment.model"));
const notification_model_1 = __importDefault(require("../../models/notification.model"));
// =============================
// GET COMMENTS BY ARTICLE
// =============================
const getCommentsByArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId } = req.params;
        const comments = yield comment_model_1.default.find({ articleId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    }
    catch (error) {
        console.error('Get Comments Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getCommentsByArticle = getCommentsByArticle;
// =============================
// TOGGLE LIKE ON COMMENT
// =============================
const toggleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const comment = yield comment_model_1.default.findById(id);
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        // Toggle like
        comment.isLiked = !comment.isLiked;
        comment.likes = comment.isLiked ? comment.likes + 1 : comment.likes - 1;
        yield comment.save();
        res.status(200).json(comment);
    }
    catch (error) {
        console.error('Toggle Like Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.toggleLike = toggleLike;
// =============================
// CREATE COMMENT + NOTIFICATION
// =============================
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId, username, content, parentId } = req.body;
        if (!articleId || !username || !content) {
            res.status(400).json({ message: 'Missing required fields.' });
            return;
        }
        const comment = new comment_model_1.default({ articleId, username, content, parentId });
        yield comment.save();
        // Create notification
        const notification = new notification_model_1.default({
            type: 'comment',
            user: {
                name: username,
                avatar: '', // You can send this from frontend later if needed
            },
            articleId,
            articleTitle: 'Article Title', // (optional: dynamically populate if needed)
            description: `${username} commented: "${content.substring(0, 50)}..."`,
        });
        yield notification.save();
        res.status(201).json(comment);
    }
    catch (error) {
        console.error('Create Comment Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createComment = createComment;
// =============================
// DELETE COMMENT
// =============================
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield comment_model_1.default.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        res.status(200).json({ message: 'Comment deleted' });
    }
    catch (error) {
        console.error('Delete Comment Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteComment = deleteComment;

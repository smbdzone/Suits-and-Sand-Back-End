"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("./comment.controller");
const router = express_1.default.Router();
// Routes
router.get('/:articleId', comment_controller_1.getCommentsByArticle);
router.post('/', comment_controller_1.createComment);
router.delete('/:id', comment_controller_1.deleteComment);
router.post('/:id/like', comment_controller_1.toggleLike);
exports.default = router;

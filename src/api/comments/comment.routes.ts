import express from 'express';
import {
  getCommentsByArticle,
  createComment,
  deleteComment,
  toggleLike,
} from './comment.controller';

const router = express.Router();

// Routes
router.get('/:articleId', getCommentsByArticle);
router.post('/', createComment);
router.delete('/:id', deleteComment);
router.post('/:id/like', toggleLike);
export default router;

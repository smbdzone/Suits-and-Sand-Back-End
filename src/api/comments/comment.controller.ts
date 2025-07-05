import { Request, Response } from 'express';
import Comment from '../../models/comment.model';
import Notification from '../../models/notification.model';

// =============================
// GET COMMENTS BY ARTICLE
// =============================
export const getCommentsByArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { articleId } = req.params;
    const comments = await Comment.find({ articleId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (error) {
    console.error('Get Comments Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// TOGGLE LIKE ON COMMENT
// =============================
export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    // Toggle like
    comment.isLiked = !comment.isLiked;
    comment.likes = comment.isLiked ? comment.likes + 1 : comment.likes - 1;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    console.error('Toggle Like Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// =============================
// CREATE COMMENT + NOTIFICATION
// =============================
export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { articleId, username, content, parentId } = req.body;

    if (!articleId || !username || !content) {
      res.status(400).json({ message: 'Missing required fields.' });
      return;
    }

    const comment = new Comment({ articleId, username, content, parentId });
    await comment.save();

    // Create notification
    const notification = new Notification({
      type: 'comment',
      user: {
        name: username,
        avatar: '', // You can send this from frontend later if needed
      },
      articleId,
      articleTitle: 'Article Title', // (optional: dynamically populate if needed)
      description: `${username} commented: "${content.substring(0, 50)}..."`,
    });
    await notification.save();

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create Comment Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// =============================
// DELETE COMMENT
// =============================
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Comment.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Delete Comment Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

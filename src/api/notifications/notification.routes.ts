// routes/notification.routes.ts
import express from 'express';
import {
  getNotifications,
  deleteNotification,
  markAsRead,
} from './notification.controller';

const router = express.Router();

router.get('/', getNotifications);
router.delete('/:id', deleteNotification);
router.put('/:id/read', markAsRead);

export default router;

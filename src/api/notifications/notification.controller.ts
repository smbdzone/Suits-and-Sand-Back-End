// controllers/notification.controller.ts
import { Request, Response } from 'express';
import Notification from '../../models/notification.model';

// =============================
// GET NOTIFICATIONS
// =============================
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { unread } = req.query;
    const filter = unread === 'true' ? { isRead: false } : {};
    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// DELETE NOTIFICATION
// =============================
export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// MARK AS READ
// =============================
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error('Mark As Read Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
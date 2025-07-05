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
exports.markAsRead = exports.deleteNotification = exports.getNotifications = void 0;
const notification_model_1 = __importDefault(require("../../models/notification.model"));
// =============================
// GET NOTIFICATIONS
// =============================
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { unread } = req.query;
        const filter = unread === 'true' ? { isRead: false } : {};
        const notifications = yield notification_model_1.default.find(filter).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error('Get Notifications Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getNotifications = getNotifications;
// =============================
// DELETE NOTIFICATION
// =============================
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield notification_model_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }
        res.status(200).json({ message: 'Notification deleted' });
    }
    catch (error) {
        console.error('Delete Notification Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteNotification = deleteNotification;
// =============================
// MARK AS READ
// =============================
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = yield notification_model_1.default.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }
        res.status(200).json(notification);
    }
    catch (error) {
        console.error('Mark As Read Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.markAsRead = markAsRead;

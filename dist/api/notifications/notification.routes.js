"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/notification.routes.ts
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("./notification.controller");
const router = express_1.default.Router();
router.get('/', notification_controller_1.getNotifications);
router.delete('/:id', notification_controller_1.deleteNotification);
router.put('/:id/read', notification_controller_1.markAsRead);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsletter_controller_1 = require("./newsletter.controller");
const router = (0, express_1.Router)();
router.post('/', newsletter_controller_1.subscribeNewsletter);
router.get('/', newsletter_controller_1.getNewsletterSubscribers);
exports.default = router;

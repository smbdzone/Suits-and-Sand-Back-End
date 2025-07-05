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
exports.getNewsletterSubscribers = exports.subscribeNewsletter = void 0;
const email_model_1 = __importDefault(require("../../models/email.model"));
const subscribeNewsletter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: 'Please provide an email.' });
            return;
        }
        // Check if email already subscribed
        const existingSubscription = yield email_model_1.default.findOne({ email });
        if (existingSubscription) {
            res.status(400).json({ message: 'This email is already subscribed.' });
            return;
        }
        const newSubscription = new email_model_1.default({ email });
        yield newSubscription.save();
        res.status(201).json({ message: 'Subscribed successfully', subscription: newSubscription });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.subscribeNewsletter = subscribeNewsletter;
const getNewsletterSubscribers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscribers = yield email_model_1.default.find({}, { email: 1, date: 1, _id: 0 }).lean();
        const formattedSubscribers = subscribers.map(sub => ({
            email: sub.email,
            date: new Date(sub.date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
        }));
        res.status(200).json(formattedSubscribers);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getNewsletterSubscribers = getNewsletterSubscribers;

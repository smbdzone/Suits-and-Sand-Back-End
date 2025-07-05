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
exports.getAllEnquiries = exports.submitEnquiries = void 0;
const enquire_model_1 = __importDefault(require("../../models/enquire.model"));
const submitEnquiries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, phone, email, budget, type } = req.body;
        // Validate required fields
        if (!firstName || !phone || !email || !budget || !type) {
            res.status(400).json({ message: 'Please provide all required fields.' });
            return;
        }
        const newEnquiry = new enquire_model_1.default({
            firstName,
            lastName,
            phone,
            email,
            budget,
            type,
        });
        yield newEnquiry.save();
        res.status(201).json(newEnquiry);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.submitEnquiries = submitEnquiries;
const getAllEnquiries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enquiries = yield enquire_model_1.default.find();
        res.json(enquiries);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllEnquiries = getAllEnquiries;

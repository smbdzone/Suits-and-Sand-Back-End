"use strict";
// models/enquiry.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EnquirySchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String }, // optional
    phone: { type: String, required: true },
    email: { type: String, required: true },
    budget: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
const EnquiryModel = mongoose_1.models.Enquiry || (0, mongoose_1.model)("Enquiry", EnquirySchema);
exports.default = EnquiryModel;

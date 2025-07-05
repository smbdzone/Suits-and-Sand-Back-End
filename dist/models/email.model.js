"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EmailSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
});
const EmailModel = mongoose_1.models.Email || (0, mongoose_1.model)('Email', EmailSchema);
exports.default = EmailModel;

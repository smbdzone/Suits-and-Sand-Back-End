"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jobSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, maxlength: 50 },
    description: { type: String, required: true },
    remunerationType: { type: String, enum: ['commission', 'salary'], required: true },
    commission: { type: String },
    salary: { type: String },
}, {
    timestamps: true
});
exports.Job = mongoose_1.default.model('Job', jobSchema);

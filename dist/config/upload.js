"use strict";
// src/config/upload.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const useSupabase = process.env.USE_SUPABASE === 'true';
let storage;
if (useSupabase) {
    // In-memory storage for Supabase
    storage = multer_1.default.memoryStorage();
}
else {
    // Local disk storage
    storage = multer_1.default.diskStorage({
        destination(req, file, cb) {
            cb(null, path_1.default.join(__dirname, '..', '..', 'uploads'));
        },
        filename(req, file, cb) {
            cb(null, Date.now() + path_1.default.extname(file.originalname));
        },
    });
}
const upload = (0, multer_1.default)({ storage });
exports.default = upload;

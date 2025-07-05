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
exports.submitApplication = exports.upload = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Multer storage config
const storage = multer_1.default.diskStorage({
    destination: './uploads',
    filename: (_, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
exports.upload = (0, multer_1.default)({ storage }).single('resume');
// Email handler
const submitApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, phone, position, experience, coverLetter } = req.body;
    const resumeFile = req.file;
    if (!resumeFile) {
        res.status(400).json({ error: 'Resume file is missing' });
        return;
    }
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
        yield transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: `New Job Application: ${firstName} ${lastName}`,
            text: `
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Position: ${position}
Experience: ${experience}

Cover Letter:
${coverLetter}
      `,
            attachments: [
                {
                    filename: resumeFile.originalname,
                    path: resumeFile.path,
                }
            ]
        });
        fs_1.default.unlinkSync(resumeFile.path);
        res.status(200).json({ message: 'Application sent successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error sending application' });
    }
});
exports.submitApplication = submitApplication;

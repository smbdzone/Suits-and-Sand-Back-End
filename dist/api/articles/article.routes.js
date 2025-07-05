"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const article_controller_1 = require("./article.controller");
const path_1 = __importDefault(require("path"));
const useSupabase = process.env.USE_SUPABASE === 'true';
const router = express_1.default.Router();
// Multer config for file upload
const storage = useSupabase
    ? multer_1.default.memoryStorage()
    : multer_1.default.diskStorage({
        destination: function (_req, _file, cb) {
            cb(null, path_1.default.join(__dirname, '..', '..', '..', 'uploads'));
        },
        filename: function (_req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });
const upload = (0, multer_1.default)({ storage });
// Routes
router.get('/', article_controller_1.getArticles);
router.get('/:id', article_controller_1.getArticleById);
router.post('/', upload.single('banner'), article_controller_1.createArticle);
router.put('/:id', upload.single('banner'), article_controller_1.updateArticle);
router.delete('/:id', article_controller_1.deleteArticle);
exports.default = router;

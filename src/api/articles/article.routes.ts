import express from 'express';
import multer from 'multer';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from './article.controller';
import path from 'path';
const useSupabase = process.env.USE_SUPABASE === 'true';

const router = express.Router();

// Multer config for file upload
const storage = useSupabase
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: function (_req, _file, cb) {
        cb(null, path.join(__dirname, '..', '..', '..', 'uploads'));
      },
      filename: function (_req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    });

const upload = multer({ storage });

// Routes
router.get('/', getArticles);
router.get('/:id', getArticleById);
router.post('/', upload.single('banner'), createArticle);
router.put('/:id', upload.single('banner'), updateArticle);
router.delete('/:id', deleteArticle);

export default router;

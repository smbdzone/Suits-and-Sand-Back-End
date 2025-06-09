import express from 'express';
import multer from 'multer';
import path from 'path';
import { getDevelopers, createDeveloper, updateDeveloper, deleteDeveloper, getDeveloperById } from './developer.controller';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '..','..', '..', 'uploads'));  // 2 levels up from src/api to root
  },
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


const upload = multer({ storage });

router.get('/', getDevelopers);
router.post('/', upload.single('logo'), createDeveloper);
router.put('/:id', upload.single('logo'), updateDeveloper);
router.get('/:id', getDeveloperById);
router.delete('/:id', deleteDeveloper);


export default router;

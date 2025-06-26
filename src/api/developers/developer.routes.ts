import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getDevelopers,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  getDeveloperById,
} from './developer.controller';

const router = express.Router();
const useSupabase = process.env.USE_SUPABASE === 'true';

// === Multer Config ===
const storage = useSupabase
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination(req, file, cb) {
        cb(null, path.join(__dirname, '..', '..', '..', 'uploads')); // Adjust path for local storage
      },
      filename(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    });

// === File Filter (optional) ===
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'logo') {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      return cb(new Error('Only image files (jpeg, png, webp) are allowed for the logo.'));
    }
  } else {
    cb(null, true); // allow other fields if added later
  }
};

const upload = multer({ storage, fileFilter });

// === Routes ===
router.get('/', getDevelopers);
router.post('/', upload.single('logo'), createDeveloper);
router.put('/:id', upload.single('logo'), updateDeveloper);
router.get('/:id', getDeveloperById);
router.delete('/:id', deleteDeveloper);

export default router;

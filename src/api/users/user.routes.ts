import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
} from './user.controller';

const router = express.Router();
const useSupabase = process.env.USE_SUPABASE === 'true';

// === Multer Config ===
const storage = useSupabase
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination(req, file, cb) {
        cb(null, path.join(__dirname, '..', '..', '..', 'uploads')); // Adjust as needed
      },
      filename(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    });

// === File Filter ===
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.fieldname === 'profilePicture') {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      return cb(new Error('Only jpeg, png, and webp formats allowed for profile pictures.'));
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter });

// === Routes ===
router.get('/', getUsers);
router.post('/', upload.single('profilePicture'), createUser);
router.put('/:id', upload.single('profilePicture'), updateUser);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

export default router;

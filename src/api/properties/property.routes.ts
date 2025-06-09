import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} from './property.controller';

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', '..', 'uploads'));
  },
  filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter (optional): restrict to images only, no video upload now
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isImage = /\.(jpeg|jpg|png)$/i.test(ext);
  const isPDF = /\.pdf$/i.test(ext);

  // Allow all image files regardless of field name
  if (isImage) {
    cb(null, true);
  }

  // Allow only brochure.pdf under the brochure field
  else if (isPDF && file.fieldname === 'brochure') {
    cb(null, true);
  }

  // Otherwise reject
  else {
    cb(new Error('Only image files are allowed for layouts and units, and only PDF for brochure.'));
  }
};




const upload = multer({ storage, fileFilter });

// Routes

router.get('/', getProperties);
router.get('/:id', getPropertyById);

router.post(
  '/',
  upload.any(),
  createProperty
);

router.put(
  '/:id',
  upload.any(),
  updateProperty
);


router.delete('/:id', deleteProperty);

export default router;

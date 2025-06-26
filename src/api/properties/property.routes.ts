import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createProperty,
  getProperties,
  getPropertyById,
  deleteProperty,
} from './property.controller';

const router = express.Router();
const useSupabase = process.env.USE_SUPABASE === 'true';

// === Multer Config ===
const storage = useSupabase
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination(req, file, cb) {
        cb(null, path.join(__dirname, '..', '..', '..', 'uploads'));
      },
      filename(req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
      },
    });

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const allowedBrochureTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const { fieldname, mimetype } = file;

  if (fieldname === 'brochureFile') {
    if (allowedBrochureTypes.includes(mimetype)) {
      cb(null, true);
    } else {
      return cb(new Error('Only PDF or DOCX files are allowed for brochure.'));
    }
  } else if (
    fieldname === 'propertyImages' ||
    fieldname.includes('layout') ||
    fieldname.includes('unit')
  ) {
    if (allowedImageTypes.includes(mimetype)) {
      cb(null, true);
    } else {
      return cb(new Error('Only image files are allowed for layouts and units.'));
    }
  } else {
    cb(null, true); // Allow other fields if any
  }
};

const upload = multer({ storage, fileFilter });

// === Upload Fields (dynamic floors/units) ===
const uploadFields = [
  { name: 'propertyImages', maxCount: 10 },
  { name: 'brochureFile', maxCount: 1 },
];

// Dynamic fields for 20 floors and unit types
for (let i = 0; i < 20; i++) {
  uploadFields.push({ name: `floor_${i}_defaultLayout`, maxCount: 1 });

  const unitTypes = ['Studio', '1_BHK', '2_BHK', '3_BHK', '2_BHK_Duplex', '3_BHK_Duplex', 'Penthouse'];
  for (const unit of unitTypes) {
    uploadFields.push({ name: `floor_${i}_unit_${unit}`, maxCount: 1 });
  }
}

// === Routes ===
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', upload.fields(uploadFields), createProperty);
router.delete('/:id', deleteProperty);

export default router;
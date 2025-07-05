"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const property_controller_1 = require("./property.controller");
const router = express_1.default.Router();
const useSupabase = process.env.USE_SUPABASE === 'true';
// === Multer Config ===
const storage = useSupabase
    ? multer_1.default.memoryStorage()
    : multer_1.default.diskStorage({
        destination(req, file, cb) {
            cb(null, path_1.default.join(__dirname, '..', '..', '..', 'uploads'));
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
const fileFilter = (req, file, cb) => {
    const { fieldname, mimetype } = file;
    if (fieldname === 'brochureFile') {
        if (allowedBrochureTypes.includes(mimetype)) {
            cb(null, true);
        }
        else {
            return cb(new Error('Only PDF or DOCX files are allowed for brochure.'));
        }
    }
    else if (fieldname === 'propertyImages' ||
        fieldname.includes('layout') ||
        fieldname.includes('unit')) {
        if (allowedImageTypes.includes(mimetype)) {
            cb(null, true);
        }
        else {
            return cb(new Error('Only image files are allowed for layouts and units.'));
        }
    }
    else {
        cb(null, true); // Allow other fields if any
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 200 * 1024 * 1024 },
});
// === Upload Fields (dynamic floors/units) ===
const uploadFields = [
    { name: 'propertyImages', maxCount: 10 },
    { name: 'brochureFile', maxCount: 1 },
];
for (let i = 0; i < 30; i++) {
    uploadFields.push({ name: `floor_${i}_defaultLayout`, maxCount: 1 });
    const unitTypes = ['Studio', '1_BHK', '2_BHK', '3_BHK', '2_BHK_Duplex', '3_BHK_Duplex', 'Penthouse'];
    for (const unit of unitTypes) {
        uploadFields.push({ name: `floor_${i}_unit_${unit}`, maxCount: 1 });
        for (let variantIndex = 0; variantIndex < 10; variantIndex++) {
            uploadFields.push({ name: `floor_${i}_unit_${unit}_variant_${variantIndex}_image`, maxCount: 1 });
            //uploadFields.push({ name: `floor_${i}_unit_${unit}_variant_${variantIndex}_name`, maxCount: 1 });
        }
    }
}
// === Routes ===
router.get('/', property_controller_1.getProperties);
router.get('/:id', property_controller_1.getPropertyById);
router.post('/', upload.fields(uploadFields), property_controller_1.createProperty);
router.delete('/:id', property_controller_1.deleteProperty);
router.put('/:id', upload.fields(uploadFields), property_controller_1.updateProperty);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const developer_controller_1 = require("./developer.controller");
const router = express_1.default.Router();
const useSupabase = process.env.USE_SUPABASE === 'true';
// === Multer Config ===
const storage = useSupabase
    ? multer_1.default.memoryStorage()
    : multer_1.default.diskStorage({
        destination(req, file, cb) {
            cb(null, path_1.default.join(__dirname, '..', '..', '..', 'uploads')); // Adjust path for local storage
        },
        filename(req, file, cb) {
            cb(null, Date.now() + path_1.default.extname(file.originalname));
        },
    });
// === File Filter (optional) ===
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'logo') {
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            return cb(new Error('Only image files (jpeg, png, webp) are allowed for the logo.'));
        }
    }
    else {
        cb(null, true); // allow other fields if added later
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter });
// === Routes ===
router.get('/', developer_controller_1.getDevelopers);
router.post('/', upload.single('logo'), developer_controller_1.createDeveloper);
router.put('/:id', upload.single('logo'), developer_controller_1.updateDeveloper);
router.get('/:id', developer_controller_1.getDeveloperById);
router.delete('/:id', developer_controller_1.deleteDeveloper);
exports.default = router;

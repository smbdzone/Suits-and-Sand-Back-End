"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
const useSupabase = process.env.USE_SUPABASE === 'true';
// === Multer Config ===
const storage = useSupabase
    ? multer_1.default.memoryStorage()
    : multer_1.default.diskStorage({
        destination(req, file, cb) {
            cb(null, path_1.default.join(__dirname, '..', '..', '..', 'uploads')); // Adjust as needed
        },
        filename(req, file, cb) {
            cb(null, Date.now() + path_1.default.extname(file.originalname));
        },
    });
// === File Filter ===
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'profilePicture') {
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            return cb(new Error('Only jpeg, png, and webp formats allowed for profile pictures.'));
        }
    }
    else {
        cb(null, true);
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter });
// === Routes ===
router.get('/', user_controller_1.getUsers);
router.post('/', upload.single('profilePicture'), user_controller_1.createUser);
router.put('/:id', upload.single('profilePicture'), user_controller_1.updateUser);
router.get('/:id', user_controller_1.getUserById);
router.delete('/:id', user_controller_1.deleteUser);
exports.default = router;

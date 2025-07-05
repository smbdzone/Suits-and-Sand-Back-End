"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const supabaseClient_1 = __importDefault(require("../../services/supabaseClient"));
const useSupabase = process.env.USE_SUPABASE === 'true';
// Upload profile picture to Supabase
const uploadProfilePictureToSupabase = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const buffer = file.buffer;
    const fileName = `${Date.now()}-${file.originalname}`;
    const { error } = yield supabaseClient_1.default.storage
        .from('uploads')
        .upload(fileName, buffer, {
        contentType: file.mimetype,
        upsert: true,
    });
    if (error)
        throw error;
    return `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
});
// =============================
// GET ALL USERS
// =============================
const getUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUsers = getUsers;
// =============================
// CREATE USER
// =============================
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, role, status } = req.body;
        const profilePictureFile = req.file;
        if (!fullName || !email || !password || !role || typeof status === 'undefined') {
            res.status(400).json({ message: 'Please provide all required fields.' });
            return;
        }
        let profilePictureUrl = '';
        if (profilePictureFile) {
            profilePictureUrl = useSupabase
                ? yield uploadProfilePictureToSupabase(profilePictureFile)
                : `/uploads/${profilePictureFile.filename}`;
        }
        const newUser = new user_model_1.default({
            fullName,
            email,
            password, // Make sure to hash this in production!
            role,
            status,
            profilePicture: profilePictureUrl || undefined,
        });
        yield newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Create User Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createUser = createUser;
// =============================
// UPDATE USER
// =============================
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { fullName, email, password, role, status } = req.body;
        const profilePictureFile = req.file;
        const updateData = {
            fullName,
            email,
            password,
            role,
            status,
        };
        if (profilePictureFile) {
            updateData.profilePicture = useSupabase
                ? yield uploadProfilePictureToSupabase(profilePictureFile)
                : `/uploads/${profilePictureFile.filename}`;
        }
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(updatedUser);
    }
    catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateUser = updateUser;
// =============================
// DELETE USER
// =============================
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteUser = deleteUser;
// =============================
// GET USER BY ID
// =============================
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserById = getUserById;

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
exports.getDeveloperById = exports.deleteDeveloper = exports.updateDeveloper = exports.createDeveloper = exports.getDevelopers = void 0;
const developer_model_1 = __importDefault(require("../../models/developer.model"));
const supabaseClient_1 = __importDefault(require("../../services/supabaseClient"));
const useSupabase = process.env.USE_SUPABASE === 'true';
// Upload logo to Supabase
const uploadFileToSupabase = (file) => __awaiter(void 0, void 0, void 0, function* () {
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
// GET ALL DEVELOPERS
// =============================
const getDevelopers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const developers = yield developer_model_1.default.find();
        res.json(developers);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getDevelopers = getDevelopers;
// =============================
// CREATE DEVELOPER
// =============================
const createDeveloper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, numberOfProjects, projectsHandedOver } = req.body;
        const logoFile = req.file;
        if (!title || !description || !logoFile) {
            res.status(400).json({ message: 'Please provide all required fields.' });
            return;
        }
        let logoUrl = '';
        if (useSupabase) {
            logoUrl = yield uploadFileToSupabase(logoFile);
        }
        else {
            logoUrl = `/uploads/${logoFile.filename}`;
        }
        const newDeveloper = new developer_model_1.default({
            title,
            description,
            logoUrl,
            numberOfProjects,
            projectsHandedOver,
        });
        yield newDeveloper.save();
        res.status(201).json(newDeveloper);
    }
    catch (error) {
        console.error('Create Developer Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createDeveloper = createDeveloper;
// =============================
// UPDATE DEVELOPER
// =============================
const updateDeveloper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, numberOfProjects, projectsHandedOver } = req.body;
        const logoFile = req.file;
        const updateData = {
            title,
            description,
            numberOfProjects,
            projectsHandedOver,
        };
        if (logoFile) {
            updateData.logoUrl = useSupabase
                ? yield uploadFileToSupabase(logoFile)
                : `/uploads/${logoFile.filename}`;
        }
        const updatedDeveloper = yield developer_model_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedDeveloper) {
            res.status(404).json({ message: 'Developer not found' });
            return;
        }
        res.json(updatedDeveloper);
    }
    catch (error) {
        console.error('Update Developer Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateDeveloper = updateDeveloper;
// =============================
// DELETE DEVELOPER
// =============================
const deleteDeveloper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield developer_model_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Developer deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteDeveloper = deleteDeveloper;
// =============================
// GET DEVELOPER BY ID
// =============================
const getDeveloperById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const developer = yield developer_model_1.default.findById(req.params.id);
        if (!developer) {
            res.status(404).json({ message: 'Developer not found' });
            return;
        }
        res.json(developer);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getDeveloperById = getDeveloperById;

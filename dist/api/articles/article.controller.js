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
exports.deleteArticle = exports.updateArticle = exports.createArticle = exports.getArticleById = exports.getArticles = void 0;
const article_model_1 = require("../../models/article.model");
const supabaseClient_1 = __importDefault(require("../../services/supabaseClient"));
const getArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield article_model_1.Article.find();
        res.json(articles);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getArticles = getArticles;
const getArticleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const article = yield article_model_1.Article.findById(id);
        if (!article) {
            res.status(404).json({ message: 'Article not found' });
            return;
        }
        res.json(article);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getArticleById = getArticleById;
const useSupabase = process.env.USE_SUPABASE === 'true';
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, category, description, imageAlt, seoTitle, seoDescription, articleSchemas, } = req.body;
        const bannerFile = req.file;
        if (!title ||
            !category ||
            !description ||
            !imageAlt ||
            !seoTitle ||
            !seoDescription ||
            !articleSchemas ||
            !bannerFile) {
            res.status(400).json({ message: 'All fields are required.' });
            return;
        }
        let bannerUrl = '';
        if (useSupabase) {
            const buffer = bannerFile.buffer;
            const fileName = `${Date.now()}-${bannerFile.originalname}`;
            const { error } = yield supabaseClient_1.default.storage
                .from('uploads')
                .upload(fileName, buffer, {
                contentType: bannerFile.mimetype,
                upsert: true,
            });
            if (error)
                throw error;
            bannerUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
        }
        else {
            bannerUrl = `/uploads/${bannerFile.filename}`;
        }
        const newArticle = new article_model_1.Article({
            title,
            category,
            bannerUrl,
            description,
            imageAlt,
            seoTitle,
            seoDescription,
            articleSchemas,
        });
        yield newArticle.save();
        res.status(201).json(newArticle);
    }
    catch (error) {
        console.error('Error in createArticle:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createArticle = createArticle;
const updateArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, category, description, imageAlt, seoTitle, seoDescription, articleSchemas, } = req.body;
        const updateData = {
            title,
            category,
            description,
            imageAlt,
            seoTitle,
            seoDescription,
            articleSchemas,
        };
        if (req.file) {
            if (useSupabase) {
                const buffer = req.file.buffer;
                const fileName = `${Date.now()}-${req.file.originalname}`;
                const { error } = yield supabaseClient_1.default.storage
                    .from('uploads')
                    .upload(fileName, buffer, {
                    contentType: req.file.mimetype,
                    upsert: true,
                });
                if (error)
                    throw error;
                updateData.bannerUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
            }
            else {
                updateData.bannerUrl = `/uploads/${req.file.filename}`;
            }
        }
        const updatedArticle = yield article_model_1.Article.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedArticle) {
            res.status(404).json({ message: 'Article not found' });
            return;
        }
        res.json(updatedArticle);
    }
    catch (error) {
        console.error('Error in updateArticle:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateArticle = updateArticle;
const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield article_model_1.Article.findByIdAndDelete(id);
        res.status(200).json({ message: 'Article deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteArticle = deleteArticle;

import { Request, Response } from 'express';
import { Article } from '../../models/article.model';

export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      category,
      description,
      imageAlt,
      seoTitle,
      seoDescription,
      articleSchemas,
    } = req.body;

    const bannerFile = req.file;

    if (
      !title ||
      !category ||
      !description ||
      !imageAlt ||
      !seoTitle ||
      !seoDescription ||
      !articleSchemas ||
      !bannerFile
    ) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }

    const bannerUrl = `/uploads/${bannerFile.filename}`;
    const newArticle = new Article({
      title,
      category,
      bannerUrl,
      description,
      imageAlt,
      seoTitle,
      seoDescription,
      articleSchemas,
    });

    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      description,
      imageAlt,
      seoTitle,
      seoDescription,
      articleSchemas,
    } = req.body;

    const updateData: any = {
      title,
      category,
      description,
      imageAlt,
      seoTitle,
      seoDescription,
      articleSchemas,
    };

    if (req.file) {
      updateData.bannerUrl = `/uploads/${req.file.filename}`;
    }

    const updatedArticle = await Article.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedArticle) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }

    res.json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Article.findByIdAndDelete(id);
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

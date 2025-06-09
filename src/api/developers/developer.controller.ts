import { Request, Response } from 'express';
import Developer from '../../models/developer.model';

export const getDevelopers = async (req: Request, res: Response): Promise<void> => {
  try {
    const developers = await Developer.find();
    res.json(developers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createDeveloper = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    const logoFile = req.file;

    if (!title || !description || !logoFile) {
      res.status(400).json({ message: 'Please provide all required fields.' });
      return;
    }

    const logoUrl = `/uploads/${logoFile.filename}`;
    const newDeveloper = new Developer({ title, description, logoUrl });
    await newDeveloper.save();

    res.status(201).json(newDeveloper);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateDeveloper = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const logoFile = req.file;

    const updateData: any = { title, description };
    if (logoFile) {
      updateData.logoUrl = `/uploads/${logoFile.filename}`;
    }

    const updatedDeveloper = await Developer.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedDeveloper) {
      res.status(404).json({ message: 'Developer not found' });
      return;
    }

    res.json(updatedDeveloper);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteDeveloper = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Developer.findByIdAndDelete(id);
    res.status(200).json({ message: "Developer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getDeveloperById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const developer = await Developer.findById(id);
    if (!developer) {
      res.status(404).json({ message: 'Developer not found' });
      return;
    }
    res.json(developer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

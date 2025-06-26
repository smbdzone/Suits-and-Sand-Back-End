import { Request, Response } from 'express';
import Developer from '../../models/developer.model';
import supabase from '../../services/supabaseClient';

const useSupabase = process.env.USE_SUPABASE === 'true';

// Upload logo to Supabase
const uploadFileToSupabase = async (file: Express.Multer.File): Promise<string> => {
  const buffer = file.buffer;
  const fileName = `${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from('uploads')
    .upload(fileName, buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;

  return `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${fileName}`;
};

// =============================
// GET ALL DEVELOPERS
// =============================
export const getDevelopers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const developers = await Developer.find();
    res.json(developers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// CREATE DEVELOPER
// =============================
export const createDeveloper = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, numberOfProjects, projectsHandedOver } = req.body;
    const logoFile = req.file;

    if (!title || !description || !logoFile) {
      res.status(400).json({ message: 'Please provide all required fields.' });
      return;
    }

    let logoUrl = '';
    if (useSupabase) {
      logoUrl = await uploadFileToSupabase(logoFile);
    } else {
      logoUrl = `/uploads/${logoFile.filename}`;
    }

    const newDeveloper = new Developer({
      title,
      description,
      logoUrl,
      numberOfProjects,
      projectsHandedOver,
    });

    await newDeveloper.save();
    res.status(201).json(newDeveloper);
  } catch (error) {
    console.error('Create Developer Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// UPDATE DEVELOPER
// =============================
export const updateDeveloper = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, numberOfProjects, projectsHandedOver } = req.body;
    const logoFile = req.file;

    const updateData: any = {
      title,
      description,
      numberOfProjects,
      projectsHandedOver,
    };

    if (logoFile) {
      updateData.logoUrl = useSupabase
        ? await uploadFileToSupabase(logoFile)
        : `/uploads/${logoFile.filename}`;
    }

    const updatedDeveloper = await Developer.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedDeveloper) {
      res.status(404).json({ message: 'Developer not found' });
      return;
    }

    res.json(updatedDeveloper);
  } catch (error) {
    console.error('Update Developer Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// DELETE DEVELOPER
// =============================
export const deleteDeveloper = async (req: Request, res: Response): Promise<void> => {
  try {
    await Developer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Developer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// GET DEVELOPER BY ID
// =============================
export const getDeveloperById = async (req: Request, res: Response): Promise<void> => {
  try {
    const developer = await Developer.findById(req.params.id);
    if (!developer) {
      res.status(404).json({ message: 'Developer not found' });
      return;
    }
    res.json(developer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

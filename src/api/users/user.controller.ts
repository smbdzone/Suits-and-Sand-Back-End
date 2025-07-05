import { Request, Response } from 'express';
import User from '../../models/user.model';
import supabase from '../../services/supabaseClient';

const useSupabase = process.env.USE_SUPABASE === 'true';

// Upload profile picture to Supabase
const uploadProfilePictureToSupabase = async (file: Express.Multer.File): Promise<string> => {
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
// GET ALL USERS
// =============================
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// CREATE USER
// =============================
export const createUser = async (req: Request, res: Response): Promise<void> => {
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
        ? await uploadProfilePictureToSupabase(profilePictureFile)
        : `/uploads/${profilePictureFile.filename}`;
    }

    const newUser = new User({
      fullName,
      email,
      password, // Make sure to hash this in production!
      role,
      status,
      profilePicture: profilePictureUrl || undefined,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// UPDATE USER
// =============================
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, email, password, role, status } = req.body;
    const profilePictureFile = req.file;

    const updateData: any = {
      fullName,
      email,
      password,
      role,
      status,
    };

    if (profilePictureFile) {
      updateData.profilePicture = useSupabase
        ? await uploadProfilePictureToSupabase(profilePictureFile)
        : `/uploads/${profilePictureFile.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// DELETE USER
// =============================
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// GET USER BY ID
// =============================
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

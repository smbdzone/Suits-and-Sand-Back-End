import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model';
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}
import bcrypt from 'bcrypt';

// =============================
// LOGIN ADMIN (from DB)
// =============================
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.status !== 'active') {
      res.status(401).json({ message: 'Invalid credentials or inactive user' });
      return;
    }

    // ✅ Plain text comparison
    if (user.password !== password) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.status(200).json({ success: true, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


// =============================
// LOGOUT ADMIN
// =============================
export const logoutAdmin = (_req: Request, res: Response): void => {
  res.clearCookie('token', {
    path: '/',
  });
  res.status(200).json({ message: 'Logged out' });
};

// =============================
// CHECK AUTH STATUS
// =============================
export const getAdminProfile = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { id: string };

    const user = await User.findById(decoded.id).select('fullName role email profilePicture');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};


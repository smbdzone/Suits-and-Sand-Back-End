import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Multer storage config
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

export const upload = multer({ storage }).single('resume');

// Email handler
export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, phone, position, experience, coverLetter } = req.body;
  const resumeFile = req.file;

  if (!resumeFile) {
    res.status(400).json({ error: 'Resume file is missing' });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `New Job Application: ${firstName} ${lastName}`,
      text: `
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Position: ${position}
Experience: ${experience}

Cover Letter:
${coverLetter}
      `,
      attachments: [
        {
          filename: resumeFile.originalname,
          path: resumeFile.path,
        }
      ]
    });

    fs.unlinkSync(resumeFile.path);

    res.status(200).json({ message: 'Application sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error sending application' });
  }
};

import { Request, Response } from 'express';
import EnquiryModel from '../../models/enquire.model';

export const submitEnquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, phone, email, budget, type } = req.body;

    // Validate required fields
    if (!firstName || !phone || !email || !budget || !type) {
      res.status(400).json({ message: 'Please provide all required fields.' });
      return;
    }

    const newEnquiry = new EnquiryModel({
      firstName,
      lastName,
      phone,
      email,
      budget,
      type,
    });

    await newEnquiry.save();

    res.status(201).json(newEnquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllEnquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const enquiries = await EnquiryModel.find();
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

import { Request, Response } from 'express';
import EmailModel from '../../models/email.model';

export const subscribeNewsletter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Please provide an email.' });
      return;
    }

    // Check if email already subscribed
    const existingSubscription = await EmailModel.findOne({ email });
    if (existingSubscription) {
      res.status(400).json({ message: 'This email is already subscribed.' });
      return;
    }

    const newSubscription = new EmailModel({ email });
    await newSubscription.save();

    res.status(201).json({ message: 'Subscribed successfully', subscription: newSubscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const getNewsletterSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const subscribers = await EmailModel.find({}, { email: 1, date: 1, _id: 0 }).lean(); 
    const formattedSubscribers = subscribers.map(sub => ({
      email: sub.email,
      date: new Date(sub.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    }));

    res.status(200).json(formattedSubscribers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
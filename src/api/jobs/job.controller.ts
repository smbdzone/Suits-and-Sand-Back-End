import { Request, Response } from 'express';
import { Job } from '../../models/job.model';

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, remunerationType, commission, salary } = req.body;

    if (!title || !description || !remunerationType) {
      res.status(400).json({ message: 'Please provide all required fields.' });
      return;
    }

    // Validate remuneration fields based on remunerationType
    if (remunerationType === 'commission' && !commission) {
      res.status(400).json({ message: 'Commission must be provided for commission type.' });
      return;
    }
    if (remunerationType === 'salary' && !salary) {
      res.status(400).json({ message: 'Salary must be provided for salary type.' });
      return;
    }

    const newJob = new Job({ title, description, remunerationType, commission, salary });
    await newJob.save();

    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, remunerationType, commission, salary } = req.body;

    const updateData: any = { title, description, remunerationType, commission, salary };

    // Remove undefined or null fields to avoid overwriting with empty values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    const updatedJob = await Job.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedJob) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Resume, { IResume } from '../models/resumeModel';

// POST /api/resumes
export const createResume = async (req: Request, res: Response): Promise<void> => {
  try {
    // Build payload matching IResume (minus candidate & timestamps)
    const payload: Partial<IResume> = {
      candidate: new Types.ObjectId(req.userId!),     // use req.userId
      ...(req.body as Partial<IResume>),
    };

    const newResume = await Resume.create(payload);
    res.status(201).json(newResume);
  } catch (error) {
    console.error('createResume error:', error);
    res
      .status(500)
      .json({ message: 'Failed to create resume', error: (error as Error).message });
  }
};

// GET /api/resumes
export const getUserResumes = async (req: Request, res: Response): Promise<void> => {
  try {
    const resumes = await Resume.find({ candidate: req.userId }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    console.error('getUserResumes error:', error);
    res
      .status(500)
      .json({ message: 'Failed to get resumes', error: (error as Error).message });
  }
};

// GET /api/resumes/:id
export const getResumeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid resume ID' });
      return;
    }

    const resume = await Resume.findOne({
      _id: new Types.ObjectId(id),
      candidate: req.userId,
    });
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    res.json(resume);
  } catch (error) {
    console.error('getResumeById error:', error);
    res
      .status(500)
      .json({ message: 'Failed to get resume', error: (error as Error).message });
  }
};

// PUT /api/resumes/:id
export const updateResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid resume ID' });
      return;
    }

    const resume = await Resume.findOne({
      _id: new Types.ObjectId(id),
      candidate: req.userId,
    });
    if (!resume) {
      res.status(404).json({ message: 'Resume not found or unauthorized' });
      return;
    }

    Object.assign(resume, req.body as Partial<IResume>);
    const updated = await resume.save();
    res.json(updated);
  } catch (error) {
    console.error('updateResume error:', error);
    res
      .status(500)
      .json({ message: 'Failed to update resume', error: (error as Error).message });
  }
};

// DELETE /api/resumes/:id
export const deleteResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid resume ID' });
      return;
    }

    const deleted = await Resume.findOneAndDelete({
      _id: new Types.ObjectId(id),
      candidate: req.userId,
    });
    if (!deleted) {
      res.status(404).json({ message: 'Resume not found or unauthorized' });
      return;
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('deleteResume error:', error);
    res
      .status(500)
      .json({ message: 'Failed to delete resume', error: (error as Error).message });
  }
};

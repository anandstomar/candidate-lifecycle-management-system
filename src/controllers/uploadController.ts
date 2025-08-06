import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import fs from 'fs';
import path from 'path';
import Resume from '../models/resumeModel';

// POST /api/resumes/:id/upload
export const uploadResumeAssets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resumeId = req.params.id;
    if (!Types.ObjectId.isValid(resumeId)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    const resume = await Resume.findOne({
      _id: new Types.ObjectId(resumeId),
      candidate: new Types.ObjectId(req.userId!),
    });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found or unauthorized' });
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    const baseUrl    = `${req.protocol}://${req.get('host')}`;

    // profileImage
    const profileFile = (req.files as any)?.profileImage?.[0];
    if (profileFile) {
      if (resume.profileImage) {
        const oldPath = path.join(uploadsDir, path.basename(resume.profileImage));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      resume.profileImage = `${baseUrl}/uploads/${profileFile.filename}`;
    }

    // resumeFile
    const resumeFile = (req.files as any)?.resumeFile?.[0];
    if (resumeFile) {
      if (resume.resumeFile) {
        const oldPath = path.join(uploadsDir, path.basename(resume.resumeFile));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      resume.resumeFile = `${baseUrl}/uploads/${resumeFile.filename}`;
    }

    await resume.save();
    return res.status(200).json({
      message:    'Files uploaded successfully',
      profileImage: resume.profileImage,
      resumeFile:   resume.resumeFile,
    });
  } catch (err) {
    console.error('uploadResumeAssets error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

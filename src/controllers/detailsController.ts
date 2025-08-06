// src/controllers/candidateController.ts
import { Request, Response } from 'express';
import Candidate, { ICandidate } from '../models/detailsModel';
import mongoose from 'mongoose';
import User from '../models/authModel';

const safeParse = <T>(value: any, fieldName: string, res: Response): T | null => {
  try {
    return JSON.parse(value);
  } catch (err) {
    res.status(400).json({ message: `Invalid JSON for ${fieldName}` });
    return null;
  }
};

export const createCandidate = async (req: Request, res: Response) => {
  try {
    // Convert string userId to ObjectId
    const userIdStr = req.userId!;
    const userId = new mongoose.Types.ObjectId(userIdStr);

    // Prevent duplicate profiles
    if (await Candidate.findOne({ userId })) {
      return res.status(400).json({ message: 'Candidate profile already exists.' });
    }

    const files = req.files as {
      profileImage?: Express.Multer.File[];
      resume?: Express.Multer.File[];
    };
    if (!files.profileImage || !files.resume) {
      return res.status(400).json({ message: 'Profile image and resume are required.' });
    }

    const data = req.body;
    const requiredFields = ['education','skills','experience','desirableJob'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ message: `Missing field: ${field}` });
      }
    }

    const education = safeParse<any[]>(data.education, 'education', res);
    if (!education) return;
    const skills = safeParse<string[]>(data.skills, 'skills', res);
    if (!skills) return;
    const experience = safeParse<any[]>(data.experience, 'experience', res);
    if (!experience) return;
    const desirableJob = safeParse<string[]>(data.desirableJob, 'desirableJob', res);
    if (!desirableJob) return;

    const candidateData: Partial<ICandidate> = {
      userId,
      fullName: data.fullName,
      email: data.email,
      dob: new Date(data.dob),
      contact: data.contact,
      address: data.address,
      education,
      skills,
      experience,
      desirableJob,
      profileCompletion: Number(data.profileCompletion) || 0,
      profileImage: files.profileImage[0].path,
      resume: files.resume[0].path,
    };

    const candidate = new Candidate(candidateData);
    const saved = await candidate.save();
    await User.findByIdAndUpdate(userId, { resumeStatus: 'Created' });

    res.status(201).json({ message: 'Candidate created', candidate: saved });
  } catch (err: any) {
    console.error('Error creating candidate:', err);
    res.status(500).json({ message: 'Error creating candidate', error: err.message });
  }
};


// Get all candidates
export const getCandidates = async (_req: Request, res: Response) => {
  try {
    const candidates = await Candidate.find();
    res.json({ count: candidates.length, candidates });
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching candidates', error: err.message });
  }
};

// Get candidate by id
export const getCandidateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found.' });
    res.json(candidate);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching candidate', error: err.message });
  }
};

// Update candidate (including optional file updates)
export const updateCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const files = req.files as {
      profileImage?: Express.Multer.File[];
      resume?: Express.Multer.File[];
    };
    const updates = { ...req.body } as Partial<ICandidate>;

    // parse arrays if present
    if (updates.education) updates.education = JSON.parse(updates.education as unknown as string);
    if (updates.skills) updates.skills = JSON.parse(updates.skills as unknown as string);
    if (updates.experience) updates.experience = JSON.parse(updates.experience as unknown as string);
    if (updates.desirableJob) updates.desirableJob = JSON.parse(updates.desirableJob as unknown as string);

    // handle new files
    if (files.profileImage) updates.profileImage = files.profileImage[0].path;
    if (files.resume) updates.resume = files.resume[0].path;

    const candidate = await Candidate.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found.' });
    res.json({ message: 'Candidate updated', candidate });
  } catch (err: any) {
    res.status(500).json({ message: 'Error updating candidate', error: err.message });
  }
};

// Delete candidate
export const deleteCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found.' });
    res.json({ message: 'Candidate deleted' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error deleting candidate', error: err.message });
  }
};

// Get profile for current user
export const getMyCandidate = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const candidate = await Candidate.findOne({ userId });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found.' });
    res.json(candidate);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// Get userId back (for frontend when needed)
export const getCandidateUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Authentication required.' });
    res.json({ userId });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to retrieve userId', error: err.message });
  }
};




// import { Request, Response } from 'express';
// import Candidate, { ICandidate } from '../models/detailsModel';
// import User from '../models/authModel'; // Make sure this import exists as you're using it to update resumeStatus

// // You might need to import updateOrCreateDashboardEntry if you decide to use the Dashboard model
// // import { updateOrCreateDashboardEntry } from './dashboardController'; // If you're using a Dashboard model

// export const createCandidate = async (req: Request, res: Response) => {
//   try {
//     // 1. Get userId from the authenticated request
//     const userId = req.userId!; // The '!' asserts that userId will not be null or undefined

//     // 2. Combine body data with the userId
//     const candidateData = {
//       ...req.body,
//       userId: userId // Add the userId explicitly
//     } as Partial<ICandidate>;

//     // Optional: Check if a candidate profile already exists for this userId
//     // This check is important because your CandidateSchema has 'userId: { ..., unique: true }'
//     const existingCandidate = await Candidate.findOne({ userId });
//     if (existingCandidate) {
//         return res.status(400).json({ message: 'Candidate profile already exists for this user.' });
//     }

//     // 3. Create the new Candidate document
//     const candidate = new Candidate(candidateData);
//     await candidate.save();

//     // 4. Update the User's resumeStatus after candidate creation
//     await User.findByIdAndUpdate(
//         userId,
//         { resumeStatus: 'Created' },
//         { new: true } // Return the updated document
//     );


//     res.status(201).json({ message: 'Candidate created', candidate });
//   } catch (error: any) {
//     // Log the error for better debugging
//     console.error("Error creating candidate:", error);
//     res.status(500).json({ message: 'Error creating candidate', error: error.message });
//   }
// };

// // ... rest of your detailsController.ts functions (getCandidates, getCandidateById, etc.)

// export const getCandidates = async (_req: Request, res: Response) => {
//   try {
//     const candidates = await Candidate.find();
//     res.json({ count: candidates.length, candidates });
//   } catch (error: any) {
//     res.status(500).json({ message: 'Error fetching candidates', error: error.message });
//   }
// };

// export const getCandidateById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const candidate = await Candidate.findById(id);
//     if (!candidate) return res.status(404).json({ message: 'Profile not found. Please create a profile first.' });
//     res.json(candidate);
//   } catch (error: any) {
//     res.status(500).json({ message: 'Error fetching candidate', error: error.message });
//   }
// };

// export const updateCandidate = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body as Partial<ICandidate>;
//     const candidate = await Candidate.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
//     if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
//     res.json({ message: 'Candidate updated', candidate });
//   } catch (error: any) {
//     res.status(500).json({ message: 'Error updating candidate', error: error.message });
//   }
// };

// export const deleteCandidate = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const candidate = await Candidate.findByIdAndDelete(id);
//     if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
//     res.json({ message: 'Candidate deleted' });
//   } catch (error: any) {
//     res.status(500).json({ message: 'Error deleting candidate', error: error.message });
//   }
// };

// export const getMyCandidate = async (req: Request, res: Response) => {
//   try {
    
//     const userId = req.userId!;
//     console.log('Fetching candidate for userId:', userId);
//     const candidate = await Candidate.findOne({ userId });
//     if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
//     res.json(candidate);
//   } catch (error: any) {
//     res.status(500).json({ message: 'Error fetching candidate profile', error: error.message });
//   }
// };

// export const getCandidateUserId = async (req: Request, res: Response) => {
//   try {
//     const userId = req.userId;
//     if (!userId) {
//       return res.status(401).json({ message: 'User ID not found in request. Authentication middleware might be missing or failed.' });
//     }
//     res.status(200).json({ userId });
//   } catch (error: any) {
//     console.error('Error in getCandidateUserId:', error);
//     res.status(500).json({ message: 'Failed to retrieve userId', error: error.message });
//   }
// };

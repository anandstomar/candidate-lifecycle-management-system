// src/routes/candidateRoutes.ts
import { Router } from 'express';
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  getMyCandidate,
  deleteCandidate,
  getCandidateUserId // Make sure this is imported if you want to use it
} from '../controllers/detailsController'; // Assuming detailsController is where your candidate functions are
import { authenticateUser } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadFileP'; // Assuming you have a file upload middleware

const router = Router();

// Specific routes should come before general dynamic routes
router.get('/getmyprofileId', authenticateUser, getMyCandidate); // Get my own candidate profile
router.get('/user-id', authenticateUser, getCandidateUserId); // Get userId from token

router.post(
  '/',
  authenticateUser,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]),
  createCandidate
);
// Create a new candidate profile
router.get('/', authenticateUser, getCandidates); // Get all candidates

// Dynamic routes (ensure they come after specific fixed paths)
router.get('/:id', authenticateUser, getCandidateById); // Get candidate by specific ID
router.put(
  '/:id',
  authenticateUser,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]),
  updateCandidate
); // Update candidate by specific ID
router.delete('/:id', authenticateUser, deleteCandidate); // Delete candidate by specific ID


export default router;
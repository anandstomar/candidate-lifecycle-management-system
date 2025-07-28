import express from 'express';
import { getAllMCQs, addMCQ, editMCQ, deleteMCQ, generateMCQs, getRoles, getDifficulties, getMCQsByGroup } from '../controllers/mcqController.js';
// import { authenticate, authorize } from '../middleware/authMiddlewares.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are admin-only
// router.use(authenticate);
router.use(authenticateUser);

router.get('/', getAllMCQs);
router.get('/roles', getRoles);
router.get('/difficulties', getDifficulties);
router.get('/group/:groupId', getMCQsByGroup);
router.post('/addMCQ', addMCQ);
router.post('/generate', generateMCQs);
router.patch('/:id', editMCQ);
router.delete('/:id', deleteMCQ);


export default router; 
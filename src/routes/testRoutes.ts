import { Router } from 'express';
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from '../controllers/testController';

import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();

router.post('/',authenticateUser, createQuestion);

router.get('/',authenticateUser, getQuestions);

router.get('/:id',authenticateUser, getQuestionById);

router.put('/:id',authenticateUser, updateQuestion);

router.delete('/:id',authenticateUser, deleteQuestion);

export default router;
// src/routes/authRoutes.ts
import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { login, register, logout, makePayment , verifyPayment  } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout',authenticateUser , logout);
router.post('/make-payment',authenticateUser , makePayment);
router.post('/verify-payment',authenticateUser , verifyPayment);

export default router;

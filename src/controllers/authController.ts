// src/controllers/authController.ts
import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();
import User, { IUser } from '../models/authModel';

const JWT_SECRET = process.env.JWT_SECRET || 'JobPortalUsers';

export const register = async (req: Request, res: Response) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hash(password, 10);

    // Create new user — status, resumeStatus, paymentStatus, hired default automatically
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        status: user.status,
        resumeStatus: user.resumeStatus,
        paymentStatus: user.paymentStatus,
        hired: user.hired
      },
      token,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    // Mark this user as Active
    await User.findByIdAndUpdate(
      user._id,
      { status: 'Active' },
      { new: true }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        status: 'Active',               // reflect the update
        resumeStatus: user.resumeStatus,
        paymentStatus: user.paymentStatus,
        hired: user.hired
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Error during login', error: err.message });
  }
};



export const logout = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    // Mark Inactive
    await User.findByIdAndUpdate(
      { userId },
      { status: 'Inactive' }
    );
    res.json({ message: 'Logged out successfully' });
  } catch (err: any) {
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID! || 'rzp_test_PBUluwX3e15zwd',
  key_secret: process.env.RAZORPAY_KEY_SECRET! || 'v1Ukx0iR5Tid2ABmFh6m6Uowx',
});

type OrdersCreateParams = Parameters<Razorpay['orders']['create']>[0];

interface MakePaymentBody {
  amount: number;
  currency?: string;
  receipt?: string;
}

export const makePayment = async (
  req: Request<{}, {}, MakePaymentBody>,
  res: Response
) => {
  const { amount, currency = 'INR', receipt } = req.body;

  if (amount == null || isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid or missing amount' });
  }

  try {
    const options: OrdersCreateParams = {
      amount:          Math.round(amount * 100),  // paise
      currency,
      receipt:         receipt ?? `rcpt_${Date.now()}`,
      payment_capture: true,
    };
    console.log('💳 Creating Razorpay order with options:', options);

    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created:', order);

    res.status(200).json(order);
  } catch (err: any) {
    console.error('❌ /make-payment error:', err);
    res.status(500).json({
      error:       err.message,
      ...(err.code        && { code: err.code }),
      ...(err.description && { description: err.description }),
    });
  }
};

import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils'; 

export const verifyPayment = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET!;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required verification fields' });
  }

  try {
    const isValid = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      secret
    );

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // ✅ Signature valid → update paymentStatus to "Paid"
    const userId = req.userId!; // set by authenticateUser
    const updated = await User.findByIdAndUpdate(
      { userId },
      { paymentStatus: 'Paid' },
      { new: true }
    );

    if (!updated) {
      // Maybe no dashboard yet? Handle as you see fit.
      return res.status(404).json({ error: 'Dashboard entry not found for this user' });
    }

    return res.status(200).json({
      message: 'Payment verified and status updated',
      dashboard: updated
    });

  } catch (err: any) {
    console.error('❌ /verify-payment error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


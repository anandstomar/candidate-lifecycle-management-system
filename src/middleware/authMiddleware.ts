// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/authModel'; // Assuming this path is correct

declare module 'express' {
  interface Request {
    user?: any;
    userId?: string; // userId is a string representation of the MongoDB ObjectId
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'JobPortalUsers';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    // Set req.userId from the decoded token's id
    req.userId = decoded.id;

    // Find the user by their _id
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }
    // Attach the user object to the request
    req.user = user;

    // IMPORTANT FIX: Update user status using _id, not 'userId'
    // This part should update the 'status' field of the found user.
    // If you always want to set to 'Active' on successful authentication:
    if (user.status !== 'Active') { // Only update if it's not already Active to avoid unnecessary write operations
        await User.findByIdAndUpdate(
            user._id, // Use _id to identify the document
            { status: 'Active' },
            { new: true } // Return the updated document if needed, though not used here
        );
        // If req.user needs to reflect the change immediately without refetching, update it:
        req.user.status = 'Active';
    }


    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Authentication error:", err); // Log the error for debugging
    res.status(401).json({ message: 'Token is not valid or other authentication error' });
  }
};





// import jwt from 'jsonwebtoken';
// // import User from '../models/User.js';

// export const authenticate = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   //If token not provided or not starting with Bearer
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ success: false, message: 'No token provided' });
//   }
//   //This will extract token from the header
//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { id, role }
//     next();
//   } catch (err) {
//     res.status(401).json({ success: false, message: 'Invalid token' });
//   }
// };

// // This middleware is used to authorize the user to access the resources
// export const authorize = (...roles) => (req, res, next) => {
//   if (!roles.includes(req.user.role)) {
//     return res.status(403).json({ success: false, message: 'Forbidden' });
//   }
//   next();
// };

// // This middleware is used to check if the user is the owner of the resume or an admin
// export const checkResumeOwnershipOrAdmin = (req, res, next) => {
//   // req.resume must be set before calling this middleware
//   if (req.user.role === 'admin' || req.resume.userId.toString() === req.user.id) {
//     return next();
//   }
//   return res.status(403).json({ success: false, message: 'Forbidden' });
// };
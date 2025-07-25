"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authModel_1 = __importDefault(require("../models/authModel"));
const JWT_SECRET = process.env.JWT_SECRET || 'JobPortalUsers';
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        const user = yield authModel_1.default.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid token or user not found' });
        }
        req.user = user;
        if (user.status !== 'Active') {
            yield authModel_1.default.findByIdAndUpdate(user._id, { status: 'Active' }, { new: true });
            req.user.status = 'Active';
        }
        next();
    }
    catch (err) {
        console.error("Authentication error:", err);
        res.status(401).json({ message: 'Token is not valid or other authentication error' });
    }
});
exports.authenticateUser = authenticateUser;

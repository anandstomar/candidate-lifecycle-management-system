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
exports.login = exports.register = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authModel_1 = __importDefault(require("../models/authModel"));
const adminModel_1 = __importDefault(require("../models/adminModel"));
const JWT_SECRET = process.env.JWT_SECRET || 'JobPortalUsers';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    try {
        const existingUser = yield authModel_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'User already exists' });
        const hashedPassword = yield (0, bcryptjs_1.hash)(password, 10);
        const user = yield authModel_1.default.create({ fullName, email, password: hashedPassword });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({
            message: 'Account created successfully',
            user: { id: user.id, fullName: user.fullName, email: user.email },
            token,
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield authModel_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = yield (0, bcryptjs_1.compare)(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        yield adminModel_1.default.findOneAndUpdate({ userId: user._id }, { status: 'Active' }, { upsert: true, setDefaultsOnInsert: true });
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, fullName: user.fullName, email: user.email },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error during login', error: err.message });
    }
});
exports.login = login;

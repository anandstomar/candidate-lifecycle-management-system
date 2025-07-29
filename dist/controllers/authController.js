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
exports.verifyPayment = exports.makePayment = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const razorpay_1 = __importDefault(require("razorpay"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authModel_1 = __importDefault(require("../models/authModel"));
const JWT_SECRET = process.env.JWT_SECRET || 'JobPortalUsers';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    try {
        const existingUser = yield authModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = yield (0, bcryptjs_1.hash)(password, 10);
        const user = yield authModel_1.default.create({
            fullName,
            email,
            password: hashedPassword
        });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
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
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = yield (0, bcryptjs_1.compare)(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        yield authModel_1.default.findByIdAndUpdate(user._id, { status: 'Active' }, { new: true });
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                status: 'Active',
                resumeStatus: user.resumeStatus,
                paymentStatus: user.paymentStatus,
                hired: user.hired
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error during login', error: err.message });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        yield authModel_1.default.findByIdAndUpdate(userId, { status: 'Inactive' });
        res.json({ message: 'Logged out successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Logout failed', error: err.message });
    }
});
exports.logout = logout;
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_PBUluwX3e15zwd',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'v1Ukx0iR5Tid2ABmFh6m6Uowx',
});
const makePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, currency = 'INR', receipt } = req.body;
    if (amount == null || isNaN(amount)) {
        return res.status(400).json({ error: 'Invalid or missing amount' });
    }
    try {
        const options = {
            amount: Math.round(amount * 100),
            currency,
            receipt: receipt !== null && receipt !== void 0 ? receipt : `rcpt_${Date.now()}`,
            payment_capture: true,
        };
        console.log('💳 Creating Razorpay order with options:', options);
        const order = yield razorpay.orders.create(options);
        console.log('✅ Razorpay order created:', order);
        res.status(200).json(order);
    }
    catch (err) {
        console.error('❌ /make-payment error:', err);
        res.status(500).json(Object.assign(Object.assign({ error: err.message }, (err.code && { code: err.code })), (err.description && { description: err.description })));
    }
});
exports.makePayment = makePayment;
const razorpay_utils_1 = require("razorpay/dist/utils/razorpay-utils");
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Missing required verification fields' });
    }
    try {
        const isValid = (0, razorpay_utils_1.validatePaymentVerification)({ order_id: razorpay_order_id, payment_id: razorpay_payment_id }, razorpay_signature, secret);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid signature' });
        }
        const userId = req.userId;
        const updated = yield authModel_1.default.findByIdAndUpdate(userId, { paymentStatus: 'Paid' }, { new: true });
        if (!updated) {
            return res.status(404).json({ error: 'Dashboard entry not found for this user' });
        }
        return res.status(200).json({
            message: 'Payment verified and status updated',
            dashboard: updated
        });
    }
    catch (err) {
        console.error('❌ /verify-payment error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.verifyPayment = verifyPayment;

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
exports.verifyPayment = exports.makePayment = exports.logout = exports.deleteAdminDashboard = exports.updateAdminDashboard = exports.getAdminDashboardById = exports.getAdminDashboards = exports.createAdminDashboard = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const razorpay_1 = __importDefault(require("razorpay"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const adminModel_1 = __importDefault(require("../models/adminModel"));
const createAdminDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        if (data.desirableJob && !mongoose_1.default.Types.ObjectId.isValid(data.desirableJob.toString())) {
            return res.status(400).json({ message: 'Invalid desirableJob ID' });
        }
        if (data.testScore && !mongoose_1.default.Types.ObjectId.isValid(data.testScore.toString())) {
            return res.status(400).json({ message: 'Invalid testScore ID' });
        }
        const dashboard = new adminModel_1.default(data);
        yield dashboard.save();
        res.status(201).json({ message: 'Admin dashboard entry created', dashboard });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating dashboard entry', error: error.message });
    }
});
exports.createAdminDashboard = createAdminDashboard;
const getAdminDashboards = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dashboards = yield adminModel_1.default.find()
            .populate('userId', 'fullName email')
            .populate('fullName', 'fullName')
            .populate('email', 'email')
            .populate('desirableJob', 'desirableJob')
            .populate('testScore', 'title points')
            .populate('experience', 'experience')
            .populate('profileCompletion', 'profileCompletion')
            .exec();
        res.json({ count: dashboards.length, dashboards });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard entries', error: error.message });
    }
});
exports.getAdminDashboards = getAdminDashboards;
const getAdminDashboardById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const dashboard = yield adminModel_1.default.findById(id)
            .populate('userId', 'fullName email')
            .populate('fullName', 'fullName')
            .populate('email', 'email')
            .populate('desirableJob', 'desirableJob')
            .populate('testScore', 'title points')
            .populate('experience', 'experience')
            .populate('profileCompletion', 'profileCompletion')
            .exec();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard entry not found' });
        }
        res.json(dashboard);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard entry', error: error.message });
    }
});
exports.getAdminDashboardById = getAdminDashboardById;
;
const updateAdminDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (updates.status && !['Active', 'Inactive'].includes(updates.status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        if (updates.resumeStatus && !['Created', 'Not Created'].includes(updates.resumeStatus)) {
            return res.status(400).json({ message: 'Invalid resumeStatus value' });
        }
        if (updates.paymentStatus && !['Paid', 'Pending', 'Failed'].includes(updates.paymentStatus)) {
            return res.status(400).json({ message: 'Invalid paymentStatus value' });
        }
        if (updates.hired && !['Yes', 'No'].includes(updates.hired)) {
            return res.status(400).json({ message: 'Invalid hired value' });
        }
        const dashboard = yield adminModel_1.default.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!dashboard)
            return res.status(404).json({ message: 'Dashboard entry not found' });
        res.json({ message: 'Dashboard entry updated', dashboard });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating dashboard entry', error: error.message });
    }
});
exports.updateAdminDashboard = updateAdminDashboard;
const deleteAdminDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const dashboard = yield adminModel_1.default.findByIdAndDelete(id);
        if (!dashboard)
            return res.status(404).json({ message: 'Dashboard entry not found' });
        res.json({ message: 'Dashboard entry deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting dashboard entry', error: error.message });
    }
});
exports.deleteAdminDashboard = deleteAdminDashboard;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        yield adminModel_1.default.findOneAndUpdate({ userId }, { status: 'Inactive' });
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
        const updated = yield adminModel_1.default.findOneAndUpdate({ userId }, { paymentStatus: 'Paid' }, { new: true });
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

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
exports.deleteAdminDashboard = exports.updateAdminDashboard = exports.getAdminDashboardById = exports.getAdminDashboards = exports.createAdminDashboard = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
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
            .populate('desirableJob', 'fullName email desirableJob')
            .populate('testScore', 'title points')
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
            .populate('desirableJob', 'fullName email desirableJob')
            .populate('testScore', 'title points')
            .exec();
        if (!dashboard)
            return res.status(404).json({ message: 'Dashboard entry not found' });
        res.json(dashboard);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard entry', error: error.message });
    }
});
exports.getAdminDashboardById = getAdminDashboardById;
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

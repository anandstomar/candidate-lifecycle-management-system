"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AdminDashboardSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    candidateId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
        unique: true,
    },
    testScore: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Question',
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    resumeStatus: {
        type: String,
        enum: ['Created', 'Not Created'],
        default: 'Not Created',
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Pending', 'Failed'],
        default: 'Pending',
    },
    hired: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('AdminDashboard', AdminDashboardSchema, 'AdminDashboard');

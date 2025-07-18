"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AdminDashboardSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        ref: 'User',
    },
    email: {
        type: String,
        required: true,
        ref: 'User',
    },
    desirableJob: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Candidate',
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
    experience: {
        type: Number,
        required: true,
        min: 0,
    },
    profileCompletion: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
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
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('AdminDashboard', AdminDashboardSchema, 'AdminDashboard');

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EducationSchema = new mongoose_1.Schema({
    degree: { type: String, required: true },
    college: { type: String, required: true },
    branch: { type: String },
    passingYear: { type: Number, required: true, min: 1900, max: new Date().getFullYear() },
    cgpa: { type: Number, required: true, min: 0, max: 10 },
}, { _id: false });
const CandidateSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true, ref: 'User' },
    email: { type: String, required: true, ref: 'User' },
    dob: { type: Date, required: true },
    phone: { type: String, required: true, unique: true },
    education: { type: [EducationSchema], required: true },
    skills: { type: [String], required: true },
    experience: { type: Number, required: true, min: 0 },
    desirableJob: { type: String, required: true },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Candidate', CandidateSchema, 'CandidateDetails');

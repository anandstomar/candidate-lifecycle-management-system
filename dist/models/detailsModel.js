"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EducationSchema = new mongoose_1.Schema({
    board10: { type: String, required: true },
    percentage10: { type: Number, required: true, min: 0, max: 100 },
    board12: { type: String, required: true },
    percentage12: { type: Number, required: true, min: 0, max: 100 },
    collegeDegree: { type: String, required: true },
    college: { type: String, required: true },
    branch: { type: String },
    passingYear: { type: Number, required: true },
    cgpa: { type: Number, required: true, min: 0, max: 10 },
}, { _id: false });
const CandidateSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true, ref: 'User' },
    email: { type: String, required: true, ref: 'User' },
    dob: { type: Date, required: true },
    phone: { type: String, required: true, unique: true },
    education: { type: EducationSchema, required: true },
    skills: { type: [String], required: true },
    experience: { type: Number, required: true, min: 0 },
    desirableJob: { type: String, required: true },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Candidate', CandidateSchema, 'CandidateDetails');

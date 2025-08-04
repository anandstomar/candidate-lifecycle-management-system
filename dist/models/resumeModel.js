"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ContactSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    location: { type: String },
    zipCode: { type: String },
    country: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    linkedIn: { type: String },
    github: { type: String },
    portfolioLink: { type: String },
    dob: { type: Date },
}, { _id: false });
const TenthSchema = new mongoose_1.Schema({
    school: { type: String, required: true },
    board: { type: String, required: true },
    startYear: { type: Number, required: true },
    passingYear: { type: Number, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
}, { _id: false });
const TwelfthOrDiplomaSchema = new mongoose_1.Schema({
    type: { type: String, enum: ['12th', 'Diploma'], required: true },
    board: { type: String },
    university: { type: String },
    institution: { type: String },
    startYear: { type: Number, required: true },
    passingYear: { type: Number, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
}, { _id: false });
const DegreeSchema = new mongoose_1.Schema({
    degree: { type: String, required: true },
    branch: { type: String },
    institution: { type: String, required: true },
    startYear: { type: Number, required: true },
    passingYear: { type: Number, required: true },
    cgpa: { type: Number, min: 0, max: 10 },
}, { _id: false });
const ExperienceSchema = new mongoose_1.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String },
}, { _id: false });
const ProjectSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    techStack: { type: [String], required: true },
    description: { type: String, required: true },
    link: { type: String },
}, { _id: false });
const CertificationSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    link: { type: String },
}, { _id: false });
const ResumeSchema = new mongoose_1.Schema({
    candidate: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Candidate', required: true, unique: true },
    contact: { type: ContactSchema, required: true },
    jobTitle: { type: String },
    languages: { type: [String] },
    education: {
        tenth: { type: TenthSchema, required: true },
        twelfthOrDiploma: { type: TwelfthOrDiplomaSchema },
        bachelors: { type: [DegreeSchema] },
        masters: { type: [DegreeSchema] },
    },
    experience: { type: [ExperienceSchema] },
    internships: { type: [ExperienceSchema] },
    projects: { type: [ProjectSchema] },
    certifications: { type: [CertificationSchema] },
    skills: { type: [String], required: true },
    interests: { type: [String] },
    resumeFile: { type: String },
    profileImage: { type: String },
    profileCompletion: { type: Number, min: 0, max: 100 },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Resume', ResumeSchema, 'Resumes');

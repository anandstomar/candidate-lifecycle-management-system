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
exports.getCandidateUserId = exports.getMyCandidate = exports.deleteCandidate = exports.updateCandidate = exports.getCandidateById = exports.getCandidates = exports.createCandidate = void 0;
const detailsModel_1 = __importDefault(require("../models/detailsModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const authModel_1 = __importDefault(require("../models/authModel"));
const safeParse = (value, fieldName, res) => {
    try {
        return JSON.parse(value);
    }
    catch (err) {
        res.status(400).json({ message: `Invalid JSON for ${fieldName}` });
        return null;
    }
};
const createCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIdStr = req.userId;
        const userId = new mongoose_1.default.Types.ObjectId(userIdStr);
        if (yield detailsModel_1.default.findOne({ userId })) {
            return res.status(400).json({ message: 'Candidate profile already exists.' });
        }
        const files = req.files;
        if (!files.profileImage || !files.resume) {
            return res.status(400).json({ message: 'Profile image and resume are required.' });
        }
        const data = req.body;
        const requiredFields = ['education', 'skills', 'experience', 'desirableJob'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return res.status(400).json({ message: `Missing field: ${field}` });
            }
        }
        const education = safeParse(data.education, 'education', res);
        if (!education)
            return;
        const skills = safeParse(data.skills, 'skills', res);
        if (!skills)
            return;
        const experience = safeParse(data.experience, 'experience', res);
        if (!experience)
            return;
        const desirableJob = safeParse(data.desirableJob, 'desirableJob', res);
        if (!desirableJob)
            return;
        const candidateData = {
            userId,
            fullName: data.fullName,
            email: data.email,
            dob: new Date(data.dob),
            contact: data.contact,
            address: data.address,
            education,
            skills,
            experience,
            desirableJob,
            profileCompletion: Number(data.profileCompletion) || 0,
            profileImage: files.profileImage[0].path,
            resume: files.resume[0].path,
        };
        const candidate = new detailsModel_1.default(candidateData);
        const saved = yield candidate.save();
        yield authModel_1.default.findByIdAndUpdate(userId, { resumeStatus: 'Created' });
        res.status(201).json({ message: 'Candidate created', candidate: saved });
    }
    catch (err) {
        console.error('Error creating candidate:', err);
        res.status(500).json({ message: 'Error creating candidate', error: err.message });
    }
});
exports.createCandidate = createCandidate;
const getCandidates = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidates = yield detailsModel_1.default.find();
        res.json({ count: candidates.length, candidates });
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching candidates', error: err.message });
    }
});
exports.getCandidates = getCandidates;
const getCandidateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const candidate = yield detailsModel_1.default.findById(id);
        if (!candidate)
            return res.status(404).json({ message: 'Candidate not found.' });
        res.json(candidate);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching candidate', error: err.message });
    }
});
exports.getCandidateById = getCandidateById;
const updateCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const files = req.files;
        const updates = Object.assign({}, req.body);
        if (updates.education)
            updates.education = JSON.parse(updates.education);
        if (updates.skills)
            updates.skills = JSON.parse(updates.skills);
        if (updates.experience)
            updates.experience = JSON.parse(updates.experience);
        if (updates.desirableJob)
            updates.desirableJob = JSON.parse(updates.desirableJob);
        if (files.profileImage)
            updates.profileImage = files.profileImage[0].path;
        if (files.resume)
            updates.resume = files.resume[0].path;
        const candidate = yield detailsModel_1.default.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!candidate)
            return res.status(404).json({ message: 'Candidate not found.' });
        res.json({ message: 'Candidate updated', candidate });
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating candidate', error: err.message });
    }
});
exports.updateCandidate = updateCandidate;
const deleteCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const candidate = yield detailsModel_1.default.findByIdAndDelete(id);
        if (!candidate)
            return res.status(404).json({ message: 'Candidate not found.' });
        res.json({ message: 'Candidate deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting candidate', error: err.message });
    }
});
exports.deleteCandidate = deleteCandidate;
const getMyCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const candidate = yield detailsModel_1.default.findOne({ userId });
        if (!candidate)
            return res.status(404).json({ message: 'Candidate not found.' });
        res.json(candidate);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching profile', error: err.message });
    }
});
exports.getMyCandidate = getMyCandidate;
const getCandidateUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ message: 'Authentication required.' });
        res.json({ userId });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to retrieve userId', error: err.message });
    }
});
exports.getCandidateUserId = getCandidateUserId;

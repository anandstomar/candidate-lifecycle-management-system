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
const authModel_1 = __importDefault(require("../models/authModel"));
const createCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const candidateData = Object.assign(Object.assign({}, req.body), { userId: userId });
        const existingCandidate = yield detailsModel_1.default.findOne({ userId });
        if (existingCandidate) {
            return res.status(400).json({ message: 'Candidate profile already exists for this user.' });
        }
        const candidate = new detailsModel_1.default(candidateData);
        yield candidate.save();
        yield authModel_1.default.findByIdAndUpdate(userId, { resumeStatus: 'Created' }, { new: true });
        res.status(201).json({ message: 'Candidate created', candidate });
    }
    catch (error) {
        console.error("Error creating candidate:", error);
        res.status(500).json({ message: 'Error creating candidate', error: error.message });
    }
});
exports.createCandidate = createCandidate;
const getCandidates = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const candidates = yield detailsModel_1.default.find();
        res.json({ count: candidates.length, candidates });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching candidates', error: error.message });
    }
});
exports.getCandidates = getCandidates;
const getCandidateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const candidate = yield detailsModel_1.default.findById(id);
        if (!candidate)
            return res.status(404).json({ message: 'Candidate not found' });
        res.json(candidate);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching candidate', error: error.message });
    }
});
exports.getCandidateById = getCandidateById;
const updateCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const candidate = yield detailsModel_1.default.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!candidate)
            return res.status(404).json({ message: 'Candidate not found' });
        res.json({ message: 'Candidate updated', candidate });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating candidate', error: error.message });
    }
});
exports.updateCandidate = updateCandidate;
const deleteCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const candidate = yield detailsModel_1.default.findByIdAndDelete(id);
        if (!candidate)
            return res.status(404).json({ message: 'Candidate not found' });
        res.json({ message: 'Candidate deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting candidate', error: error.message });
    }
});
exports.deleteCandidate = deleteCandidate;
const getMyCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        console.log('Fetching candidate for userId:', userId);
        const candidate = yield detailsModel_1.default.findOne({ userId });
        if (!candidate)
            return res.status(404).json({ message: 'Candidate not found' });
        res.json(candidate);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching candidate profile', error: error.message });
    }
});
exports.getMyCandidate = getMyCandidate;
const getCandidateUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.userId, 'User ID from request');
        const userId = req.userId;
        console.log('User ID from request:', userId);
        if (!userId) {
            return res.status(401).json({ message: 'User ID not found in request. Authentication middleware might be missing or failed.' });
        }
        res.status(200).json({ userId });
    }
    catch (error) {
        console.error('Error in getCandidateUserId:', error);
        res.status(500).json({ message: 'Failed to retrieve userId', error: error.message });
    }
});
exports.getCandidateUserId = getCandidateUserId;

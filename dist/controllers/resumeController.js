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
exports.deleteResume = exports.updateResume = exports.getResumeById = exports.getUserResumes = exports.createResume = void 0;
const mongoose_1 = require("mongoose");
const resumeModel_1 = __importDefault(require("../models/resumeModel"));
const createResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = Object.assign({ candidate: new mongoose_1.Types.ObjectId(req.userId) }, req.body);
        const newResume = yield resumeModel_1.default.create(payload);
        res.status(201).json(newResume);
    }
    catch (error) {
        console.error('createResume error:', error);
        res
            .status(500)
            .json({ message: 'Failed to create resume', error: error.message });
    }
});
exports.createResume = createResume;
const getUserResumes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resumes = yield resumeModel_1.default.find({ candidate: req.userId }).sort({ updatedAt: -1 });
        res.json(resumes);
    }
    catch (error) {
        console.error('getUserResumes error:', error);
        res
            .status(500)
            .json({ message: 'Failed to get resumes', error: error.message });
    }
});
exports.getUserResumes = getUserResumes;
const getResumeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid resume ID' });
            return;
        }
        const resume = yield resumeModel_1.default.findOne({
            _id: new mongoose_1.Types.ObjectId(id),
            candidate: req.userId,
        });
        if (!resume) {
            res.status(404).json({ message: 'Resume not found' });
            return;
        }
        res.json(resume);
    }
    catch (error) {
        console.error('getResumeById error:', error);
        res
            .status(500)
            .json({ message: 'Failed to get resume', error: error.message });
    }
});
exports.getResumeById = getResumeById;
const updateResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid resume ID' });
            return;
        }
        const resume = yield resumeModel_1.default.findOne({
            _id: new mongoose_1.Types.ObjectId(id),
            candidate: req.userId,
        });
        if (!resume) {
            res.status(404).json({ message: 'Resume not found or unauthorized' });
            return;
        }
        Object.assign(resume, req.body);
        const updated = yield resume.save();
        res.json(updated);
    }
    catch (error) {
        console.error('updateResume error:', error);
        res
            .status(500)
            .json({ message: 'Failed to update resume', error: error.message });
    }
});
exports.updateResume = updateResume;
const deleteResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid resume ID' });
            return;
        }
        const deleted = yield resumeModel_1.default.findOneAndDelete({
            _id: new mongoose_1.Types.ObjectId(id),
            candidate: req.userId,
        });
        if (!deleted) {
            res.status(404).json({ message: 'Resume not found or unauthorized' });
            return;
        }
        res.json({ message: 'Resume deleted successfully' });
    }
    catch (error) {
        console.error('deleteResume error:', error);
        res
            .status(500)
            .json({ message: 'Failed to delete resume', error: error.message });
    }
});
exports.deleteResume = deleteResume;

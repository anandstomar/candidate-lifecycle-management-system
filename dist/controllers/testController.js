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
exports.deleteQuestion = exports.updateQuestion = exports.getQuestionById = exports.getQuestions = exports.createQuestion = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const testModel_1 = __importDefault(require("../models/testModel"));
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const existing = yield testModel_1.default.findOne({ userId });
        if (existing) {
            return res.status(400).json({ message: 'You have already created a question' });
        }
        const data = req.body;
        const question = new testModel_1.default(Object.assign({ userId }, data));
        yield question.save();
        res.status(201).json({ message: 'Question created', question });
    }
    catch (err) {
        res.status(500).json({ message: 'Error creating question', error: err.message });
    }
});
exports.createQuestion = createQuestion;
const getQuestions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield testModel_1.default.find()
            .populate('userId', 'fullName email')
            .exec();
        res.json({ count: questions.length, questions });
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching questions', error: err.message });
    }
});
exports.getQuestions = getQuestions;
const getQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid question ID' });
        }
        const question = yield testModel_1.default.findById(id)
            .populate('userId', 'fullName email')
            .exec();
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching question', error: err.message });
    }
});
exports.getQuestionById = getQuestionById;
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid question ID' });
        }
        const existing = yield testModel_1.default.findOne({ _id: id, userId: req.userId });
        if (!existing) {
            return res.status(403).json({ message: 'Not authorized to update this question' });
        }
        const updates = req.body;
        const question = yield testModel_1.default.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ message: 'Question updated', question });
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating question', error: err.message });
    }
});
exports.updateQuestion = updateQuestion;
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid question ID' });
        }
        const existing = yield testModel_1.default.findOne({ _id: id, userId: req.userId });
        if (!existing) {
            return res.status(403).json({ message: 'Not authorized to delete this question' });
        }
        yield testModel_1.default.findByIdAndDelete(id);
        res.json({ message: 'Question deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting question', error: err.message });
    }
});
exports.deleteQuestion = deleteQuestion;

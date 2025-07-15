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
const testModel_1 = __importDefault(require("../models/testModel"));
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const question = new testModel_1.default(data);
        yield question.save();
        res.status(201).json({ message: 'Question created', question });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating question', error: error.message });
    }
});
exports.createQuestion = createQuestion;
const getQuestions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield testModel_1.default.find();
        res.json({ count: questions.length, questions });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
});
exports.getQuestions = getQuestions;
const getQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const question = yield testModel_1.default.findById(id);
        if (!question)
            return res.status(404).json({ message: 'Question not found' });
        res.json(question);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching question', error: error.message });
    }
});
exports.getQuestionById = getQuestionById;
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updates = req.body;
        const question = yield testModel_1.default.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!question)
            return res.status(404).json({ message: 'Question not found' });
        res.json({ message: 'Question updated', question });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating question', error: error.message });
    }
});
exports.updateQuestion = updateQuestion;
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const question = yield testModel_1.default.findByIdAndDelete(id);
        if (!question)
            return res.status(404).json({ message: 'Question not found' });
        res.json({ message: 'Question deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting question', error: error.message });
    }
});
exports.deleteQuestion = deleteQuestion;

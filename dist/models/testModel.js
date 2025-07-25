"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OptionSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
}, { _id: false });
const QuestionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    duration: { type: Number, required: true },
    question: { type: String, required: true },
    options: { type: [OptionSchema], required: true },
    points: { type: Number, required: true, min: 0 },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Question', QuestionSchema);

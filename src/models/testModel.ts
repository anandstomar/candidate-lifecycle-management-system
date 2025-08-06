// src/models/questionModel.ts
import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuestion extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;    
  question: string;
  options: IOption[];
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const OptionSchema = new Schema<IOption>(
  {
    text:      { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const QuestionSchema = new Schema<IQuestion>(
  {
    userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    title:      { type: String, required: true },
    category:   { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    duration:   { type: Number, required: true },
    question:   { type: String, required: true },
    options:    { type: [OptionSchema], required: true },
    points:     { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default model<IQuestion>('Question', QuestionSchema);

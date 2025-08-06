// src/controllers/questionController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Question, { IQuestion } from '../models/testModel';

/**
 * POST /api/questions
 * Create a new question tied to the logged-in user
 */
export const createQuestion = async (req: Request, res: Response) => {
  try {
    // Extract the userId set by your authenticateUser middleware
    const userId = req.userId!;
    
    // Prevent a user from creating more than one question (given unique: true)
    const existing = await Question.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: 'You have already created a question' });
    }

    // Build the question document
    const data = req.body as Omit<Partial<IQuestion>, 'userId'>;
    const question = new Question({
      userId,
      ...data
    });

    await question.save();
    res.status(201).json({ message: 'Question created', question });
  } catch (err: any) {
    res.status(500).json({ message: 'Error creating question', error: err.message });
  }
};

/**
 * GET /api/questions
 * List all questions, including who created them
 */
export const getQuestions = async (_req: Request, res: Response) => {
  try {
    const questions = await Question.find()
      .populate('userId', 'fullName email')  // bring in author info
      .exec();

    res.json({ count: questions.length, questions });
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching questions', error: err.message });
  }
};

/**
 * GET /api/questions/:id
 * Fetch a single question by its Mongo _id
 */
export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }

    const question = await Question.findById(id)
      .populate('userId', 'fullName email')
      .exec();

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching question', error: err.message });
  }
};

/**
 * PUT /api/questions/:id
 * Update an existing question (fields only, not userId)
 */
export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }

    // Only allow the owner to update
    const existing = await Question.findOne({ _id: id, userId: req.userId });
    if (!existing) {
      return res.status(403).json({ message: 'Not authorized to update this question' });
    }

    const updates = req.body as Partial<Omit<IQuestion, 'userId'>>;
    const question = await Question.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question updated', question });
  } catch (err: any) {
    res.status(500).json({ message: 'Error updating question', error: err.message });
  }
};

/**
 * DELETE /api/questions/:id
 * Delete a question (only by its owner)
 */
export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }

    const existing = await Question.findOne({ _id: id, userId: req.userId });
    if (!existing) {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }

    await Question.findByIdAndDelete(id);
    res.json({ message: 'Question deleted' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error deleting question', error: err.message });
  }
};

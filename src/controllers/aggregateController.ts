import { Request, Response } from 'express';
import User, { IUser } from '../models/authModel';
import Candidate, { ICandidate } from '../models/detailsModel';
import Question, { IQuestion } from '../models/testModel';
import mongoose from 'mongoose';

/**
 * GET /api/aggregated-dashboard
 * Fetches aggregated dashboard data for all users.
 * Combines User, Candidate, and Question data using $lookup.
 */
export const getAggregatedDashboards = async (_req: Request, res: Response) => {
  try {
    const dashboards = await User.aggregate([
      // Stage 1: Lookup Candidate details for each user
      {
        $lookup: {
          from: 'CandidateDetails', // The collection name for Candidate model
          localField: '_id',
          foreignField: 'userId',
          as: 'candidateInfo',
        },
      },
      // Stage 2: Lookup Question details (assuming testScore is a Question ID)
      {
        $lookup: {
          from: 'questions', // The collection name for Question model
          localField: '_id', // Link from User ID
          foreignField: 'userId', // to userId in Question
          as: 'testScoreInfo',
        },
      },
      // Stage 3: Project the fields into the desired output format
      {
        $project: {
          _id: '$_id', // Keep the user's _id as the main dashboard _id
          userId: {
            _id: '$_id',
            fullName: '$fullName',
            email: '$email',
          },
          // Populate candidateId with the first element of candidateInfo array (the full document)
          candidateId: {
            $cond: {
              if: { $ne: [{ $size: '$candidateInfo' }, 0] },
              then: { $arrayElemAt: ['$candidateInfo', 0] }, // <-- Changed: Take the whole object
              else: '$$REMOVE',
            },
          },
          // Populate testScore with the first element of testScoreInfo array (the full document)
          testScore: {
            $cond: {
              if: { $ne: [{ $size: '$testScoreInfo' }, 0] },
              then: { $arrayElemAt: ['$testScoreInfo', 0] }, // <-- Changed: Take the whole object
              else: '$$REMOVE',
            },
          },
          status: '$status',
          resumeStatus: '$resumeStatus',
          paymentStatus: '$paymentStatus',
          hired: '$hired',
          createdAt: '$createdAt',
          updatedAt: '$updatedAt',
          __v: '$__v',
        },
      },
    ]);

    res.status(200).json({ count: dashboards.length, dashboards: dashboards });
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching aggregated dashboard data', error: err.message });
  }
};

/**
 * GET /api/aggregated-dashboard/my
 * Fetches aggregated dashboard data for the logged-in user.
 */
export const getMyAggregatedDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!; // Assuming userId is available from authentication middleware

    const dashboard = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) }, // Match the specific user
      },
      {
        $lookup: {
          from: 'CandidateDetails',
          localField: '_id',
          foreignField: 'userId',
          as: 'candidateInfo',
        },
      },
      {
        $lookup: {
          from: 'questions',
          localField: '_id',
          foreignField: 'userId',
          as: 'testScoreInfo',
        },
      },
      {
        $project: {
          _id: '$_id',
          userId: {
            _id: '$_id',
            fullName: '$fullName',
            email: '$email',
          },
          candidateId: {
            $cond: {
              if: { $ne: [{ $size: '$candidateInfo' }, 0] },
              then: { $arrayElemAt: ['$candidateInfo', 0] }, // <-- Changed: Take the whole object
              else: '$$REMOVE',
            },
          },
          testScore: {
            $cond: {
              if: { $ne: [{ $size: '$testScoreInfo' }, 0] },
              then: { $arrayElemAt: ['$testScoreInfo', 0] }, // <-- Changed: Take the whole object
              else: '$$REMOVE',
            },
          },
          status: '$status',
          resumeStatus: '$resumeStatus',
          paymentStatus: '$paymentStatus',
          hired: '$hired',
          createdAt: '$createdAt',
          updatedAt: '$updatedAt',
          __v: '$__v',
        },
      },
    ]);

    if (dashboard.length === 0) {
      return res.status(404).json({ message: 'Dashboard entry not found for this user.' });
    }

    res.status(200).json(dashboard[0]);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching aggregated dashboard data for user', error: err.message });
  }
};
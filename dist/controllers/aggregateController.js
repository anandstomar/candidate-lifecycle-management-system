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
exports.getMyAggregatedDashboard = exports.getAggregatedDashboards = void 0;
const authModel_1 = __importDefault(require("../models/authModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const getAggregatedDashboards = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dashboards = yield authModel_1.default.aggregate([
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
                            then: { $arrayElemAt: ['$candidateInfo', 0] },
                            else: '$$REMOVE',
                        },
                    },
                    testScore: {
                        $cond: {
                            if: { $ne: [{ $size: '$testScoreInfo' }, 0] },
                            then: { $arrayElemAt: ['$testScoreInfo', 0] },
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
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching aggregated dashboard data', error: err.message });
    }
});
exports.getAggregatedDashboards = getAggregatedDashboards;
const getMyAggregatedDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const dashboard = yield authModel_1.default.aggregate([
            {
                $match: { _id: new mongoose_1.default.Types.ObjectId(userId) },
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
                            then: { $arrayElemAt: ['$candidateInfo', 0] },
                            else: '$$REMOVE',
                        },
                    },
                    testScore: {
                        $cond: {
                            if: { $ne: [{ $size: '$testScoreInfo' }, 0] },
                            then: { $arrayElemAt: ['$testScoreInfo', 0] },
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
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching aggregated dashboard data for user', error: err.message });
    }
});
exports.getMyAggregatedDashboard = getMyAggregatedDashboard;

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
exports.uploadResumeAssets = void 0;
const mongoose_1 = require("mongoose");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const resumeModel_1 = __importDefault(require("../models/resumeModel"));
const uploadResumeAssets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const resumeId = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({ message: 'Invalid resume ID' });
        }
        const resume = yield resumeModel_1.default.findOne({
            _id: new mongoose_1.Types.ObjectId(resumeId),
            candidate: new mongoose_1.Types.ObjectId(req.userId),
        });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found or unauthorized' });
        }
        const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const profileFile = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.profileImage) === null || _b === void 0 ? void 0 : _b[0];
        if (profileFile) {
            if (resume.profileImage) {
                const oldPath = path_1.default.join(uploadsDir, path_1.default.basename(resume.profileImage));
                if (fs_1.default.existsSync(oldPath))
                    fs_1.default.unlinkSync(oldPath);
            }
            resume.profileImage = `${baseUrl}/uploads/${profileFile.filename}`;
        }
        const resumeFile = (_d = (_c = req.files) === null || _c === void 0 ? void 0 : _c.resumeFile) === null || _d === void 0 ? void 0 : _d[0];
        if (resumeFile) {
            if (resume.resumeFile) {
                const oldPath = path_1.default.join(uploadsDir, path_1.default.basename(resume.resumeFile));
                if (fs_1.default.existsSync(oldPath))
                    fs_1.default.unlinkSync(oldPath);
            }
            resume.resumeFile = `${baseUrl}/uploads/${resumeFile.filename}`;
        }
        yield resume.save();
        return res.status(200).json({
            message: 'Files uploaded successfully',
            profileImage: resume.profileImage,
            resumeFile: resume.resumeFile,
        });
    }
    catch (err) {
        console.error('uploadResumeAssets error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.uploadResumeAssets = uploadResumeAssets;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFiles = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
['images', 'resumes', 'others'].forEach(dir => {
    const full = path_1.default.join(__dirname, '../uploads', dir);
    if (!fs_1.default.existsSync(full))
        fs_1.default.mkdirSync(full, { recursive: true });
});
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.fieldname === 'profileImage'
            ? 'images' : file.fieldname === 'resume' ? 'resumes' : 'others';
        cb(null, path_1.default.join(__dirname, '../uploads', folder));
    },
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${file.fieldname}-${unique}${path_1.default.extname(file.originalname)}`);
    }
});
const fileFilter = (_req, file, cb) => {
    const { fieldname, mimetype } = file;
    if (fieldname === 'profileImage') {
        if (['image/jpeg', 'image/png', 'image/jpg'].includes(mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Profile image must be JPEG or PNG'), false);
        }
    }
    else if (fieldname === 'resumeFile') {
        if (mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Resume file must be a PDF'), false);
        }
    }
    else {
        cb(new Error(`Unexpected field: ${fieldname}`), false);
    }
};
exports.uploadFiles = (0, multer_1.default)({ storage, fileFilter }).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'resumeFile', maxCount: 1 },
]);

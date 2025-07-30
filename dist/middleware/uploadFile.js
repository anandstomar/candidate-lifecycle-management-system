"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
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
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    if (file.fieldname === 'profileImage' && ['.png', '.jpg', '.jpeg', '.gif'].includes(ext))
        cb(null, true);
    else if (file.fieldname === 'resume' && ext === '.pdf')
        cb(null, true);
    else
        cb(new Error(`Invalid file type for ${file.fieldname}`));
};
exports.upload = (0, multer_1.default)({ storage, fileFilter });

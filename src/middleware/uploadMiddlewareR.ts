// middleware/uploadMiddleware.ts
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';

['images', 'resumes', 'others'].forEach(dir => {
  const full = path.join(__dirname, '../uploads', dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'profileImage'
      ? 'images' : file.fieldname === 'resume' ? 'resumes' : 'others';
    cb(null, path.join(__dirname, '../uploads', folder));
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const { fieldname, mimetype } = file;

  if (fieldname === 'profileImage') {
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(mimetype)) {
      cb(null, true);
    } else {
      // Use a type assertion here
      cb(new Error('Profile image must be JPEG or PNG') as any, false);
    }
  } else if (fieldname === 'resumeFile') {
    if (mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      // Use a type assertion here
      cb(new Error('Resume file must be a PDF') as any, false);
    }
  } else {
    // Use a type assertion here
    cb(new Error(`Unexpected field: ${fieldname}`) as any, false);
  }
};

export const uploadFiles = multer({ storage, fileFilter }).fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resumeFile', maxCount: 1 },
]);
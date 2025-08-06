import multer from 'multer';
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

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.fieldname === 'profileImage' && ['.png','.jpg','.jpeg','.gif'].includes(ext)) cb(null, true);
  else if (file.fieldname === 'resume' && ext === '.pdf') cb(null, true);
  else cb(new Error(`Invalid file type for ${file.fieldname}`));
};

export const upload = multer({ storage, fileFilter });
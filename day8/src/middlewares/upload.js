import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads/originals';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error('File không hợp lệ')); 
  }
}
export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
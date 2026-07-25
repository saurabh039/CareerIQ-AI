import multer from "multer";
import fs from "fs";
import path from "path";

import {
  MAX_RESUME_SIZE,
  ALLOWED_RESUME_TYPES,
  RESUME_UPLOAD_PATH,
} from "../config/upload.config.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.userId || req.user.id || req.user._id;

    const uploadDir = path.join(
      process.cwd(),
      RESUME_UPLOAD_PATH,
      userId
    );

    fs.mkdirSync(uploadDir, { recursive: true });

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    cb(null, `resume-${Date.now()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_RESUME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"), false);
  }
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_RESUME_SIZE,
  },
});

export default uploadResume;
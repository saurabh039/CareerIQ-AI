import express from "express";

import authenticate from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";
import uploadResumeMiddleware from "../middleware/upload.middleware.js";

import {
  uploadResumeValidator,
} from "../validators/resume.validator.js";

import {
  uploadResume,
  getUserResumes,
  getResumeById,
  deleteResume,
} from "../controllers/resume.controller.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/upload",
  uploadResumeMiddleware.single("resume"),
  uploadResumeValidator,
  validate,
  uploadResume
);

router.get("/", getUserResumes);

router.get("/:id", getResumeById);

router.delete("/:id", deleteResume);

export default router;
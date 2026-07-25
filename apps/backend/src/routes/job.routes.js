import express from "express";

import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";

import validate from "../middleware/validation.middleware.js";

import {
  createJobValidator,
  updateJobValidator,
} from "../validators/job.validator.js";

const router = express.Router();

// Create Job
router.post(
  "/",
  createJobValidator,
  validate,
  createJob
);

// Get All Jobs
router.get("/", getAllJobs);

// Get Job By ID
router.get("/:id", getJobById);

// Update Job
router.put(
  "/:id",
  updateJobValidator,
  validate,
  updateJob
);

// Delete Job
router.delete("/:id", deleteJob);

export default router;
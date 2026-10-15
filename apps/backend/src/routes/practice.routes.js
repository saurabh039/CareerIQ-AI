import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";
import {
  startSessionValidator,
  submitSessionValidator,
} from "../validators/practice.validator.js";
import {
  getCategories,
  startSession,
  getSession,
  submitSession,
  getHistory,
  getPerformance,
} from "../controllers/practice.controller.js";

const router = express.Router();

// All practice endpoints require authentication
router.use(authenticate);

// Get available categories and statistics
router.get("/categories", getCategories);

// Start a new practice session (returns sanitized questions)
router.post("/sessions", startSessionValidator, validate, startSession);

// Get a specific session by ID
router.get("/sessions/:id", getSession);

// Submit answers for a practice session and receive score
router.post(
  "/sessions/:id/submit",
  submitSessionValidator,
  validate,
  submitSession
);

// Get user practice history (paginated)
router.get("/history", getHistory);

// Get aggregate user performance analytics
router.get("/performance", getPerformance);

export default router;

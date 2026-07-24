import express from "express";

import { register, login } from "../controllers/auth.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

import validate from "../middleware/validation.middleware.js";

import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  validate,
  register
);

router.post(
  "/login",
  loginValidator,
  validate,
  login
);

router.get("/profile", authenticate, (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

router.post("/logout", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;
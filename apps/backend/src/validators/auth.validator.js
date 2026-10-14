import { body } from "express-validator";

export const registerValidator = [
  body("fullName").optional().trim(),

  body("email").isEmail().withMessage("Invalid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidator = [
  body("email").isEmail(),

  body("password").notEmpty(),
];
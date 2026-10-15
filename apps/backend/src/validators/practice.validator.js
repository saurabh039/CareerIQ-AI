import { body, param } from "express-validator";

export const startSessionValidator = [
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["aptitude", "technical", "hr", "mixed"])
    .withMessage("Category must be one of: aptitude, technical, hr, mixed"),

  body("difficulty")
    .optional()
    .isIn(["easy", "medium", "hard", "mixed"])
    .withMessage("Difficulty must be one of: easy, medium, hard, mixed"),

  body("questionCount")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Question count must be between 1 and 20"),

  body("role").optional().isString().trim(),
];

export const submitSessionValidator = [
  param("id").isMongoId().withMessage("Valid session ID is required"),

  body("answers")
    .isArray()
    .withMessage("Answers must be an array of question responses"),

  body("answers.*.questionId")
    .notEmpty()
    .withMessage("Each answer must specify a questionId"),

  body("answers.*.selectedOption")
    .optional()
    .isString()
    .withMessage("Selected option must be a string"),
];

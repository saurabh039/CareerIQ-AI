import { body } from "express-validator";

export const createJobValidator = [
  body("title")
    .notEmpty()
    .withMessage("Job title is required"),

  body("company")
    .notEmpty()
    .withMessage("Company name is required"),

  body("location")
    .notEmpty()
    .withMessage("Location is required"),

  body("sourceUrl")
    .isURL()
    .withMessage("Valid source URL is required"),

  body("employmentType")
    .optional()
    .isIn([
      "Full-time",
      "Part-time",
      "Internship",
      "Contract",
      "Remote",
      "Hybrid",
      "On-site",
    ])
    .withMessage("Invalid employment type"),
];

export const updateJobValidator = [
  body("title").optional().notEmpty(),

  body("company").optional().notEmpty(),

  body("location").optional().notEmpty(),

  body("sourceUrl").optional().isURL(),
];
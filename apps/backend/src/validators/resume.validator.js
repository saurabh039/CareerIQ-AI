 
import { body } from "express-validator";

export const uploadResumeValidator = [
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

export const updateResumeStatusValidator = [
  body("status")
    .optional()
    .isIn(["UPLOADED", "PARSING", "PARSED", "FAILED"])
    .withMessage("Invalid resume status"),
];
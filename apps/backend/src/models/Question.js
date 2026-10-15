import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["aptitude", "technical", "hr"],
      lowercase: true,
      index: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
      default: "medium",
      lowercase: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["mcq"],
      default: "mcq",
    },
    options: {
      type: [optionSchema],
      required: true,
      validate: [
        (val) => Array.isArray(val) && val.length >= 2,
        "A question must provide at least two options",
      ],
    },
    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },
    explanation: {
      type: String,
      default: "",
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    topics: {
      type: [String],
      default: [],
      index: true,
    },
    role: {
      type: String,
      default: "general",
      trim: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ category: 1, isActive: 1 });
questionSchema.index({ role: 1, category: 1 });

export default mongoose.model("Question", questionSchema);

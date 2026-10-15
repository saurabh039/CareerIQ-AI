import mongoose from "mongoose";

const practiceSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["aptitude", "technical", "hr", "mixed"],
      lowercase: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "mixed"],
      default: "medium",
      lowercase: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
    totalQuestions: {
      type: Number,
      required: true,
      default: 5,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
      index: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    totalPossibleScore: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

practiceSessionSchema.index({ userId: 1, createdAt: -1 });
practiceSessionSchema.index({ userId: 1, status: 1 });

export default mongoose.model("PracticeSession", practiceSessionSchema);

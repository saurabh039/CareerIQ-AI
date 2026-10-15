import mongoose from "mongoose";

const practiceAttemptSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PracticeSession",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },
    selectedOption: {
      type: String,
      default: "",
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
      default: false,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

practiceAttemptSchema.index({ sessionId: 1, questionId: 1 });
practiceAttemptSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("PracticeAttempt", practiceAttemptSchema);

import mongoose from "mongoose";

const categoryMetricSchema = new mongoose.Schema(
  {
    totalAnswered: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
  },
  { _id: false }
);

const skillMetricSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    totalAnswered: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
  },
  { _id: false }
);

const userPerformanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    totalSessions: {
      type: Number,
      default: 0,
    },
    totalQuestionsAnswered: {
      type: Number,
      default: 0,
    },
    totalCorrectAnswers: {
      type: Number,
      default: 0,
    },
    overallAccuracy: {
      type: Number,
      default: 0,
    },
    categoryStats: {
      aptitude: { type: categoryMetricSchema, default: () => ({}) },
      technical: { type: categoryMetricSchema, default: () => ({}) },
      hr: { type: categoryMetricSchema, default: () => ({}) },
    },
    skillStats: {
      type: [skillMetricSchema],
      default: [],
    },
    lastPracticedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("UserPerformance", userPerformanceSchema);

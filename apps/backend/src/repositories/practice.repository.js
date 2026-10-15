import Question from "../models/Question.js";
import PracticeSession from "../models/PracticeSession.js";
import PracticeAttempt from "../models/PracticeAttempt.js";
import UserPerformance from "../models/UserPerformance.js";

export const getCategoryStats = async () => {
  return await Question.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        difficulties: { $addToSet: "$difficulty" },
        skills: { $addToSet: "$skills" },
      },
    },
    {
      $project: {
        category: "$_id",
        count: 1,
        difficulties: 1,
        _id: 0,
      },
    },
  ]);
};

export const getRandomQuestions = async ({
  category,
  difficulty,
  count = 5,
  role,
}) => {
  const match = { isActive: true };

  if (category && category !== "mixed") {
    match.category = category.toLowerCase();
  }

  if (difficulty && difficulty !== "mixed") {
    match.difficulty = difficulty.toLowerCase();
  }

  if (role && role !== "general") {
    match.role = role;
  }

  // Use MongoDB aggregation $sample for random selection
  let questions = await Question.aggregate([
    { $match: match },
    { $sample: { size: Number(count) } },
  ]);

  // If specific difficulty didn't yield enough, relax difficulty constraint
  if (questions.length < count && difficulty && difficulty !== "mixed") {
    const fallbackMatch = { isActive: true };
    if (category && category !== "mixed") {
      fallbackMatch.category = category.toLowerCase();
    }
    const additional = await Question.aggregate([
      {
        $match: {
          ...fallbackMatch,
          _id: { $nin: questions.map((q) => q._id) },
        },
      },
      { $sample: { size: Number(count) - questions.length } },
    ]);
    questions = [...questions, ...additional];
  }

  return questions;
};

export const getQuestionsByIds = async (questionIds, includeAnswers = false) => {
  const query = Question.find({ _id: { $in: questionIds } });
  if (!includeAnswers) {
    query.select("-correctAnswer -explanation");
  }
  return await query.exec();
};

export const createSession = async (sessionData) => {
  return await PracticeSession.create(sessionData);
};

export const getSessionById = async (sessionId) => {
  return await PracticeSession.findById(sessionId);
};

export const updateSession = async (sessionId, updateData) => {
  return await PracticeSession.findByIdAndUpdate(sessionId, updateData, {
    returnDocument: "after",
  });
};

export const getSessionsByUserId = async (userId, { skip = 0, limit = 10 } = {}) => {
  const [sessions, total] = await Promise.all([
    PracticeSession.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("questions", "prompt category difficulty skills"),
    PracticeSession.countDocuments({ userId }),
  ]);

  return { sessions, total };
};

export const createAttempts = async (attemptsData) => {
  return await PracticeAttempt.insertMany(attemptsData);
};

export const getAttemptsBySessionId = async (sessionId) => {
  return await PracticeAttempt.find({ sessionId }).populate("questionId");
};

export const getUserPerformance = async (userId) => {
  return await UserPerformance.findOne({ userId });
};

export const upsertUserPerformance = async (userId, performanceData) => {
  return await UserPerformance.findOneAndUpdate(
    { userId },
    { $set: performanceData },
    { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
  );
};

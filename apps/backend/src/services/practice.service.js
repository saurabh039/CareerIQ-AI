import * as practiceRepository from "../repositories/practice.repository.js";

export const getCategories = async () => {
  const categoryStats = await practiceRepository.getCategoryStats();

  const predefinedMeta = {
    aptitude: {
      name: "Aptitude & Logical",
      description:
        "Quantitative aptitude, logical reasoning, numerical puzzles, and pattern recognition.",
      icon: "calculator",
    },
    technical: {
      name: "Technical & Engineering",
      description:
        "Core software engineering, JavaScript, React, Node.js, databases, and system design.",
      icon: "code",
    },
    hr: {
      name: "HR & Situational Judgment",
      description:
        "Behavioral interview scenarios, communication, conflict resolution, and workplace judgment.",
      icon: "users",
    },
  };

  const categories = categoryStats.map((stat) => ({
    category: stat.category,
    name: predefinedMeta[stat.category]?.name || stat.category,
    description: predefinedMeta[stat.category]?.description || "",
    icon: predefinedMeta[stat.category]?.icon || "book",
    questionCount: stat.count,
    difficulties: stat.difficulties,
  }));

  return categories;
};

export const startSession = async (
  userId,
  { category, difficulty = "medium", questionCount = 5, role = "general" }
) => {
  const count = Math.min(Math.max(Number(questionCount) || 5, 1), 20);

  const rawQuestions = await practiceRepository.getRandomQuestions({
    category,
    difficulty,
    count,
    role,
  });

  if (!rawQuestions || rawQuestions.length === 0) {
    throw new Error(
      `No questions available for category '${category}' and difficulty '${difficulty}'`
    );
  }

  const questionIds = rawQuestions.map((q) => q._id);

  const session = await practiceRepository.createSession({
    userId,
    category,
    difficulty,
    questions: questionIds,
    totalQuestions: questionIds.length,
    status: "in-progress",
    startedAt: new Date(),
  });

  // Never leak correct answers or explanations to the client during active sessions!
  const sanitizedQuestions = rawQuestions.map((q) => ({
    _id: q._id,
    prompt: q.prompt,
    category: q.category,
    difficulty: q.difficulty,
    type: q.type,
    options: q.options,
    skills: q.skills,
    topics: q.topics,
    role: q.role,
  }));

  return {
    session: {
      _id: session._id,
      category: session.category,
      difficulty: session.difficulty,
      totalQuestions: session.totalQuestions,
      status: session.status,
      startedAt: session.startedAt,
    },
    questions: sanitizedQuestions,
  };
};

export const getSession = async (userId, sessionId) => {
  const session = await practiceRepository.getSessionById(sessionId);

  if (!session) {
    throw new Error("Practice session not found");
  }

  if (session.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized to access this practice session");
  }

  const isCompleted = session.status === "completed";
  const questions = await practiceRepository.getQuestionsByIds(
    session.questions,
    isCompleted
  );

  let attempts = [];
  if (isCompleted) {
    attempts = await practiceRepository.getAttemptsBySessionId(sessionId);
  }

  return {
    session,
    questions,
    attempts,
  };
};

export const submitSession = async (userId, sessionId, answers = []) => {
  const session = await practiceRepository.getSessionById(sessionId);

  if (!session) {
    throw new Error("Practice session not found");
  }

  if (session.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized to submit this practice session");
  }

  if (session.status === "completed") {
    throw new Error("This practice session has already been completed");
  }

  // Load questions including correct answers and explanations for scoring
  const questions = await practiceRepository.getQuestionsByIds(
    session.questions,
    true
  );

  const questionMap = new Map();
  questions.forEach((q) => questionMap.set(q._id.toString(), q));

  let totalPoints = 0;
  const attemptsData = [];
  const results = [];

  const answersMap = new Map();
  answers.forEach((a) => answersMap.set(String(a.questionId), a));

  for (const question of questions) {
    const qId = question._id.toString();
    const userAns = answersMap.get(qId);
    const selectedOption = userAns?.selectedOption ? String(userAns.selectedOption).trim().toUpperCase() : "";
    const isCorrect = selectedOption === question.correctAnswer.trim().toUpperCase();
    const pointsEarned = isCorrect ? 1 : 0;
    const timeSpentSeconds = Number(userAns?.timeSpentSeconds) || 0;

    totalPoints += pointsEarned;

    attemptsData.push({
      sessionId: session._id,
      userId,
      questionId: question._id,
      selectedOption,
      isCorrect,
      pointsEarned,
      timeSpentSeconds,
    });

    results.push({
      questionId: question._id,
      prompt: question.prompt,
      category: question.category,
      difficulty: question.difficulty,
      options: question.options,
      selectedOption,
      correctAnswer: question.correctAnswer,
      isCorrect,
      explanation: question.explanation,
      skills: question.skills,
      topics: question.topics,
      role: question.role,
      timeSpentSeconds,
    });
  }

  // Persist individual attempts
  await practiceRepository.createAttempts(attemptsData);

  const totalPossible = questions.length;
  const percentage = totalPossible > 0 ? Math.round((totalPoints / totalPossible) * 100) : 0;

  // Mark session completed
  const updatedSession = await practiceRepository.updateSession(session._id, {
    status: "completed",
    score: totalPoints,
    totalPossibleScore: totalPossible,
    percentage,
    completedAt: new Date(),
  });

  // Update User Performance Metrics
  const updatedPerformance = await updateUserPerformance(
    userId,
    session.category,
    results
  );

  return {
    session: updatedSession,
    results,
    score: totalPoints,
    totalPossibleScore: totalPossible,
    percentage,
    performance: updatedPerformance,
  };
};

const updateUserPerformance = async (userId, sessionCategory, results) => {
  let perf = await practiceRepository.getUserPerformance(userId);

  if (!perf) {
    perf = {
      userId,
      totalSessions: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      overallAccuracy: 0,
      categoryStats: {
        aptitude: { totalAnswered: 0, totalCorrect: 0, accuracy: 0 },
        technical: { totalAnswered: 0, totalCorrect: 0, accuracy: 0 },
        hr: { totalAnswered: 0, totalCorrect: 0, accuracy: 0 },
      },
      skillStats: [],
      lastPracticedAt: new Date(),
    };
  }

  perf.totalSessions = (perf.totalSessions || 0) + 1;
  perf.totalQuestionsAnswered = (perf.totalQuestionsAnswered || 0) + results.length;
  const sessionCorrect = results.filter((r) => r.isCorrect).length;
  perf.totalCorrectAnswers = (perf.totalCorrectAnswers || 0) + sessionCorrect;
  perf.overallAccuracy =
    perf.totalQuestionsAnswered > 0
      ? Math.round((perf.totalCorrectAnswers / perf.totalQuestionsAnswered) * 100)
      : 0;
  perf.lastPracticedAt = new Date();

  // Update Category Stats
  results.forEach((r) => {
    const cat = r.category?.toLowerCase();
    if (perf.categoryStats && perf.categoryStats[cat]) {
      perf.categoryStats[cat].totalAnswered += 1;
      if (r.isCorrect) perf.categoryStats[cat].totalCorrect += 1;
      perf.categoryStats[cat].accuracy = Math.round(
        (perf.categoryStats[cat].totalCorrect / perf.categoryStats[cat].totalAnswered) * 100
      );
    }

    // Update Skill Stats
    if (Array.isArray(r.skills)) {
      r.skills.forEach((skillName) => {
        let skillEntry = perf.skillStats.find((s) => s.skill === skillName);
        if (!skillEntry) {
          skillEntry = { skill: skillName, totalAnswered: 0, totalCorrect: 0, accuracy: 0 };
          perf.skillStats.push(skillEntry);
        }
        skillEntry.totalAnswered += 1;
        if (r.isCorrect) skillEntry.totalCorrect += 1;
        skillEntry.accuracy = Math.round(
          (skillEntry.totalCorrect / skillEntry.totalAnswered) * 100
        );
      });
    }
  });

  return await practiceRepository.upsertUserPerformance(userId, perf);
};

export const getUserPerformance = async (userId) => {
  const perf = await practiceRepository.getUserPerformance(userId);
  if (!perf) {
    return {
      userId,
      totalSessions: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      overallAccuracy: 0,
      categoryStats: {
        aptitude: { totalAnswered: 0, totalCorrect: 0, accuracy: 0 },
        technical: { totalAnswered: 0, totalCorrect: 0, accuracy: 0 },
        hr: { totalAnswered: 0, totalCorrect: 0, accuracy: 0 },
      },
      skillStats: [],
    };
  }
  return perf;
};

export const getHistory = async (userId, { page = 1, limit = 10 } = {}) => {
  const p = Math.max(Number(page) || 1, 1);
  const l = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const skip = (p - 1) * l;

  const { sessions, total } = await practiceRepository.getSessionsByUserId(userId, {
    skip,
    limit: l,
  });

  return {
    sessions,
    pagination: {
      page: p,
      limit: l,
      total,
      totalPages: Math.ceil(total / l),
    },
  };
};

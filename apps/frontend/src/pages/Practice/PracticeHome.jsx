import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import {
  getCategories,
  startSession,
  getUserPerformance,
} from "../../services/practice.service";
import {
  Brain,
  Code2,
  Calculator,
  Users2,
  Sparkles,
  Trophy,
  History,
  Target,
  ArrowRight,
} from "lucide-react";

export default function PracticeHome() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  // Practice session configuration
  const [selectedCategory, setSelectedCategory] = useState("technical");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(5);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [catsRes, perfRes] = await Promise.all([
        getCategories(),
        getUserPerformance(),
      ]);

      setCategories(catsRes.data.data || []);
      setPerformance(perfRes.data.data || null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load practice data");
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    try {
      setStarting(true);
      const res = await startSession({
        category: selectedCategory,
        difficulty,
        questionCount,
      });

      const sessionId = res.data.data.session._id;
      toast.success("Practice session started! Good luck.");
      navigate(`/practice/session/${sessionId}`, {
        state: { sessionData: res.data.data },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start practice session");
    } finally {
      setStarting(false);
    }
  };

  const getCategoryIcon = (catKey) => {
    switch (catKey) {
      case "aptitude":
        return <Calculator className="h-6 w-6 text-blue-500" />;
      case "technical":
        return <Code2 className="h-6 w-6 text-emerald-500" />;
      case "hr":
        return <Users2 className="h-6 w-6 text-purple-500" />;
      default:
        return <Brain className="h-6 w-6 text-amber-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground animate-pulse">
          Loading Practice Intelligence...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-semibold text-primary mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Practice Intelligence Foundation
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Interactive Practice Sessions
            </h1>
            <p className="mt-1 text-muted-foreground">
              Sharpen your skills across Aptitude, Technical domains, and HR judgment.
            </p>
          </div>

          <Link to="/practice/history">
            <Button variant="outline" className="gap-2">
              <History className="h-4 w-4" />
              Attempt History
            </Button>
          </Link>
        </div>

        {/* User Performance Metric Summary */}
        {performance && (
          <div className="grid grid-cols-2 gap-4 rounded-2xl border bg-card p-6 shadow-sm sm:grid-cols-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Trophy className="h-4 w-4 text-amber-500" />
                Total Sessions
              </div>
              <p className="text-2xl font-bold">{performance.totalSessions}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Target className="h-4 w-4 text-blue-500" />
                Questions Solved
              </div>
              <p className="text-2xl font-bold">{performance.totalQuestionsAnswered}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                Overall Accuracy
              </div>
              <p className="text-2xl font-bold">{performance.overallAccuracy}%</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Code2 className="h-4 w-4 text-purple-500" />
                Tech Accuracy
              </div>
              <p className="text-2xl font-bold">
                {performance.categoryStats?.technical?.accuracy || 0}%
              </p>
            </div>
          </div>
        )}

        {/* Configuration Card */}
        <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
          {/* Step 1: Category Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              1. Select Practice Domain
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.category;
                return (
                  <button
                    key={cat.category}
                    type="button"
                    onClick={() => setSelectedCategory(cat.category)}
                    className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="rounded-lg bg-background p-2 border shadow-2xs">
                        {getCategoryIcon(cat.category)}
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {cat.questionCount} questions
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{cat.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Difficulty Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              2. Choose Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "easy", label: "Easy", desc: "Core fundamentals & quick drills" },
                { id: "medium", label: "Medium", desc: "Standard interview standards" },
                { id: "hard", label: "Hard", desc: "Deep reasoning & edge cases" },
              ].map((lvl) => {
                const isSelected = difficulty === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setDifficulty(lvl.id)}
                    className={`rounded-xl border p-3.5 text-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary font-semibold text-primary"
                        : "border-border hover:bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <div className="text-sm font-semibold capitalize">{lvl.label}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground hidden sm:block">
                      {lvl.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Question Count */}
          <div className="space-y-3">
            <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              3. Questions Per Session
            </label>
            <div className="flex gap-3">
              {[5, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCount(cnt)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition ${
                    questionCount === cnt
                      ? "border-primary bg-primary/5 ring-2 ring-primary text-primary"
                      : "border-border hover:bg-muted/30 text-foreground"
                  }`}
                >
                  {cnt} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t flex justify-end">
            <Button
              size="lg"
              disabled={starting}
              onClick={handleStartSession}
              className="gap-2 px-8"
            >
              {starting ? "Starting Session..." : "Begin Practice"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { getSession } from "../../services/practice.service";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  LayoutDashboard,
  History,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export default function PracticeResults() {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState(null);
  const [results, setResults] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        if (location.state?.resultsData) {
          const data = location.state.resultsData;
          setSession(data.session);
          setResults(data.results);
          setPerformance(data.performance);
        } else {
          const res = await getSession(sessionId);
          const data = res.data.data;
          setSession(data.session);

          // Reconstruct results format from populated questions and attempts
          const attemptsMap = new Map();
          data.attempts?.forEach((a) =>
            attemptsMap.set(
              a.questionId?._id?.toString() || a.questionId?.toString(),
              a
            )
          );

          const mappedResults = data.questions.map((q) => {
            const att = attemptsMap.get(q._id.toString());
            return {
              questionId: q._id,
              prompt: q.prompt,
              category: q.category,
              difficulty: q.difficulty,
              options: q.options,
              selectedOption: att?.selectedOption || "",
              correctAnswer: q.correctAnswer,
              isCorrect: att ? att.isCorrect : false,
              explanation: q.explanation,
              skills: q.skills,
              topics: q.topics,
            };
          });

          setResults(mappedResults);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load session results");
        navigate("/practice");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [sessionId, location.state, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground animate-pulse">
          Calculating score results...
        </p>
      </div>
    );
  }

  const score = session?.score || 0;
  const total = session?.totalPossibleScore || results.length || 0;
  const percentage = session?.percentage ?? (total > 0 ? Math.round((score / total) * 100) : 0);

  const getGradeInfo = (pct) => {
    if (pct >= 80) {
      return {
        label: "Outstanding Performance!",
        color: "text-emerald-500",
        badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      };
    }
    if (pct >= 50) {
      return {
        label: "Good Effort! Keep Practicing.",
        color: "text-amber-500",
        badge: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      };
    }
    return {
      label: "Needs Improvement. Review explanations below.",
      color: "text-rose-500",
      badge: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    };
  };

  const grade = getGradeInfo(percentage);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Score Card Banner */}
        <div className="rounded-2xl border bg-card p-8 shadow-sm text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-1">
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${grade.badge}`}
            >
              {grade.label}
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight mt-2">
              {percentage}%
            </h1>
            <p className="text-sm text-muted-foreground">
              You scored <span className="font-semibold text-foreground">{score}</span> out of{" "}
              <span className="font-semibold text-foreground">{total}</span> questions correctly in{" "}
              <span className="font-semibold text-foreground uppercase">{session?.category}</span>.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t">
            <Link to="/practice">
              <Button className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Practice Again
              </Button>
            </Link>
            <Link to="/practice/history">
              <Button variant="outline" className="gap-2">
                <History className="h-4 w-4" />
                Past Sessions
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">
              Detailed Question Review
            </h2>
            <span className="text-xs text-muted-foreground">
              {results.filter((r) => r.isCorrect).length} Correct /{" "}
              {results.filter((r) => !r.isCorrect).length} Incorrect
            </span>
          </div>

          <div className="space-y-4">
            {results.map((item, idx) => (
              <div
                key={item.questionId || idx}
                className={`rounded-2xl border p-6 shadow-2xs transition bg-card ${
                  item.isCorrect
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-rose-500/30 bg-rose-500/5"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {item.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                    )}
                    <span className="font-semibold text-sm">
                      Question {idx + 1}
                    </span>
                  </div>

                  {/* Skills Tag */}
                  <div className="flex flex-wrap gap-1">
                    {item.skills?.map((s, i) => (
                      <span
                        key={i}
                        className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prompt */}
                <p className="mt-3 font-medium text-foreground leading-relaxed">
                  {item.prompt}
                </p>

                {/* Options List */}
                <div className="mt-4 space-y-2">
                  {item.options?.map((opt) => {
                    const isSelected = item.selectedOption === opt.id;
                    const isCorrect = item.correctAnswer === opt.id;

                    let optionStyle = "border-border bg-background text-foreground";
                    if (isCorrect) {
                      optionStyle = "border-emerald-500 bg-emerald-500/15 font-semibold text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500";
                    } else if (isSelected && !isCorrect) {
                      optionStyle = "border-rose-500 bg-rose-500/15 font-semibold text-rose-950 dark:text-rose-200 ring-1 ring-rose-500";
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center justify-between rounded-xl border p-3 text-sm transition ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-xs uppercase">
                            {opt.id}.
                          </span>
                          <span>{opt.text}</span>
                        </div>

                        <div className="text-xs font-semibold">
                          {isCorrect && (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              ✓ Correct Answer
                            </span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="text-rose-600 dark:text-rose-400">
                              ✗ Your Choice
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {item.explanation && (
                  <div className="mt-4 rounded-xl border border-muted bg-muted/40 p-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground mb-1">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Explanation:
                    </div>
                    <p className="leading-relaxed">{item.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

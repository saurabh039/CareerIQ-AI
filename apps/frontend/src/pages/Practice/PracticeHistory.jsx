import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import {
  getPracticeHistory,
  getUserPerformance,
} from "../../services/practice.service";
import {
  History,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Trophy,
  ArrowRight,
  Target,
} from "lucide-react";

export default function PracticeHistory() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [historyRes, perfRes] = await Promise.all([
        getPracticeHistory({ limit: 20 }),
        getUserPerformance(),
      ]);

      setSessions(historyRes.data.data.sessions || []);
      setPerformance(perfRes.data.data || null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load practice history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground animate-pulse">
          Loading practice history...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Navigation & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/practice">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Practice History</h1>
              <p className="text-sm text-muted-foreground">
                Review your completed sessions, scores, and performance trends.
              </p>
            </div>
          </div>

          <Link to="/practice">
            <Button className="gap-2">New Session</Button>
          </Link>
        </div>

        {/* Overall Accuracy Card */}
        {performance && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-2xl border bg-card p-6 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                <Trophy className="h-4 w-4 text-amber-500" />
                Completed Sessions
              </div>
              <p className="text-3xl font-extrabold">{performance.totalSessions}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                <Target className="h-4 w-4 text-blue-500" />
                Questions Solved
              </div>
              <p className="text-3xl font-extrabold">{performance.totalQuestionsAnswered}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Overall Accuracy
              </div>
              <p className="text-3xl font-extrabold text-primary">
                {performance.overallAccuracy}%
              </p>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Past Practice Sessions</h2>

          {sessions.length === 0 ? (
            <div className="rounded-2xl border bg-card p-12 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <History className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">No practice sessions yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start your first practice session to track your performance and interview readiness.
                </p>
              </div>
              <Link to="/practice">
                <Button className="gap-2">Begin Practice Now</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border bg-card p-5 shadow-2xs hover:border-primary/50 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase tracking-wider text-xs text-primary">
                        {sess.category}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {sess.difficulty} Difficulty
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(sess.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {sess.percentage ?? Math.round((sess.score / sess.totalQuestions) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {sess.score} / {sess.totalQuestions} Correct
                      </div>
                    </div>

                    <Link to={`/practice/results/${sess._id}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        Review
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

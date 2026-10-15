import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { getSession, submitSession } from "../../services/practice.service";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

export default function PracticeSession() {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: "A" }
  const [timeSpent, setTimeSpent] = useState({}); // { [questionId]: seconds }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);

  // Load session data either from router state or API
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        if (location.state?.sessionData) {
          setSession(location.state.sessionData.session);
          setQuestions(location.state.sessionData.questions);
        } else {
          const res = await getSession(sessionId);
          if (res.data.data.session.status === "completed") {
            toast.info("This session is already completed.");
            navigate(`/practice/results/${sessionId}`);
            return;
          }
          setSession(res.data.data.session);
          setQuestions(res.data.data.questions);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load practice session");
        navigate("/practice");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [sessionId, location.state, navigate]);

  // Overall session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds((prev) => prev + 1);
      // Increment active question time
      if (questions.length > 0) {
        const currentQId = questions[currentIndex]?._id;
        if (currentQId) {
          setTimeSpent((prev) => ({
            ...prev,
            [currentQId]: (prev[currentQId] || 0) + 1,
          }));
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, questions]);

  const handleSelectOption = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    const unansweredCount = questions.length - answeredCount;

    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit your session now?`
      );
      if (!confirmSubmit) return;
    }

    try {
      setSubmitting(true);
      const payloadAnswers = questions.map((q) => ({
        questionId: q._id,
        selectedOption: selectedAnswers[q._id] || "",
        timeSpentSeconds: timeSpent[q._id] || 0,
      }));

      const res = await submitSession(sessionId, payloadAnswers);
      toast.success("Practice session scored successfully!");
      navigate(`/practice/results/${sessionId}`, {
        state: { resultsData: res.data.data },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit answers");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${rem.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground animate-pulse">
          Preparing questionnaire...
        </p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
        <p className="text-lg text-muted-foreground">No questions found in this session.</p>
        <Button onClick={() => navigate("/practice")}>Return to Practice</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedOptionForCurrent = selectedAnswers[currentQuestion._id];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm("Do you want to leave this session? Unsaved progress will be lost.")) {
                  navigate("/practice");
                }
              }}
              className="text-muted-foreground hover:text-foreground transition p-1"
              title="Exit Session"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {session?.category}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {session?.difficulty}
                </span>
              </div>
              <h2 className="text-lg font-bold">
                Question {currentIndex + 1} of {questions.length}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border bg-muted/40 px-3.5 py-1 text-sm font-medium">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formatTime(totalSeconds)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
          {/* Metadata badges */}
          <div className="flex flex-wrap gap-1.5">
            {currentQuestion.skills?.map((skill, i) => (
              <span
                key={i}
                className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {skill}
              </span>
            ))}
            {currentQuestion.topics?.map((topic, i) => (
              <span
                key={i}
                className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {topic}
              </span>
            ))}
          </div>

          {/* Prompt */}
          <h3 className="text-xl font-semibold leading-relaxed text-foreground">
            {currentQuestion.prompt}
          </h3>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options?.map((opt) => {
              const isSelected = selectedOptionForCurrent === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestion._id, opt.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary font-medium text-foreground"
                      : "border-border hover:bg-muted/40 text-foreground"
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "border text-muted-foreground bg-background"
                    }`}
                  >
                    {opt.id}
                  </div>
                  <span className="text-sm leading-normal pt-0.5">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-3">
            {currentIndex < questions.length - 1 ? (
              <Button
                onClick={() =>
                  setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))
                }
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle className="h-4 w-4" />
                {submitting ? "Scoring..." : "Submit Session"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

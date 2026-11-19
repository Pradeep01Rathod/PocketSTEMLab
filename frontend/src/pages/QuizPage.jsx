import React, { useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import {
  Atom,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Home,
  Trophy,
  BookOpen,
  Layers,
  FlaskConical,
  Zap,
  Microscope,
  Shapes,
  Check,
  AlertCircle
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { quizBank } from "../data/quizData";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import { queueOfflineQuiz, queueOfflineProgress } from "../utils/offlineSync";
import "./QuizPage.css";

const subjectMeta = {
  Chemistry: { icon: FlaskConical, color: "#6655D9" },
  Physics: { icon: Zap, color: "#EF991F" },
  Biology: { icon: Microscope, color: "#28B67A" },
  Mathematics: { icon: Shapes, color: "#2D7FF9" },
};

export default function QuizPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { quizId: paramQuizId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine active quiz ID from route param or query string
  const activeQuizId = paramQuizId || searchParams.get("id") || "chemistry_filtration";
  const initialQuiz = quizBank[activeQuizId] || quizBank.chemistry_filtration;

  // Selected Quiz & Curriculum Filters
  const [loadedQuizId, setLoadedQuizId] = useState(activeQuizId);
  const [currentQuiz, setCurrentQuiz] = useState(initialQuiz);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState(initialQuiz.subject);
  const [selectedClassFilter, setSelectedClassFilter] = useState(initialQuiz.classLevel);

  // Quiz Engine State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  // Supabase Save State
  const [saveStatus, setSaveStatus] = useState("idle"); // "idle" | "saving" | "saved" | "error"
  const [saveMessage, setSaveMessage] = useState("");
  const saveStarted = useRef(false);

  const resetQuizState = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setSaveStatus("idle");
    setSaveMessage("");
    saveStarted.current = false;
  };

  // Sync state if activeQuizId changes in URL
  if (activeQuizId !== loadedQuizId && quizBank[activeQuizId]) {
    const nextQ = quizBank[activeQuizId];
    setLoadedQuizId(activeQuizId);
    setCurrentQuiz(nextQ);
    setSelectedSubjectFilter(nextQ.subject);
    setSelectedClassFilter(nextQ.classLevel);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setSaveStatus("idle");
    setSaveMessage("");
  }

  const handleSelectQuiz = (quizKey) => {
    if (quizBank[quizKey]) {
      const q = quizBank[quizKey];
      setLoadedQuizId(quizKey);
      setCurrentQuiz(q);
      setSelectedSubjectFilter(q.subject);
      setSelectedClassFilter(q.classLevel);
      setSearchParams({ id: quizKey });
      resetQuizState();
    }
  };

  // Filter available quizzes for dropdown
  const filteredQuizzes = Object.values(quizBank).filter(
    (q) => q.subject === selectedSubjectFilter
  );

  const questions = currentQuiz.questions || [];
  const question = questions[currentQuestionIndex] || questions[0];
  const isCorrect = selectedAnswer === question.answer;

  const chooseAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
  };

  // Save the completed quiz score & progress to Supabase
  const saveQuizResult = async (completedAnswers) => {
    if (saveStarted.current) return;
    saveStarted.current = true;

    setSaveStatus("saving");
    setSaveMessage("Synchronizing quiz score to your EduSpark profile...");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session?.user) {
        setSaveStatus("error");
        setSaveMessage("Log in to save your official quiz score to Supabase.");
        return;
      }

      const finalScore = completedAnswers.filter(
        (ans, idx) => ans === questions[idx].answer
      ).length;

      const pct = Math.round((finalScore / questions.length) * 100);

      // Check if device is offline: queue locally for sync
      if (!navigator.onLine) {
        queueOfflineQuiz({
          userId: session.user.id,
          quizId: currentQuiz.id,
          score: finalScore,
          totalQuestions: questions.length,
        });

        if (currentQuiz.lessonId) {
          queueOfflineProgress({
            userId: session.user.id,
            lessonId: currentQuiz.lessonId,
            progressPercent: Math.max(pct, 60),
            completed: pct >= 60,
          });
        }

        setSaveStatus("saved");
        setSaveMessage(t("quiz_saved_offline", "Saved to offline storage! Will sync when reconnected."));
        return;
      }

      // 1. Insert record into quiz_results table
      const { error: quizError } = await supabase.from("quiz_results").insert({
        user_id: session.user.id,
        quiz_id: currentQuiz.id,
        score: finalScore,
        total_questions: questions.length,
      });

      if (quizError) throw quizError;

      // 2. Also update learning_progress table if lessonId is defined
      if (currentQuiz.lessonId) {
        await supabase.from("learning_progress").upsert(
          {
            user_id: session.user.id,
            lesson_id: currentQuiz.lessonId,
            progress_percent: Math.max(pct, 60),
            completed: pct >= 60,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,lesson_id" }
        );
      }

      setSaveStatus("saved");
      setSaveMessage("✓ Quiz score & curriculum progress saved successfully!");
    } catch (error) {
      console.error("Quiz save error:", error);

      // If network failure occurs, fall back to offline storage
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const finalScore = completedAnswers.filter(
          (ans, idx) => ans === questions[idx].answer
        ).length;
        queueOfflineQuiz({
          userId: session.user.id,
          quizId: currentQuiz.id,
          score: finalScore,
          totalQuestions: questions.length,
        });
        setSaveStatus("saved");
        setSaveMessage(t("quiz_saved_offline", "Saved to offline storage! Will sync when reconnected."));
      } else {
        setSaveStatus("error");
        setSaveMessage(error.message || "Could not save your quiz result to cloud.");
      }
    }
  };

  const nextQuestion = () => {
    if (selectedAnswer === null) return;

    const updatedAnswers = [...answers, selectedAnswer];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex === questions.length - 1) {
      setShowResult(true);
      saveQuizResult(updatedAnswers);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const finalScore = answers.filter(
    (ans, idx) => ans === questions[idx]?.answer
  ).length;

  const percentage = Math.round((finalScore / (questions.length || 1)) * 100);

  const SubIcon = subjectMeta[currentQuiz.subject]?.icon || FlaskConical;

  return (
    <div className="stem-quiz-page">
      {/* 1. TOPBAR */}
      <header className="stem-quiz-topbar">
        <Link to="/" className="stem-quiz-brand" title="EduSpark Home">
          <div className="stem-quiz-brand-icon">
            <Atom size={22} />
          </div>
          <span className="stem-quiz-brand-name">
            Edu<strong>Spark</strong>
          </span>
        </Link>

        <div className="stem-quiz-topbar-actions">
          <LanguageSwitcher compact />
          <button
            type="button"
            className="stem-quiz-top-btn"
            onClick={() => navigate("/dashboard")}
          >
            <Home size={15} />
            <span>{t("nav_dashboard", "Dashboard")}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN QUIZ CONTAINER */}
      <main className="stem-quiz-container">
        {/* QUIZ SELECTOR & SWITCHER */}
        <section className="stem-quiz-selector-card">
          <div className="stem-quiz-selector-header">
            <span className="stem-quiz-selector-title">
              <Layers size={14} /> Select STEM Subject & Quiz
            </span>
            <span style={{ fontSize: "12px", color: "#71807D", fontWeight: 600 }}>
              {currentQuiz.classLevel}
            </span>
          </div>

          {/* Subject Pills */}
          <div className="stem-quiz-subject-pills">
            {Object.keys(subjectMeta).map((sub) => {
              const Icon = subjectMeta[sub].icon;
              const isActive = selectedSubjectFilter === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  className={`stem-quiz-sub-pill ${isActive ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSubjectFilter(sub);
                    const firstMatch = Object.values(quizBank).find((q) => q.subject === sub);
                    if (firstMatch) handleSelectQuiz(firstMatch.id);
                  }}
                >
                  <Icon size={14} />
                  <span>{sub}</span>
                </button>
              );
            })}
          </div>

          {/* Quiz Dropdown */}
          <div className="stem-quiz-dropdowns-row">
            <div>
              <select
                className="stem-quiz-select-field"
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
              >
                {["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                className="stem-quiz-select-field"
                value={currentQuiz.id}
                onChange={(e) => handleSelectQuiz(e.target.value)}
              >
                {filteredQuizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title} ({q.chapter})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* QUIZ HEADER */}
        <div className="stem-quiz-header">
          <span className="stem-quiz-badge">
            <SubIcon size={13} /> {currentQuiz.subject} · {currentQuiz.classLevel}
          </span>
          <h1>{currentQuiz.title}</h1>
          <p>{currentQuiz.description}</p>
        </div>

        {/* 3. ACTIVE QUIZ CARD */}
        <section className="stem-quiz-card">
          {!showResult ? (
            <>
              {/* Progress Bar & Counter */}
              <div className="stem-quiz-progress-meta">
                <span>
                  {t("quiz_progress", "Question")} {currentQuestionIndex + 1} {t("quiz_of", "of")} {questions.length}
                </span>
                <span>
                  {Math.round(
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  )}%
                </span>
              </div>

              <div className="stem-quiz-progress-track">
                <div
                  className="stem-quiz-progress-fill"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / questions.length) * 100
                    }%`,
                  }}
                />
              </div>

              {/* Question Text */}
              <h2 className="stem-quiz-question-text">
                {question.question}
              </h2>

              {/* Answer Options */}
              <div className="stem-quiz-options-list">
                {question.options.map((option, index) => {
                  let btnClass = "stem-quiz-option-btn";

                  if (selectedAnswer === index) {
                    btnClass += " selected";
                  }

                  if (selectedAnswer !== null) {
                    if (index === question.answer) {
                      btnClass += " correct";
                    } else if (selectedAnswer === index && !isCorrect) {
                      btnClass += " wrong";
                    }
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      className={btnClass}
                      onClick={() => chooseAnswer(index)}
                      disabled={selectedAnswer !== null}
                    >
                      <div className="stem-quiz-option-left">
                        <span className="stem-quiz-option-letter">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {selectedAnswer !== null && index === question.answer && (
                        <CheckCircle2 size={18} color="#16A34A" />
                      )}

                      {selectedAnswer === index && !isCorrect && (
                        <XCircle size={18} color="#DC2626" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback Box */}
              {selectedAnswer !== null && (
                <div
                  className={`stem-quiz-feedback-box ${
                    isCorrect ? "correct" : "wrong"
                  }`}
                >
                  <div className="stem-quiz-feedback-header">
                    {isCorrect ? (
                      <>
                        <Check size={16} />
                        <span>Correct Answer!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} />
                        <span>Review Concept:</span>
                      </>
                    )}
                  </div>
                  <div>{question.explanation}</div>
                </div>
              )}

              {/* Next Question / View Result Button */}
              <button
                type="button"
                className="stem-quiz-next-btn"
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
              >
                <span>
                  {currentQuestionIndex === questions.length - 1
                    ? "Complete Quiz & View Score"
                    : "Next Question"}
                </span>
                <ChevronRight size={18} />
              </button>
            </>
          ) : (
            /* 4. RESULTS VIEW */
            <div className="stem-quiz-result-view">
              <div className="stem-quiz-trophy-wrap">
                <Trophy size={40} />
              </div>

              <span className="stem-quiz-badge">ASSESSMENT COMPLETED</span>

              <h2>
                {percentage >= 80
                  ? "Outstanding Performance!"
                  : percentage >= 60
                  ? "Great Effort! Concept Mastered."
                  : "Keep Practicing! Review the Concepts."}
              </h2>

              <p>
                You completed the <strong>{currentQuiz.title}</strong> for {currentQuiz.classLevel}.
              </p>

              <div className="stem-quiz-big-score">
                {finalScore} / {questions.length}
              </div>

              <span
                className={`stem-quiz-pct-badge ${
                  percentage >= 60 ? "pass" : "fail"
                }`}
              >
                {percentage}% Score · {percentage >= 60 ? "✓ Passed" : "Needs Review"}
              </span>

              {/* Supabase Save Status Banner */}
              {saveMessage && (
                <div className={`stem-quiz-save-status ${saveStatus}`}>
                  {saveStatus === "saved" && <Check size={16} />}
                  {saveStatus === "error" && <AlertCircle size={16} />}
                  <span>{saveMessage}</span>
                </div>
              )}

              {/* Detailed Question Review List */}
              <div className="stem-quiz-review-section">
                <h3>Detailed Question & Answer Review</h3>

                {questions.map((item, idx) => {
                  const studentAnswer = answers[idx];
                  const wasRight = studentAnswer === item.answer;

                  return (
                    <article key={idx} className="stem-quiz-review-card">
                      <div className="stem-quiz-review-top">
                        <h4 className="stem-quiz-review-q">
                          {idx + 1}. {item.question}
                        </h4>
                        <span
                          className={`stem-quiz-verdict-badge ${
                            wasRight ? "correct" : "wrong"
                          }`}
                        >
                          {wasRight ? "✓ Correct" : "✗ Incorrect"}
                        </span>
                      </div>

                      <div className="stem-quiz-review-ans-row">
                        <strong>Your answer: </strong>
                        <span style={{ color: wasRight ? "#15803D" : "#B91C1C" }}>
                          {item.options[studentAnswer]}
                        </span>
                      </div>

                      {!wasRight && (
                        <div className="stem-quiz-review-ans-row">
                          <strong>Correct answer: </strong>
                          <span style={{ color: "#15803D" }}>
                            {item.options[item.answer]}
                          </span>
                        </div>
                      )}

                      <p className="stem-quiz-review-exp">
                        <strong>Why: </strong>
                        {item.explanation}
                      </p>
                    </article>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="stem-quiz-actions-bar">
                <button
                  type="button"
                  className="stem-quiz-action-btn primary"
                  onClick={resetQuizState}
                >
                  <RotateCcw size={16} />
                  <span>{t("btn_try_again", "Try Quiz Again")}</span>
                </button>

                <button
                  type="button"
                  className="stem-quiz-action-btn secondary"
                  onClick={() => navigate("/dashboard#subjects")}
                >
                  <BookOpen size={16} />
                  <span>{t("nav_subjects", "Explore Other Subjects")}</span>
                </button>

                <button
                  type="button"
                  className="stem-quiz-action-btn secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  <Home size={16} />
                  <span>{t("nav_back_dashboard", "Return to Dashboard")}</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

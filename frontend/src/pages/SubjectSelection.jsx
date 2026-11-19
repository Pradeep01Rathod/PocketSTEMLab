import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FlaskConical,
  Zap,
  Microscope,
  Shapes,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  X,
  BookOpen,
  Award,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { curriculumData } from "../data/curriculumData";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DoubtSection from "../components/DoubtSection";
import "./Dashboard.css";

const iconMap = {
  chemistry: FlaskConical,
  physics: Zap,
  biology: Microscope,
  mathematics: Shapes,
  math: Shapes,
};

const labRoutes = {
  chemistry: "/chemistry-lab",
  physics: "/stem-lab/physics",
  biology: "/stem-lab/biology",
  mathematics: "/stem-lab/mathematics",
  math: "/stem-lab/mathematics",
};

export default function SubjectSelection() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Navigation / Drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Student Profile & Progress
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Subject view & Grade filter
  const initialSubject = searchParams.get("subject");
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    initialSubject && curriculumData[initialSubject] ? initialSubject : null
  );
  const [subjectClassFilter, setSubjectClassFilter] = useState("Class 6");

  // Knowledge Check modal state
  const [activeActivity, setActiveActivity] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [answerSaveMessage, setAnswerSaveMessage] = useState("");
  const [answerSaveError, setAnswerSaveError] = useState("");

  // =========================================================================
  // LOAD STUDENT PROFILE & REAL PROGRESS FROM SUPABASE
  // =========================================================================
  useEffect(() => {
    let active = true;

    const loadStudentData = async () => {
      // Purge any malformed JWT tokens stored from legacy test sessions
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
            const raw = localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              const tok = parsed?.access_token;
              if (typeof tok !== "string" || tok.split(".").length !== 3) {
                localStorage.removeItem(key);
              }
            }
          }
        });
      } catch {}

      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession().catch((err) => {
          if (err?.message?.includes("Expected 3 parts in JWT")) {
            try {
              Object.keys(localStorage).forEach((key) => {
                if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
                  localStorage.removeItem(key);
                }
              });
            } catch {}
          }
          return { data: {} };
        });

        const isDev = import.meta.env.DEV;
        let activeSession = currentSession;
        if (!activeSession && isDev && window.location.search.includes("demo_user=rohan")) {
          try {
            const raw = localStorage.getItem("sb-knflbblrypqqjvrhdpzt-auth-token");
            if (raw) activeSession = JSON.parse(raw);
          } catch {}
          if (!activeSession) {
            activeSession = {
              user: {
                id: "e0a1b2c3-d4e5-4f6a-8b9c-0d1e2f3a4b5c",
                user_metadata: {
                  display_name: "Rohan Verma",
                  student_class: "8",
                  preferred_language: "en"
                }
              }
            };
          }
        }

        if (!activeSession) {
          navigate("/login", { replace: true });
          return;
        }

        if (!active) return;
        setUserId(activeSession.user.id);

        const metadata = activeSession.user.user_metadata || {};

        let profileData = null;
        let progressData = [];
        let quizData = [];

        try {
          const results = await Promise.all([
            supabase
              .from("student_profiles")
              .select("display_name, student_class, preferred_language")
              .eq("id", activeSession.user.id)
              .maybeSingle(),

            supabase
              .from("learning_progress")
              .select("lesson_id, progress_percent, completed, updated_at")
              .eq("user_id", activeSession.user.id),

            supabase
              .from("quiz_results")
              .select("quiz_id, score, total_questions, created_at")
              .eq("user_id", activeSession.user.id)
              .order("created_at", { ascending: false })
              .limit(10),
          ]);
          profileData = results[0]?.data;
          progressData = results[1]?.data || [];
          quizData = results[2]?.data || [];
        } catch {
          // Graceful fallback to metadata
        }

        if (!active) return;

        const studentClass = profileData?.student_class || metadata.student_class || "8";
        const formattedClass = studentClass.toString().startsWith("Class")
          ? studentClass
          : `Class ${studentClass}`;

        setProfile(
          profileData || {
            display_name: metadata.display_name || "Student",
            student_class: studentClass,
            preferred_language: metadata.preferred_language || "en",
          }
        );

        setSubjectClassFilter(formattedClass);

        const savedProgress = {};
        (progressData || []).forEach((record) => {
          savedProgress[record.lesson_id] = record;
        });

        setProgressMap(savedProgress);
        setQuizResults(quizData || []);
      } catch (error) {
        if (active) {
          if (error?.message?.includes("Expected 3 parts in JWT")) {
            try {
              Object.keys(localStorage).forEach((key) => {
                if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
                  localStorage.removeItem(key);
                }
              });
            } catch {}
          } else {
            setErrorMessage(error.message || "Could not load student information.");
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadStudentData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const isDev = import.meta.env.DEV;
      if (!session && !(isDev && window.location.search.includes("demo_user=rohan")) && !localStorage.getItem("sb-knflbblrypqqjvrhdpzt-auth-token")) {
        navigate("/login", { replace: true });
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Keep search params in sync with selected subject
  const handleSelectSubject = (subjectId) => {
    setSelectedSubjectId(subjectId);
    if (subjectId) {
      setSearchParams({ subject: subjectId });
    } else {
      setSearchParams({});
    }
  };

  // =========================================================================
  // COMPUTED REAL-TIME SUBJECT PROGRESS
  // =========================================================================
  const subjectProgressMetrics = useMemo(() => {
    const result = {};
    Object.keys(curriculumData).forEach((subjectKey) => {
      const subject = curriculumData[subjectKey];
      let totalActivities = 0;
      let completedInSubject = 0;

      Object.values(subject.classes).forEach((classList) => {
        classList.forEach((activity) => {
          totalActivities += 1;
          const prog = progressMap[activity.lessonId];
          if (prog?.completed) {
            completedInSubject += 1;
          }
        });
      });

      const pct =
        totalActivities > 0
          ? Math.round((completedInSubject / totalActivities) * 100)
          : 0;

      result[subjectKey] = {
        completed: completedInSubject,
        total: totalActivities,
        percentage: pct,
      };
    });
    return result;
  }, [progressMap]);

  // =========================================================================
  // KNOWLEDGE CHECK / LESSON SUBMISSION
  // =========================================================================
  const openActivity = (activity) => {
    if (activity.route) {
      navigate(activity.route);
      return;
    }
    setActiveActivity(activity);
    setSelectedAnswer(null);
    setAnswerSaveMessage("");
    setAnswerSaveError("");
  };

  const closeActivity = () => {
    setActiveActivity(null);
    setSelectedAnswer(null);
    setAnswerSaveMessage("");
    setAnswerSaveError("");
  };

  const handleQuizAnswer = async (answerIndex) => {
    if (!userId || !activeActivity?.lesson || isSavingAnswer) return;

    const lesson = activeActivity.lesson;
    const isCorrect = answerIndex === lesson.correctAnswer;

    setSelectedAnswer(answerIndex);
    setIsSavingAnswer(true);
    setAnswerSaveMessage("Saving your progress to Supabase...");
    setAnswerSaveError("");

    try {
      const { error: progressError } = await supabase
        .from("learning_progress")
        .upsert(
          {
            user_id: userId,
            lesson_id: lesson.id,
            progress_percent: isCorrect ? 100 : 50,
            completed: isCorrect,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,lesson_id" }
        );

      if (progressError) throw progressError;

      const { error: resultError } = await supabase
        .from("quiz_results")
        .insert({
          user_id: userId,
          quiz_id: lesson.id,
          score: isCorrect ? 1 : 0,
          total_questions: 1,
        });

      if (resultError) throw resultError;

      setProgressMap((prev) => ({
        ...prev,
        [lesson.id]: {
          lesson_id: lesson.id,
          progress_percent: isCorrect ? 100 : 50,
          completed: isCorrect,
          updated_at: new Date().toISOString(),
        },
      }));

      setQuizResults((prev) => [
        {
          quiz_id: lesson.id,
          score: isCorrect ? 1 : 0,
          total_questions: 1,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);

      setAnswerSaveMessage("Progress and assessment saved successfully!");
    } catch (err) {
      setAnswerSaveError(err.message || "Could not save result.");
    } finally {
      setIsSavingAnswer(false);
    }
  };

  const activeSubject = selectedSubjectId ? curriculumData[selectedSubjectId] : null;

  if (loading) {
    return (
      <div className="dash-lavender-app">
        <DashboardSidebar
          activeTab="subjects"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          profile={profile}
        />
        <div className="dash-main-viewport">
          <DashboardHeader
            profile={profile}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            pageTitle="Explore STEM Subjects"
            pageSubtitle="Loading curriculum..."
          />
          <main className="dash-content-area" style={{ textAlign: "center", padding: "80px 20px" }}>
            <div className="dash-loading-spinner" aria-hidden="true" />
            <p style={{ marginTop: "16px", color: "#6B7280", fontSize: "15px" }}>
              Loading curriculum & learning progress...
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-lavender-app">
      {/* 1. Left Vertical Navigation Sidebar */}
      <DashboardSidebar
        activeTab="subjects"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profile={profile}
      />

      {/* 2. Main Viewport */}
      <div className="dash-main-viewport">
        {/* Reusable Header */}
        <DashboardHeader
          profile={profile}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          pageTitle="Explore STEM Subjects"
          pageSubtitle="Hands-on 3D labs, interactive simulations, and chapter quizzes for Classes 6 to 10"
        />

        {/* Content Area */}
        <main className="dash-content-area" id="main-content">
          {errorMessage && (
            <div className="dash-alert-banner error" role="alert">
              <strong>Notice:</strong> {errorMessage}
            </div>
          )}

          {/* VIEW A: FOUR REFERENCE-4 SUBJECT CARDS */}
          {!selectedSubjectId && (
            <>
              {/* Subject Selection Intro Banner */}
              <div className="dash-subjects-intro-bar">
                <div>
                  <h2 className="dash-subjects-headline">Choose Your STEM Path</h2>
                  <p className="dash-subjects-subhead">
                    Select a subject to access curriculum chapters, interactive 3D simulations, and assessments.
                  </p>
                </div>
                <div className="dash-enrolled-grade-pill">
                  Enrolled:{" "}
                  <strong>
                    {profile?.student_class?.toString().startsWith("Class")
                      ? profile.student_class
                      : `Class ${profile?.student_class || "6"}`}
                  </strong>
                </div>
              </div>

              {/* Four Clean Subject Cards Grid */}
              <div className="dash-cards-grid-4">
                {Object.values(curriculumData).map((subject) => {
                  const Icon = iconMap[subject.id] || BookOpen;
                  const metrics = subjectProgressMetrics[subject.id] || {
                    completed: 0,
                    total: 1,
                    percentage: 0,
                  };
                  const directLabRoute = labRoutes[subject.id];

                  return (
                    <div
                      key={subject.id}
                      className={`dash-subject-showcase-card theme-${subject.id}`}
                    >
                      <div className="dash-card-top-row">
                        <div className="dash-subject-card-icon-box">
                          <Icon size={24} />
                        </div>
                        <span className="dash-card-grade-badge">Classes 6–10</span>
                      </div>

                      <div className="dash-card-main-content">
                        <h3 className="dash-subject-card-title">{subject.name}</h3>
                        <p className="dash-subject-card-tagline">{subject.tagline}</p>

                        <div className="dash-subject-card-topics">
                          <span className="dash-topics-header">Core Topics:</span>
                          {subject.id === "math" || subject.id === "mathematics" ? (
                            <ul className="dash-topics-bullet-list">
                              <li>• 3D Polyhedrons & Euler's Formula (V-E+F=2)</li>
                              <li>• Number Systems, Fractions & Decimals</li>
                              <li>• Coordinate Geometry & Trigonometry</li>
                            </ul>
                          ) : subject.id === "physics" ? (
                            <ul className="dash-topics-bullet-list">
                              <li>• Electric Circuits & Conductor Simulation</li>
                              <li>• Simple Pendulums, Speed & Motion</li>
                              <li>• Light, Reflection & Refraction Optics</li>
                            </ul>
                          ) : subject.id === "chemistry" ? (
                            <ul className="dash-topics-bullet-list">
                              <li>• 3D Virtual Filtration Lab (Sand & Water)</li>
                              <li>• Atoms, Molecules & Chemical Formulas</li>
                              <li>• Acids, Bases & Natural Indicators</li>
                            </ul>
                          ) : (
                            <ul className="dash-topics-bullet-list">
                              <li>• Plant & Animal Cell Organelle Explorer</li>
                              <li>• Photosynthesis & Transpiration</li>
                              <li>• Human Circulatory System & Respiration</li>
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* Real Progress Indicator */}
                      <div className="dash-card-progress-section">
                        <div className="dash-card-progress-meta">
                          <span>Mastery</span>
                          <strong>
                            {metrics.completed > 0 ? `${metrics.percentage}%` : "Not started yet"}
                          </strong>
                        </div>
                        <div className="dash-card-progress-bar-bg">
                          <div
                            className="dash-card-progress-bar-fill"
                            style={{ width: `${metrics.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="dash-card-action-row">
                        <button
                          type="button"
                          className="dash-btn-explore-subject"
                          onClick={() => handleSelectSubject(subject.id)}
                        >
                          Explore Chapters <ChevronRight size={16} />
                        </button>

                        {directLabRoute && (
                          <Link
                            to={directLabRoute}
                            className="dash-btn-direct-lab"
                            title={`Launch ${subject.name} Lab`}
                          >
                            <FlaskConical size={14} /> Enter Lab
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* VIEW B: DETAILED CHAPTERS & ACTIVITIES FOR SELECTED SUBJECT */}
          {activeSubject && (
            <div className="dash-subject-detail-view">
              {/* Detail Hero Header */}
              <div className={`dash-detail-hero theme-${activeSubject.id}`}>
                <div className="dash-detail-hero-left">
                  <button
                    type="button"
                    className="dash-btn-back-all"
                    onClick={() => handleSelectSubject(null)}
                  >
                    <ChevronLeft size={16} /> Back to all subjects
                  </button>
                  <h2 className="dash-detail-hero-title">
                    {activeSubject.name} Curriculum Hub
                  </h2>
                  <p className="dash-detail-hero-desc">{activeSubject.tagline}</p>
                </div>

                <div className="dash-detail-hero-stat">
                  <span className="dash-stat-caption">Subject Mastery</span>
                  <div className="dash-stat-huge">
                    {(subjectProgressMetrics[activeSubject.id]?.completed || 0) > 0
                      ? `${subjectProgressMetrics[activeSubject.id]?.percentage}%`
                      : "Not started yet"}
                  </div>
                  <span className="dash-stat-sub">
                    {subjectProgressMetrics[activeSubject.id]?.completed || 0} of{" "}
                    {subjectProgressMetrics[activeSubject.id]?.total || 0} activities completed
                  </span>
                </div>
              </div>

              {/* Grade Selection Tabs */}
              <div className="dash-grade-tabs-bar" role="tablist">
                <span className="dash-grade-tabs-label">Select Grade:</span>
                {["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    role="tab"
                    aria-selected={subjectClassFilter === cls}
                    className={`dash-grade-tab-btn ${
                      subjectClassFilter === cls ? "active" : ""
                    }`}
                    onClick={() => setSubjectClassFilter(cls)}
                  >
                    {cls}
                  </button>
                ))}
              </div>

              {/* Chapters & Activities Grid */}
              <div className="dash-chapters-cards-grid">
                {(activeSubject.classes[subjectClassFilter] || []).length === 0 ? (
                  <div className="dash-chapters-empty-state">
                    <p>Chapters for {subjectClassFilter} are currently being added.</p>
                  </div>
                ) : (
                  activeSubject.classes[subjectClassFilter].map((activity) => {
                    const savedProg = progressMap[activity.lessonId];
                    const isDone = savedProg?.completed;

                    return (
                      <div key={activity.id} className="dash-chapter-card">
                        <div className="dash-chapter-card-header">
                          <span className="dash-activity-type-pill">{activity.type}</span>
                          <span
                            className={`dash-activity-status-pill ${
                              isDone ? "completed" : savedProg ? "in-progress" : "pending"
                            }`}
                          >
                            {isDone
                              ? "✓ Completed (100%)"
                              : savedProg
                              ? "⏳ In Progress"
                              : "○ Not Started"}
                          </span>
                        </div>

                        <span className="dash-chapter-name-tag">{activity.chapter}</span>
                        <h4 className="dash-activity-title">{activity.topic}</h4>
                        <p className="dash-activity-description">{activity.description}</p>

                        <div className="dash-chapter-card-footer">
                          {activity.route ? (
                            <Link to={activity.route} className="dash-act-btn primary">
                              <FlaskConical size={15} /> Enter 3D Lab
                            </Link>
                          ) : (
                            <button
                              type="button"
                              className="dash-act-btn primary"
                              onClick={() => openActivity(activity)}
                            >
                              <BookOpen size={15} /> Start Activity
                            </button>
                          )}

                          {activity.quizRoute ? (
                            <Link to={activity.quizRoute} className="dash-act-btn secondary">
                              <Award size={15} /> Take Quiz
                            </Link>
                          ) : (
                            <Link to="/quiz" className="dash-act-btn secondary">
                              <Award size={15} /> Quiz
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Subject-Specific AI Doubt Assistant */}
              <div className="dash-subject-doubt-wrap">
                <DoubtSection
                  initialSubject={activeSubject.name}
                  initialClassLevel={subjectClassFilter}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Knowledge Check Modal */}
      {activeActivity && activeActivity.lesson && (
        <div className="dash-modal-overlay" onClick={closeActivity} role="dialog" aria-modal="true">
          <div className="dash-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="dash-modal-close"
              onClick={closeActivity}
              aria-label="Close activity"
            >
              <X size={18} />
            </button>

            <span className="dash-modal-eyebrow">
              {activeActivity.chapter} · {subjectClassFilter}
            </span>

            <h3 className="dash-modal-title">{activeActivity.lesson.title}</h3>
            <p className="dash-modal-intro">{activeActivity.lesson.introduction}</p>

            <div className="dash-modal-takeaways">
              <h5>Key Learning Takeaways:</h5>
              <ul>
                {activeActivity.lesson.points.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>

            <div className="dash-modal-quiz-section">
              <span className="dash-quiz-badge">Quick Knowledge Check</span>
              <p className="dash-quiz-prompt">{activeActivity.lesson.question}</p>

              <div className="dash-quiz-choices">
                {activeActivity.lesson.options.map((option, idx) => {
                  let optClass = "dash-quiz-choice-btn";
                  if (selectedAnswer !== null) {
                    if (idx === activeActivity.lesson.correctAnswer) {
                      optClass += " correct";
                    } else if (idx === selectedAnswer) {
                      optClass += " wrong";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={optClass}
                      disabled={selectedAnswer !== null || isSavingAnswer}
                      onClick={() => handleQuizAnswer(idx)}
                    >
                      <span className="dash-choice-letter">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="dash-choice-text">{option}</span>
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div
                  className={`dash-quiz-feedback-box ${
                    selectedAnswer === activeActivity.lesson.correctAnswer
                      ? "success"
                      : "error"
                  }`}
                >
                  <strong>
                    {selectedAnswer === activeActivity.lesson.correctAnswer
                      ? "✓ Correct! Well done!"
                      : "✗ Not quite right."}
                  </strong>
                  <p>
                    {selectedAnswer === activeActivity.lesson.correctAnswer
                      ? activeActivity.lesson.explanation
                      : "Review the key learning takeaways above and try another attempt."}
                  </p>
                </div>
              )}

              {answerSaveMessage && (
                <div className="dash-save-status success">{answerSaveMessage}</div>
              )}

              {answerSaveError && (
                <div className="dash-save-status error">{answerSaveError}</div>
              )}

              {selectedAnswer !== null &&
                selectedAnswer !== activeActivity.lesson.correctAnswer && (
                  <button
                    type="button"
                    className="dash-btn-retry"
                    onClick={() => {
                      setSelectedAnswer(null);
                      setAnswerSaveMessage("");
                      setAnswerSaveError("");
                    }}
                  >
                    <RotateCcw size={15} /> Try Again
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

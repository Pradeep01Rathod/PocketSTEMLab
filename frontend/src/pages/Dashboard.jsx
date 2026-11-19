import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FlaskConical,
  Zap,
  Microscope,
  Shapes,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  RotateCcw,
  X,
  BookOpen,
  Award,
  Atom,
  Trophy,
  Compass,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { curriculumData, languageNames } from "../data/curriculumData";
import { quizBank } from "../data/quizData";
import { useLanguage } from "../i18n/LanguageContext";
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

const LESSON_TITLES = {
  "chemistry-filtration": "Chemistry: 3D Filtration Lab",
  "physics-circuit": "Physics: Electric Circuit Lab",
  "biology-cell": "Biology: Plant Cell Microscope Lab",
  "math-shapes": "Mathematics: 3D Polyhedrons & Euler's Formula",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();

  // Navigation drawer for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Student Profile & Data States
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Interactive Lesson Modal / Knowledge Check State
  const [activeActivity, setActiveActivity] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [answerSaveMessage, setAnswerSaveMessage] = useState("");
  const [answerSaveError, setAnswerSaveError] = useState("");

  // =========================================================================
  // 1. LOAD STUDENT PROFILE AND SAVED PROGRESS FROM SUPABASE
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
        // In local development mode only, support test session parameter
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
          // Graceful fallback to metadata if offline
        }

        if (!active) return;

        const studentClass = profileData?.student_class || metadata.student_class || "6";

        setProfile(
          profileData || {
            display_name: metadata.display_name || "Student",
            student_class: studentClass,
            preferred_language: metadata.preferred_language || "en",
          }
        );

        // Map progress records by lesson_id for instant O(1) lookup
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

    // Listen to Supabase auth state transitions
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

  // =========================================================================
  // 2. COMPUTED REAL-TIME METRICS (100% REAL SUPABASE DATA - NO FAKE DATA)
  // =========================================================================
  const metrics = useMemo(() => {
    // 1. Completed Experiments (from learning_progress where completed = true)
    const completedExperimentsCount = Object.values(progressMap).filter(
      (p) => p.completed
    ).length;

    // 2. Completed Quizzes (count of submissions in quiz_results)
    const completedQuizzesCount = quizResults.length;

    // 3. Learning Activities (total distinct lesson activities started or completed)
    const learningActivitiesCount = Object.keys(progressMap).length;
    const inProgressCount = Object.values(progressMap).filter((p) => !p.completed).length;

    // 4. Average Quiz Score (sum of scores / sum of total questions)
    let totalScore = 0;
    let totalPossible = 0;
    quizResults.forEach((q) => {
      totalScore += q.score || 0;
      totalPossible += q.total_questions || 1;
    });

    const averageQuizPct =
      totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : null;

    // 5. Enrolled Class Overall Progress
    const rawClass = profile?.student_class || "6";
    const formattedClass = rawClass.toString().startsWith("Class")
      ? rawClass
      : `Class ${rawClass}`;

    let totalClassActivities = 0;
    let completedClassActivities = 0;

    Object.values(curriculumData).forEach((subject) => {
      const classList = subject.classes[formattedClass] || [];
      classList.forEach((activity) => {
        totalClassActivities += 1;
        if (progressMap[activity.lessonId]?.completed) {
          completedClassActivities += 1;
        }
      });
    });

    const overallProgress =
      totalClassActivities > 0
        ? Math.round((completedClassActivities / totalClassActivities) * 100)
        : null;

    // 6. Subject-wise completion rates (honest denominators)
    const subjectProgress = {};
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

      subjectProgress[subjectKey] = {
        completed: completedInSubject,
        total: totalActivities,
        percentage: pct,
        hasStarted: completedInSubject > 0 || Object.keys(progressMap).some((id) => id.startsWith(subjectKey)),
      };
    });

    return {
      completedExperiments: completedExperimentsCount,
      completedQuizzes: completedQuizzesCount,
      learningActivities: learningActivitiesCount,
      completedActivitiesCount: completedExperimentsCount,
      inProgressCount,
      averageQuizScore: averageQuizPct,
      overallProgress,
      totalClassActivities,
      completedClassActivities,
      formattedClass,
      subjectProgress,
    };
  }, [progressMap, quizResults, profile]);

  // =========================================================================
  // 3. CONTINUE LEARNING RESOLUTION (ACTUAL SAVED DATA ONLY)
  // =========================================================================
  const continueLearningItem = useMemo(() => {
    // Check if 3D filtration completed and quiz not taken yet
    const chemFiltration = progressMap["chemistry-filtration"];
    if (chemFiltration?.completed) {
      const quizDone = quizResults.some((q) => q.quiz_id === "chemistry_filtration");
      if (!quizDone) {
        return {
          hasHistory: true,
          title: "Take Chemistry Filtration Quiz",
          subjectName: "Chemistry",
          description: "You finished the 3D filtration experiment! Test your knowledge on residues, funnels, and filtrates.",
          route: "/quiz",
          btnLabel: "Start Quiz",
          badge: "Ready for Assessment",
        };
      }
    }

    // Check for in-progress or recently accessed activities
    const progressEntries = Object.entries(progressMap);
    if (progressEntries.length > 0) {
      const lastEntry = progressEntries[progressEntries.length - 1];
      const lessonId = lastEntry[0];

      for (const sub of Object.values(curriculumData)) {
        for (const classActs of Object.values(sub.classes)) {
          const matched = classActs.find((a) => a.lessonId === lessonId);
          if (matched) {
            return {
              hasHistory: true,
              title: matched.topic,
              subjectName: sub.name,
              description: matched.description,
              activity: matched,
              btnLabel: lastEntry[1]?.completed ? "Review Activity" : "Resume Activity",
              badge: lastEntry[1]?.completed ? "Completed" : "In Progress",
            };
          }
        }
      }
    }

    // Honest empty state when no activity exists yet
    return {
      hasHistory: false,
      title: "Your learning journey starts here.",
      subjectName: "EduSpark STEM",
      description: "Choose a subject to begin your first interactive lesson, virtual experiment, or chapter assessment.",
      route: "/subjects",
      btnLabel: "Explore Subjects",
      badge: "Get Started",
    };
  }, [progressMap, quizResults]);

  // =========================================================================
  // 4. KNOWLEDGE CHECK & ACTIVITY SUBMISSION HANDLER
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

  // =========================================================================
  // 5. LOADING STATE
  // =========================================================================
  if (loading) {
    return (
      <div className="dash-lavender-app">
        <DashboardSidebar
          activeTab="dashboard"
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          profile={profile}
        />
        <div className="dash-main-viewport">
          <DashboardHeader
            profile={profile}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            pageTitle="EduSpark Student Dashboard"
            pageSubtitle="Loading your profile and learning metrics..."
          />
          <main className="dash-content-area" style={{ textAlign: "center", padding: "80px 20px" }}>
            <div className="dash-loading-spinner" aria-hidden="true" />
            <p style={{ marginTop: "16px", color: "#6B7280", fontSize: "15px" }}>
              Synchronizing learning progress with Supabase...
            </p>
          </main>
        </div>
      </div>
    );
  }

  const studentName = profile?.display_name || "Student";
  const formattedClass = profile?.student_class?.toString().startsWith("Class")
    ? profile.student_class
    : `Class ${profile?.student_class || "6"}`;

  return (
    <div className="dash-lavender-app">
      {/* 1. Left Vertical Navigation Sidebar */}
      <DashboardSidebar
        activeTab="dashboard"
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
          pageTitle={`Welcome back, ${studentName}!`}
          pageSubtitle="Your personalized STEM learning dashboard & real-time progress"
        />

        {/* Content Area */}
        <main className="dash-content-area" id="main-content">
          {errorMessage && (
            <div className="dash-alert-banner error" role="alert">
              <strong>Notice:</strong> {errorMessage}
            </div>
          )}

          {/* 1. LARGE STUDENT WELCOME BANNER (REFERENCE 3 DESIGN) */}
          <section className="dash-lavender-hero-banner">
            <div className="dash-hero-text-col">
              <div className="dash-hero-eyebrow">
                <Sparkles size={14} /> Interactive STEM Laboratory
              </div>
              <h2 className="dash-hero-title">
                Hello, <span>{studentName}</span>! 👋
              </h2>
              <p className="dash-hero-desc">
                {t(
                  "dash_welcome_sub",
                  "Explore interactive 3D laboratories, build simulated electrical circuits, discover plant cell structures, and master spatial mathematics at your own pace."
                )}
              </p>

              {/* Meta Chips */}
              <div className="dash-hero-meta-row">
                <span className="dash-hero-meta-chip">
                  <BookOpen size={14} color="#C4B5FD" />
                  <span>Enrolled: <strong>{formattedClass}</strong></span>
                </span>
                <span className="dash-hero-meta-chip">
                  <Atom size={14} color="#C4B5FD" />
                  <span>Medium: <strong>{languageNames[currentLanguage] || "English"}</strong></span>
                </span>
                <span className="dash-hero-meta-chip">
                  <CheckCircle2 size={14} color="#C4B5FD" />
                  <span>Status: <strong>Active Learner</strong></span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="dash-hero-cta-row">
                <Link to="/subjects" className="dash-btn-hero-primary">
                  <span>Explore Subjects</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/chemistry-lab" className="dash-btn-hero-secondary">
                  <FlaskConical size={16} />
                  <span>Launch 3D Lab</span>
                </Link>
              </div>
            </div>

            {/* Student Illustration */}
            <div className="dash-hero-image-col">
              <img
                src="/crafto/demo-elearning-05.png"
                alt="Student learning with EduSpark"
                className="dash-hero-student-img"
              />
            </div>
          </section>

          {/* 2. REAL METRIC STAT CARDS (NO FAKE DATA) */}
          <section className="dash-stats-row-4" id="my-progress">
            {/* Metric 1: Completed Experiments */}
            <div className="dash-stat-bubble theme-purple">
              <div className="dash-stat-bubble-icon">
                <FlaskConical size={22} />
              </div>
              <div className="dash-stat-bubble-data">
                <span className="dash-stat-bubble-number">{metrics.completedExperiments}</span>
                <span className="dash-stat-bubble-label">Completed Experiments</span>
              </div>
            </div>

            {/* Metric 2: Completed Quizzes */}
            <div className="dash-stat-bubble theme-amber">
              <div className="dash-stat-bubble-icon">
                <Award size={22} />
              </div>
              <div className="dash-stat-bubble-data">
                <span className="dash-stat-bubble-number">{metrics.completedQuizzes}</span>
                <span className="dash-stat-bubble-label">Completed Quizzes</span>
              </div>
            </div>

            {/* Metric 3: Learning Activities */}
            <div className="dash-stat-bubble theme-blue">
              <div className="dash-stat-bubble-icon">
                <BookOpen size={22} />
              </div>
              <div className="dash-stat-bubble-data">
                <span className="dash-stat-bubble-number">{metrics.learningActivities}</span>
                <span className="dash-stat-bubble-label">Learning Activities</span>
              </div>
            </div>

            {/* Metric 4: Overall Progress */}
            <div className="dash-stat-bubble theme-emerald">
              <div className="dash-stat-bubble-icon">
                <CheckCircle2 size={22} />
              </div>
              <div className="dash-stat-bubble-data">
                <span className="dash-stat-bubble-number">
                  {metrics.overallProgress !== null ? `${metrics.overallProgress}%` : "Not started yet"}
                </span>
                <span className="dash-stat-bubble-label">
                  Overall Progress ({metrics.formattedClass})
                </span>
              </div>
            </div>

            {/* Metric 5 (Additional): Average Quiz Score */}
            <div className="dash-stat-bubble theme-purple">
              <div className="dash-stat-bubble-icon">
                <Sparkles size={22} />
              </div>
              <div className="dash-stat-bubble-data">
                <span className="dash-stat-bubble-number">
                  {metrics.averageQuizScore !== null ? `${metrics.averageQuizScore}%` : "—"}
                </span>
                <span className="dash-stat-bubble-label">Average Quiz Score</span>
              </div>
            </div>
          </section>

          {/* 3. CONTINUE LEARNING CALLOUT */}
          <section className="dash-continue-learning-card">
            <div className="dash-continue-left">
              <div className="dash-continue-badge-icon">
                {continueLearningItem.hasHistory ? <Clock size={20} /> : <Compass size={20} />}
              </div>
              <div className="dash-continue-info">
                <div className="dash-continue-header-line">
                  <span className="dash-continue-tag">{continueLearningItem.badge}</span>
                  <span className="dash-continue-subject">{continueLearningItem.subjectName}</span>
                </div>
                <h4 className="dash-continue-title">{continueLearningItem.title}</h4>
                <p className="dash-continue-desc">{continueLearningItem.description}</p>
              </div>
            </div>

            <div className="dash-continue-action">
              {continueLearningItem.route ? (
                <Link to={continueLearningItem.route} className="dash-btn-continue-action">
                  <span>{continueLearningItem.btnLabel}</span>
                  <ArrowRight size={15} />
                </Link>
              ) : continueLearningItem.activity ? (
                <button
                  type="button"
                  className="dash-btn-continue-action"
                  onClick={() => openActivity(continueLearningItem.activity)}
                >
                  <span>{continueLearningItem.btnLabel}</span>
                  <ArrowRight size={15} />
                </button>
              ) : null}
            </div>
          </section>

          {/* 4. SUBJECT PROGRESS CARDS (REFERENCE 3 STYLE) */}
          <section className="dash-subject-progress-section" id="subjects">
            <div className="dash-section-title-bar">
              <div>
                <h3 className="dash-section-h3">Core STEM Subjects</h3>
                <p className="dash-section-p">
                  Interactive simulations, guided laboratories, and assessments.
                </p>
              </div>
              <Link to="/subjects" className="dash-link-view-all">
                View All Subjects <ChevronRight size={16} />
              </Link>
            </div>

            <div className="dash-subject-progress-grid">
              {Object.values(curriculumData).map((subject) => {
                const Icon = iconMap[subject.id] || BookOpen;
                const prog = metrics.subjectProgress[subject.id] || {
                  completed: 0,
                  total: 1,
                  percentage: 0,
                  hasStarted: false,
                };

                return (
                  <div key={subject.id} className={`dash-subj-prog-card theme-${subject.id}`}>
                    <div className="dash-subj-prog-top">
                      <div className="dash-subj-prog-icon">
                        <Icon size={20} />
                      </div>
                      <span className="dash-subj-prog-percent">
                        {prog.completed > 0 ? `${prog.percentage}%` : "Not started yet"}
                      </span>
                    </div>

                    <h4 className="dash-subj-prog-name">{subject.name}</h4>
                    <p className="dash-subj-prog-desc">{subject.tagline}</p>

                    <div className="dash-subj-prog-bar-bg">
                      <div
                        className="dash-subj-prog-bar-fill"
                        style={{ width: `${prog.percentage}%` }}
                      />
                    </div>

                    <div className="dash-subj-prog-footer">
                      <span className="dash-subj-prog-count">
                        {prog.completed > 0
                          ? `${prog.completed} of ${prog.total} completed`
                          : "Not started yet"}
                      </span>
                      <Link
                        to={`/subjects?subject=${subject.id}`}
                        className="dash-subj-prog-link"
                      >
                        Explore <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5. BOTTOM GRID: RECENT ACTIVITY & RECOMMENDED LABS */}
          <div className="dash-bottom-grid-2col" id="recent-activity">
            {/* Column A: Recent Learning Activity */}
            <section className="dash-white-card-panel">
              <div className="dash-panel-header">
                <div className="dash-panel-header-icon theme-purple">
                  <Trophy size={18} />
                </div>
                <div>
                  <h4 className="dash-panel-title">Recent Learning Activity</h4>
                  <p className="dash-panel-sub">Verified Supabase database records</p>
                </div>
              </div>

              {quizResults.length === 0 && Object.keys(progressMap).length === 0 ? (
                <div className="dash-empty-activity-box">
                  <div className="dash-empty-icon-wrap">📝</div>
                  <h5 className="dash-empty-heading">No Activity Recorded Yet</h5>
                  <p className="dash-empty-text">
                    Start your first hands-on experiment or take a quiz to record your learning progress here.
                  </p>
                  <Link to="/chemistry-lab" className="dash-btn-empty-start">
                    Start 3D Chemistry Lab
                  </Link>
                </div>
              ) : (
                <div className="dash-recent-events-list">
                  {/* Real Experiment Progress */}
                  {Object.values(progressMap).map((item) => (
                    <div key={item.lesson_id} className="dash-recent-event-row">
                      <div className="dash-event-left">
                        <div className="dash-event-indicator completed">
                          <CheckCircle2 size={16} />
                        </div>
                        <div className="dash-event-info">
                          <h5 className="dash-event-title">
                            {LESSON_TITLES[item.lesson_id] ||
                              item.lesson_id
                                .replace(/[_-]/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                          </h5>
                          <span className="dash-event-date">
                            {item.completed
                              ? "Experiment Completed (100%)"
                              : "In Progress (50%)"}
                          </span>
                        </div>
                      </div>
                      <span className={`dash-event-pill ${item.completed ? "high" : "mid"}`}>
                        {item.completed ? "100%" : "50%"}
                      </span>
                    </div>
                  ))}

                  {/* Real Quiz Results */}
                  {quizResults.map((q, idx) => (
                    <div key={idx} className="dash-recent-event-row">
                      <div className="dash-event-left">
                        <div className="dash-event-indicator quiz">
                          <Award size={16} />
                        </div>
                        <div className="dash-event-info">
                          <h5 className="dash-event-title">
                            Quiz:{" "}
                            {quizBank[q.quiz_id]?.title ||
                              q.quiz_id
                                .replace(/[_-]/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                          </h5>
                          <span className="dash-event-date">
                            Score: {q.score} / {q.total_questions} questions
                          </span>
                        </div>
                      </div>
                      <span
                        className={`dash-event-pill ${
                          q.score === q.total_questions ? "high" : "mid"
                        }`}
                      >
                        {Math.round((q.score / (q.total_questions || 1)) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Column B: Recommended For You */}
            <section className="dash-white-card-panel">
              <div className="dash-panel-header">
                <div className="dash-panel-header-icon theme-blue">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="dash-panel-title">Recommended STEM Labs</h4>
                  <p className="dash-panel-sub">Curriculum-aligned virtual environments</p>
                </div>
              </div>

              <div className="dash-recommendations-list">
                <div className="dash-rec-card theme-chemistry">
                  <div className="dash-rec-card-body">
                    <span className="dash-rec-tag theme-chemistry">3D Virtual Lab</span>
                    <h5 className="dash-rec-title">Virtual 3D Filtration Lab</h5>
                    <p className="dash-rec-desc">
                      Separate sand from water in real-time 3D with interactive glassware.
                    </p>
                  </div>
                  <Link to="/chemistry-lab" className="dash-btn-rec-action">
                    Launch Lab <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="dash-rec-card theme-physics">
                  <div className="dash-rec-card-body">
                    <span className="dash-rec-tag theme-physics">Physics Simulation</span>
                    <h5 className="dash-rec-title">Electric Circuit & Conductor Lab</h5>
                    <p className="dash-rec-desc">
                      Test batteries, switches, and materials in a live simulated circuit.
                    </p>
                  </div>
                  <Link to="/stem-lab/physics" className="dash-btn-rec-action">
                    Launch Lab <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="dash-rec-card theme-math">
                  <div className="dash-rec-card-body">
                    <span className="dash-rec-tag theme-math">3D Geometry</span>
                    <h5 className="dash-rec-title">Euler's Formula & 3D Shapes</h5>
                    <p className="dash-rec-desc">
                      Interact with polyhedrons in 3D to explore V - E + F = 2.
                    </p>
                  </div>
                  <Link to="/stem-lab/mathematics" className="dash-btn-rec-action">
                    Launch Lab <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="dash-rec-card theme-biology">
                  <div className="dash-rec-card-body">
                    <span className="dash-rec-tag theme-biology">Microscope Explorer</span>
                    <h5 className="dash-rec-title">Plant Cell Explorer Lab</h5>
                    <p className="dash-rec-desc">
                      Examine plant cell organelles under interactive microscope zoom.
                    </p>
                  </div>
                  <Link to="/stem-lab/biology" className="dash-btn-rec-action">
                    Launch Lab <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* 6. EMBEDDED AI DOUBT ASSISTANT */}
          <section className="dash-doubt-section-wrap" id="ai-doubts">
            <DoubtSection
              initialClassLevel={profile?.student_class ? `Class ${profile.student_class}` : "Class 6"}
            />
          </section>
        </main>
      </div>

      {/* 3. Embedded Activity / Knowledge Check Modal */}
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
              {activeActivity.chapter} · {formattedClass}
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

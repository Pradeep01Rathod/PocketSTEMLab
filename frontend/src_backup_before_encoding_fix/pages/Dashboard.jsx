
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Auth.css";

const subjects = [
  {
    id: "math",
    name: "Mathematics",
    emoji: "ðŸ“",
    description: "Explore numbers, shapes and geometry.",
    lesson: {
      id: "math-shapes",
      title: "Understanding 2D and 3D Shapes",
      introduction:
        "A 2D shape has two dimensions: length and width. A 3D shape has three dimensions: length, width and height.",
      points: [
        "A square is a 2D shape.",
        "A cube is a 3D shape.",
        "A cube has 6 faces, 12 edges and 8 vertices.",
        "A sphere is a 3D shape with a curved surface.",
      ],
      question: "Which of these is a 3D shape?",
      options: ["Square", "Triangle", "Cube", "Rectangle"],
      correctAnswer: 2,
      explanation:
        "A cube is a 3D shape because it has length, width and height.",
    },
  },
  {
    id: "biology",
    name: "Biology",
    emoji: "ðŸŒ±",
    description: "Discover cells and living organisms.",
    lesson: {
      id: "biology-cell",
      title: "Introduction to Plant Cells",
      introduction:
        "A plant cell is the basic structural unit of a plant. It contains different parts called organelles that perform important functions.",
      points: [
        "The cell wall supports and protects the plant cell.",
        "The cell membrane controls what enters and leaves the cell.",
        "The nucleus contains genetic information.",
        "Chloroplasts help plants make food using sunlight.",
        "The vacuole stores water and other materials.",
      ],
      question:
        "Which cell part helps plants make food using sunlight?",
      options: ["Nucleus", "Chloroplast", "Cell wall", "Vacuole"],
      correctAnswer: 1,
      explanation:
        "Chloroplasts contain chlorophyll and help plants carry out photosynthesis.",
    },
  },
  {
    id: "chemistry",
    name: "Chemistry",
    emoji: "ðŸ§ª",
    description: "Explore atoms and molecules.",
    lesson: {
      id: "chemistry-atoms",
      title: "Introduction to Atoms and Molecules",
      introduction:
        "All ordinary matter is made of tiny particles called atoms. Atoms can join together to form molecules.",
      points: [
        "An atom is a basic unit of an element.",
        "The centre of an atom is called the nucleus.",
        "The nucleus contains protons and neutrons.",
        "Electrons are found around the nucleus.",
        "A water molecule contains two hydrogen atoms and one oxygen atom.",
      ],
      question: "What is the chemical formula of water?",
      options: ["CO2", "O2", "H2O", "NaCl"],
      correctAnswer: 2,
      explanation:
        "H2O represents a water molecule containing two hydrogen atoms and one oxygen atom.",
    },
  },
  {
    id: "physics",
    name: "Physics",
    emoji: "âš¡",
    description: "Understand energy, motion and electricity.",
    lesson: {
      id: "physics-circuit",
      title: "Understanding a Simple Electric Circuit",
      introduction:
        "An electric circuit is a path through which electric current can flow. A simple circuit can contain a battery, connecting wires, a switch and a bulb.",
      points: [
        "A battery provides electrical energy.",
        "Wires connect the components.",
        "A switch can open or close the circuit.",
        "A closed circuit provides a complete path for current.",
        "A bulb can glow when the circuit is complete and working.",
      ],
      question: "When can current flow through a simple circuit?",
      options: [
        "When the circuit is open",
        "When the path is complete",
        "When a wire is disconnected",
        "When the switch breaks the circuit",
      ],
      correctAnswer: 1,
      explanation:
        "Current can flow when the circuit has a complete conducting path.",
    },
  },
];

const languageNames = {
  en: "English",
  kn: "à²•à²¨à³à²¨à²¡",
  hi: "à¤¹à¤¿à¤¨à¥à¤¦à¥€",
  ta: "à®¤à®®à®¿à®´à¯",
};

function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [progressMap, setProgressMap] = useState({});

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  // LOAD STUDENT PROFILE AND SAVED PROGRESS
  useEffect(() => {
    let active = true;

    const loadStudentData = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          navigate("/login", { replace: true });
          return;
        }

        if (!active) return;

        setUserId(session.user.id);

        const metadata = session.user.user_metadata || {};

        const [
          { data: profileData, error: profileError },
          { data: progressData, error: progressError },
        ] = await Promise.all([
          supabase
            .from("student_profiles")
            .select(
              "display_name, student_class, preferred_language"
            )
            .eq("id", session.user.id)
            .maybeSingle(),

          supabase
            .from("learning_progress")
            .select("lesson_id, progress_percent, completed")
            .eq("user_id", session.user.id),
        ]);

        if (profileError) throw profileError;
        if (progressError) throw progressError;

        if (!active) return;

        setProfile(
          profileData || {
            display_name: metadata.display_name || "Student",
            student_class: metadata.student_class || null,
            preferred_language:
              metadata.preferred_language || "en",
          }
        );

        const savedProgress = {};

        (progressData || []).forEach((record) => {
          savedProgress[record.lesson_id] = record;
        });

        setProgressMap(savedProgress);
      } catch (error) {
        if (active) {
          setErrorMessage(
            error.message || "Could not load student information."
          );
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
      if (!session) {
        navigate("/login", { replace: true });
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // LOGOUT
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    navigate("/login", { replace: true });
  };

  // OPEN SUBJECT
  const openSubject = (subject) => {
    setSelectedSubject(subject);
    setSelectedAnswer(null);
    setSaveMessage("");
    setSaveError("");
  };

  // RETURN TO DASHBOARD
  const goBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedAnswer(null);
    setSaveMessage("");
    setSaveError("");
  };

  // SAVE QUIZ RESULT AND LESSON PROGRESS
  const handleAnswer = async (answerIndex) => {
    if (!userId || !selectedSubject || isSaving) {
      return;
    }

    const lesson = selectedSubject.lesson;
    const isCorrect = answerIndex === lesson.correctAnswer;

    setSelectedAnswer(answerIndex);
    setIsSaving(true);
    setSaveMessage("Saving your answer...");
    setSaveError("");

    try {
      // Save or update lesson progress.
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
          {
            onConflict: "user_id,lesson_id",
          }
        );

      if (progressError) {
        throw progressError;
      }

      // Save this quiz attempt.
      const { error: resultError } = await supabase
        .from("quiz_results")
        .insert({
          user_id: userId,
          quiz_id: lesson.id,
          score: isCorrect ? 1 : 0,
          total_questions: 1,
        });

      if (resultError) {
        throw resultError;
      }

      // Update the dashboard immediately.
      setProgressMap((previous) => ({
        ...previous,
        [lesson.id]: {
          lesson_id: lesson.id,
          progress_percent: isCorrect ? 100 : 50,
          completed: isCorrect,
        },
      }));

      setSaveMessage(
        "Your quiz result and learning progress were saved!"
      );
    } catch (error) {
      setSaveMessage("");
      setSaveError(
        error.message || "Could not save your result. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ALLOW STUDENT TO TRY AGAIN AFTER A WRONG ANSWER
  const tryAgain = () => {
    setSelectedAnswer(null);
    setSaveMessage("");
    setSaveError("");
  };

  if (loading) {
    return (
      <main className="auth-page">
        <div className="dashboard-card">
          <h2>Loading your dashboard...</h2>
        </div>
      </main>
    );
  }

  const lesson = selectedSubject?.lesson;
  const isCorrect =
    lesson && selectedAnswer === lesson.correctAnswer;

  return (
    <main className="auth-page">
      <section className="dashboard-card">

        {/* HEADER */}
        <div className="dashboard-top">
          <div>
            <p className="auth-eyebrow">EduSpark</p>

            <h1>
              {selectedSubject
                ? "Learning Centre"
                : "Student Dashboard"}
            </h1>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {errorMessage && (
          <p className="auth-message auth-error" role="alert">
            {errorMessage}
          </p>
        )}

        {/* MAIN STUDENT DASHBOARD */}
        {!selectedSubject && (
          <>
            <div className="student-welcome">
              <span className="student-avatar">ðŸŽ“</span>

              <div>
                <h2>
                  Welcome, {profile?.display_name || "Student"}!
                </h2>

                <p>Your learning journey starts here.</p>
              </div>
            </div>

            <div className="profile-grid">
              <div className="profile-item">
                <span>Student name</span>
                <strong>
                  {profile?.display_name || "Student"}
                </strong>
              </div>

              <div className="profile-item">
                <span>Class</span>
                <strong>
                  {profile?.student_class
                    ? `Class ${profile.student_class}`
                    : "Not selected"}
                </strong>
              </div>

              <div className="profile-item">
                <span>Preferred language</span>
                <strong>
                  {languageNames[profile?.preferred_language] ||
                    profile?.preferred_language ||
                    "English"}
                </strong>
              </div>
            </div>

            <h3 className="dashboard-section-title">
              Your learning subjects
            </h3>

            <p className="learning-description">
              Select a subject to open its lesson and test your knowledge.
            </p>

            <div className="dashboard-subjects">
              {subjects.map((subject) => {
                const saved = progressMap[subject.lesson.id];

                return (
                  <button
                    key={subject.id}
                    className="learning-subject-card"
                    onClick={() => openSubject(subject)}
                  >
                    <span className="learning-subject-emoji">
                      {subject.emoji}
                    </span>

                    <span className="learning-subject-info">
                      <strong>{subject.name}</strong>
                      <small>{subject.description}</small>

                      <small className="learning-progress-label">
                        {saved?.completed
                          ? "Completed Â· 100%"
                          : saved?.progress_percent
                            ? `In progress Â· ${saved.progress_percent}%`
                            : "Not started"}
                      </small>
                    </span>

                    <span className="learning-arrow">â†’</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* LESSON PAGE */}
        {selectedSubject && (
          <>
            <button
              className="learning-back"
              onClick={goBackToSubjects}
            >
              â† Back to dashboard
            </button>

            <div className="learning-heading">
              <span className="learning-large-emoji">
                {selectedSubject.emoji}
              </span>

              <div>
                <p className="auth-eyebrow">
                  {selectedSubject.name.toUpperCase()}
                </p>

                <h2>{lesson.title}</h2>

                <p>
                  Starter lesson Â· Class{" "}
                  {profile?.student_class || "6â€“10"}
                </p>
              </div>
            </div>

            <div className="lesson-content">
              <h3>Let's learn</h3>

              <p>{lesson.introduction}</p>

              <h3>Important points</h3>

              <ul className="lesson-points">
                {lesson.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            {/* QUIZ */}
            <section className="knowledge-check">
              <p className="auth-eyebrow">
                QUICK KNOWLEDGE CHECK
              </p>

              <h3>{lesson.question}</h3>

              <div className="quiz-options">
                {lesson.options.map((option, index) => {
                  let className = "quiz-option";

                  if (selectedAnswer !== null) {
                    if (index === lesson.correctAnswer) {
                      className += " quiz-correct";
                    } else if (index === selectedAnswer) {
                      className += " quiz-wrong";
                    }
                  }

                  return (
                    <button
                      key={index}
                      className={className}
                      disabled={selectedAnswer !== null || isSaving}
                      onClick={() => handleAnswer(index)}
                    >
                      <span>
                        {String.fromCharCode(65 + index)}.
                      </span>

                      {option}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div
                  className={
                    isCorrect
                      ? "quiz-feedback quiz-feedback-correct"
                      : "quiz-feedback quiz-feedback-wrong"
                  }
                  role="status"
                >
                  <strong>
                    {isCorrect
                      ? "Correct! Well done!"
                      : "Not quite. Try again!"}
                  </strong>

                  <p>
                    {isCorrect
                      ? lesson.explanation
                      : "Review the lesson points and try another answer."}
                  </p>
                </div>
              )}

              {isSaving && (
                <p className="save-status">
                  Saving your result to Supabase...
                </p>
              )}

              {saveMessage && !isSaving && (
                <p className="save-status" role="status">
                  {saveMessage}
                </p>
              )}

              {saveError && (
                <p className="auth-message auth-error" role="alert">
                  {saveError}
                </p>
              )}

              {selectedAnswer !== null &&
                !isCorrect &&
                !isSaving && (
                  <button
                    className="auth-submit try-again-button"
                    onClick={tryAgain}
                  >
                    Try Again
                  </button>
                )}
            </section>

            <button
              className="learning-back learning-bottom-back"
              onClick={goBackToSubjects}
            >
              Back to all subjects
            </button>
          </>
        )}
      </section>
    </main>
  );
}

export default Dashboard;





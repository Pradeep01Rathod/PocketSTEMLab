
import { useEffect, useState, lazy, Suspense } from "react";
import axios from "axios";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Atom,
  BookOpen,
  FlaskConical,
  Globe2,
  GraduationCap,
  Microscope,
  Shapes,
  Zap,
  ChevronRight,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

import CraftoLanding from "./crafto/CraftoLanding";
import ConnectionBanner from "./components/common/ConnectionBanner";
import { supabase } from "./supabaseClient";

// Code-split heavy secondary routes so the initial landing page bundle remains lightweight
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SubjectSelection = lazy(() => import("./pages/SubjectSelection"));
const ChemistryLab = lazy(() => import("./pages/ChemistryLab"));
const StemLabPage = lazy(() => import("./pages/StemLabPage"));
const QuizPage = lazy(() => import("./pages/QuizPage"));

import "./App.css";

const KANNADA = "\u0C95\u0CA8\u0CCD\u0CA1";

const languageNames = {
  en: "English",
  kn: KANNADA,
  hi: "हिन्दी",
  ta: "தமிழ்",
};

const subjects = [
  {
    id: "math",
    name: "Mathematics",
    subtitle: "Discover shapes, numbers and geometry.",
    icon: Shapes,
    color: "blue",
    experiment: "Explore 3D Geometry",
    description:
      "Rotate three-dimensional shapes and discover their faces, edges, vertices and volume.",
  },
  {
    id: "biology",
    name: "Biology",
    subtitle: "Explore cells and living organisms.",
    icon: Microscope,
    color: "green",
    experiment: "Explore a Plant Cell",
    description:
      "Discover the parts of a plant cell and learn what each organelle does.",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    subtitle: "Discover atoms and molecules.",
    icon: FlaskConical,
    color: "purple",
    experiment: "Enter the 3D Chemistry Lab",
    description:
      "Explore a virtual chemistry room and inspect laboratory equipment in a safe digital environment.",
  },
  {
    id: "physics",
    name: "Physics",
    subtitle: "Understand energy and electricity.",
    icon: Zap,
    color: "orange",
    experiment: "Build an Electric Circuit",
    description:
      "Learn about batteries, switches and bulbs through a simulated circuit.",
  },
];

function HomePage() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("en");
  const [studentClass, setStudentClass] = useState("Class 6");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [apiStatus, setApiStatus] = useState("checking");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/health"
        );

        setApiStatus(
          response.data.success ? "online" : "offline"
        );
      } catch (error) {
        console.error("Backend connection failed:", error);
        setApiStatus("offline");
      }
    };

    checkBackend();
  }, []);

  const startLearning = () => {
    document
      .getElementById("subjects")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app">
      <header className="navbar">
        <a href="#home" className="brand">
          <span className="brand-icon">
            <Atom size={25} />
          </span>
          <span>
            Edu<strong>Spark</strong>
          </span>
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#home" onClick={() => setMenuOpen(false)}>
            Home
          </a>

          <a href="#subjects" onClick={() => setMenuOpen(false)}>
            Subjects
          </a>

          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>

          <Link to="/login" onClick={() => setMenuOpen(false)}>
            Student Login
          </Link>

          <Link to="/register" onClick={() => setMenuOpen(false)}>
            Register
          </Link>
        </nav>

        <div className="nav-status">
          <span
            className={
              apiStatus === "online"
                ? "status-dot online"
                : "status-dot offline"
            }
          />

          {apiStatus === "online"
            ? "Server connected"
            : apiStatus === "checking"
              ? "Connecting..."
              : "Server offline"}
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <Sparkles size={15} />
              YOUR DIGITAL STEM CLASSROOM
            </div>

            <h1>
              Learn Science
              <br />
              <span>By Exploring.</span>
            </h1>

            <p className="hero-description">
              Step into a world of discovery. Explore Mathematics,
              Biology, Chemistry and Physics through interactive
              lessons and virtual experiments.
            </p>

            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={startLearning}
              >
                Explore Subjects
                <ChevronRight size={19} />
              </button>

              <a href="#about" className="secondary-button">
                Discover our lab
              </a>
            </div>

            <div className="hero-features">
              <span>
                <GraduationCap size={17} />
                Classes 6–10
              </span>

              <span>
                <Globe2 size={17} />
                Indian languages
              </span>

              <span>
                <BookOpen size={17} />
                Learn at your pace
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />

            <div className="science-center">
              <Atom size={90} strokeWidth={1.2} />
              <span>DISCOVER</span>
            </div>

            <div className="floating-card float-math">
              <Shapes size={25} />
              <span>Mathematics</span>
            </div>

            <div className="floating-card float-bio">
              <Microscope size={25} />
              <span>Biology</span>
            </div>

            <div className="floating-card float-chem">
              <FlaskConical size={25} />
              <span>Chemistry</span>
            </div>

            <div className="floating-card float-physics">
              <Zap size={25} />
              <span>Physics</span>
            </div>
          </div>
        </section>

        <section className="learning-controls">
          <div>
            <span className="control-label">
              YOUR LEARNING JOURNEY
            </span>

            <h2>Let's get started!</h2>
            <p>Choose your class and preferred language.</p>
          </div>

          <div className="control-fields">
            <label>
              <span>Class</span>

              <select
                value={studentClass}
                onChange={(event) =>
                  setStudentClass(event.target.value)
                }
              >
                {[6, 7, 8, 9, 10].map((number) => (
                  <option key={number} value={`Class ${number}`}>
                    Class {number}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Language</span>

              <select
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value)
                }
              >
                <option value="en">English</option>
                <option value="kn">{KANNADA}</option>
                <option value="hi">हिन्दी</option>
                <option value="ta">தமிழ்</option>
              </select>
            </label>
          </div>
        </section>

        <section className="subjects-section" id="subjects">
          <div className="section-heading">
            <div>
              <span className="control-label">
                CHOOSE YOUR SUBJECT
              </span>

              <h2>Explore the STEM world</h2>
              <p>Four subjects. Endless discoveries.</p>
            </div>

            <span className="subject-count">04 SUBJECTS</span>
          </div>

          <div className="subject-grid">
            {subjects.map((subject, index) => {
              const Icon = subject.icon;

              return (
                <button
                  key={subject.id}
                  className={`subject-card ${subject.color} ${
                    selectedSubject?.id === subject.id
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  <div className="subject-icon">
                    <Icon size={30} />
                  </div>

                  <span className="subject-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>{subject.name}</h3>
                  <p>{subject.subtitle}</p>

                  <span className="card-action">
                    Explore subject
                    <ChevronRight size={17} />
                  </span>
                </button>
              );
            })}
          </div>

          {selectedSubject && (
            <div className="experiment-preview">
              <div>
                <span className="control-label">
                  SELECTED FOR {studentClass.toUpperCase()}
                </span>

                <h3>{selectedSubject.experiment}</h3>
                <p>{selectedSubject.description}</p>

                <p className="selected-language">
                  Learning language: {languageNames[language]}
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  if (selectedSubject.id === "chemistry") {
                    navigate("/chemistry-lab");
                  } else {
                    alert(
                      "This subject's interactive 3D experience will be added in a later step."
                    );
                  }
                }}
              >
                {selectedSubject.id === "chemistry"
                  ? "Enter virtual lab"
                  : "Preview experiment"}

                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <div className="about-icon">
            <FlaskConical size={35} />
          </div>

          <div>
            <span className="control-label">
              LEARNING WITHOUT LIMITS
            </span>

            <h2>A laboratory in your pocket.</h2>

            <p>
              EduSpark aims to make practical STEM education
              accessible to students everywhere, including communities
              with limited access to physical laboratories.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="brand footer-brand">
          <span className="brand-icon">
            <Atom size={22} />
          </span>

          <span>
            Edu<strong>Spark</strong>
          </span>
        </div>

        <p>Explore. Experiment. Experience Science.</p>
        <span>Made for curious minds · Classes 6–10</span>
      </footer>
    </div>
  );
}

// Automatically purge any malformed tokens from localStorage to prevent JWT parser exceptions
try {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const token = parsed?.access_token;
          if (typeof token !== "string" || token.split(".").length !== 3) {
            localStorage.removeItem(key);
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    }
  });
} catch {}

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    // 1. Initial session restoration after refresh
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (isMounted) {
          setSession(session);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err?.message?.includes("Expected 3 parts in JWT")) {
          try {
            Object.keys(localStorage).forEach((key) => {
              if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
                localStorage.removeItem(key);
              }
            });
          } catch {}
        }
        if (isMounted) {
          setSession(null);
          setLoading(false);
        }
      });

    // 2. Active auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
        setLoading(false);
      }
    });

    // 3. Listener cleanup
    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#313E3B",
          fontFamily: "var(--crafto-font-body, sans-serif)",
          fontSize: "15px",
        }}
      >
        <span>Checking student session...</span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="eduspark-skip-link">
        Skip to main content
      </a>
      <ConnectionBanner />
      <Suspense
        fallback={
          <div
            style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#313E3B",
              fontFamily: "var(--crafto-font-body, sans-serif)",
              fontSize: "15px",
            }}
          >
            <span>Loading EduSpark...</span>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<CraftoLanding />} />
          <Route path="/stem-home" element={<HomePage />} />

          <Route
            path="/register"
            element={<AuthPage mode="register" />}
          />

          <Route
            path="/login"
            element={<AuthPage mode="login" />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subjects"
            element={
              <ProtectedRoute>
                <SubjectSelection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chemistry-lab"
            element={
              <ProtectedRoute>
                <ChemistryLab />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stem-lab/:subjectId"
            element={
              <ProtectedRoute>
                <StemLabPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stem-lab/:subjectId/:activityId"
            element={
              <ProtectedRoute>
                <StemLabPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:quizId"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

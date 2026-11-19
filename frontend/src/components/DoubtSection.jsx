import React, { useEffect, useState, useRef } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  HelpCircle,
  FlaskConical,
  Zap,
  Microscope,
  Shapes,
  AlertCircle,
  Clock,
  Layers,
  ChevronRight
} from "lucide-react";
import { supabase } from "../supabaseClient";
import "./DoubtSection.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

// Standard STEM curriculum mapping for easy dropdown selection
const curriculumTopics = {
  Chemistry: {
    icon: FlaskConical,
    color: "#6655D9",
    chapters: {
      "Separation of Substances": ["Filtration", "Sedimentation & Decantation", "Evaporation & Crystallisation"],
      "Sorting Materials into Groups": ["Atoms & Molecules Basics", "Metals & Non-metals", "Solubility in Water"],
      "Acids, Bases and Salts": ["Indicators & Litmus Paper", "Neutralisation Reaction", "Natural Indicators (Turmeric)"],
      "Physical and Chemical Changes": ["Reversible vs Irreversible", "Rusting of Iron", "Chemical Reaction Signs"],
      "Matter in Our Surroundings": ["States of Matter (Solid, Liquid, Gas)", "Diffusion & Kinetic Energy", "Sublimation"],
      "Chemical Reactions & Equations": ["Combination & Decomposition", "Single & Double Displacement", "Oxidation & Reduction"],
    },
  },
  Physics: {
    icon: Zap,
    color: "#EF991F",
    chapters: {
      "Electricity and Circuits": ["Simple Closed Circuit", "Conductors vs Insulators", "Switch Mechanics & Bulbs"],
      "Light and Reflection": ["Rectilinear Propagation", "Plane & Curved Mirrors", "Shadows & Pinhole Cameras"],
      "Motion and Measurement": ["Types of Motion (Linear, Circular, Periodic)", "Standard Units (SI)", "Speed = Distance / Time"],
      "Force and Pressure": ["Contact vs Non-contact Forces", "Atmospheric & Fluid Pressure", "Friction & Rolling Resistance"],
      "Sound and Waves": ["Vibrations & Amplitude", "Pitch and Frequency", "Transmission of Sound Mediums"],
      "Magnetic Effects of Current": ["Electromagnets", "Magnetic Field Lines", "Electric Motors & Dynamos"],
    },
  },
  Biology: {
    icon: Microscope,
    color: "#28B67A",
    chapters: {
      "Cell — Structure and Functions": ["Plant Cell vs Animal Cell", "Cell Wall & Membrane", "Chloroplasts & Photosynthesis", "Nucleus & DNA"],
      "Getting to Know Plants": ["Roots, Stems & Leaves", "Leaf Venation & Transpiration", "Flower Anatomy"],
      "Nutrition in Plants & Animals": ["Photosynthesis Equation", "Digestive System Steps", "Stomata & Gas Exchange"],
      "Respiration in Organisms": ["Aerobic vs Anaerobic", "Human Lungs & Diaphragm", "Cellular Respiration in Yeast"],
      "The Fundamental Unit of Life": ["Osmosis & Diffusion", "Organelles (Mitochondria, Vacuoles)", "Selective Permeability"],
      "Life Processes & Circulation": ["Human Heart & Blood Flow", "Kidneys & Nephron Filtration", "Nerve Impulse & Reflex Arc"],
    },
  },
  Mathematics: {
    icon: Shapes,
    color: "#2D7FF9",
    chapters: {
      "Basic Geometrical Ideas & 3D Shapes": ["2D vs 3D Polyhedrons", "Faces, Edges, and Vertices", "Euler's Formula (F + V - E = 2)"],
      "Fractions & Decimals": ["Visualising Fractions", "Equivalent Fractions", "Decimal Conversions"],
      "Lines and Angles": ["Complementary & Supplementary", "Parallel Lines & Transversals", "Triangle Angle Sum Property"],
      "Visualising Solid Shapes": ["Nets of 3D Solids", "Cross-sections of Solids", "Euler's Formula Verification"],
      "Coordinate Geometry": ["Cartesian Plane & Quadrants", "Plotting (x, y) Coordinates", "Distance Formula"],
      "Surface Areas and Volumes": ["Cube & Cuboid Volume", "Cylinder & Cone Surface Area", "Sphere & Hemisphere Formulas"],
    },
  },
};

const doubtCategories = [
  "Concept Explanation",
  "Experiment Steps & Procedure",
  "Laboratory Equipment & Tools",
  "Formulas & Calculations",
  "Observations & Results",
  "Real-World Examples & Applications",
];

const quickPromptChips = [
  "Why does this happen step-by-step?",
  "Can you give an everyday real-world example?",
  "What safety precautions should I take in the lab?",
  "How can I remember this formula easily?",
];

export default function DoubtSection({
  initialSubject = "Chemistry",
  initialChapter = "Separation of Substances",
  initialExperiment = "Filtration",
  initialClassLevel = "Class 6",
}) {
  // Selector state
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedClass, setSelectedClass] = useState(initialClassLevel);
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [selectedExperiment, setSelectedExperiment] = useState(initialExperiment);
  const [selectedCategory, setSelectedCategory] = useState("Concept Explanation");

  // Chat & History state
  const [question, setQuestion] = useState("");
  const [doubts, setDoubts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const questionInputRef = useRef(null);

  // Synchronize chapter list when subject changes
  const availableChapters = Object.keys(curriculumTopics[selectedSubject]?.chapters || {});
  const availableExperiments = curriculumTopics[selectedSubject]?.chapters[selectedChapter] || [];

  // Update chapter and experiment if subject changes
  const handleSubjectChange = (newSub) => {
    setSelectedSubject(newSub);
    const firstChapter = Object.keys(curriculumTopics[newSub]?.chapters || {})[0] || "";
    setSelectedChapter(firstChapter);
    const firstExp = curriculumTopics[newSub]?.chapters[firstChapter]?.[0] || "";
    setSelectedExperiment(firstExp);
  };

  const handleChapterChange = (newChap) => {
    setSelectedChapter(newChap);
    const firstExp = curriculumTopics[selectedSubject]?.chapters[newChap]?.[0] || "";
    setSelectedExperiment(firstExp);
  };

  // 1. Fetch user's doubts from Supabase
  useEffect(() => {
    let isMounted = true;

    async function fetchUserDoubts() {
      try {
        setLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession().catch(() => ({ data: {} }));

        if (!session) {
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("student_doubts")
          .select("id, subject, experiment, category, question, answer, created_at")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.warn("Notice loading doubt history:", fetchError.message);
          if (isMounted) setDoubts([]);
          return;
        }

        if (isMounted) {
          setDoubts(data || []);
        }
      } catch (err) {
        console.warn("Notice loading doubt history:", err?.message);
        if (isMounted) {
          setDoubts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchUserDoubts();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Submit Question to Backend AI endpoint
  async function handleSubmit(event) {
    if (event) event.preventDefault();

    const cleanQuestion = question.trim();
    if (!cleanQuestion) {
      setError("Please write your question before submitting.");
      return;
    }

    if (cleanQuestion.length > 500) {
      setError("Your question must be 500 characters or less.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        throw new Error("Please log in to your EduSpark account to ask doubts.");
      }

      // Call backend AI API
      const response = await fetch(`${API_BASE_URL}/api/doubts/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          subject: selectedSubject,
          classLevel: selectedClass,
          chapter: selectedChapter,
          experiment: selectedExperiment,
          category: selectedCategory,
          question: cleanQuestion,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to generate an AI answer. Please try again.");
      }

      // 3. Save to Supabase student_doubts table
      const { data: savedRecord, error: saveError } = await supabase
        .from("student_doubts")
        .insert({
          user_id: session.user.id,
          subject: selectedSubject,
          experiment: selectedExperiment,
          category: selectedCategory,
          question: cleanQuestion,
          answer: result.answer,
        })
        .select("id, subject, experiment, category, question, answer, created_at")
        .single();

      if (saveError) {
        console.warn("Could not save to Supabase history:", saveError);
        // Even if DB insert fails, show the answer locally to the student
        const fallbackObj = {
          id: Date.now().toString(),
          subject: selectedSubject,
          experiment: selectedExperiment,
          category: selectedCategory,
          question: cleanQuestion,
          answer: result.answer,
          created_at: new Date().toISOString(),
        };
        setDoubts((prev) => [fallbackObj, ...prev]);
      } else {
        setDoubts((prev) => [savedRecord, ...prev]);
      }

      // Reset input
      setQuestion("");
    } catch (err) {
      if (err?.message?.includes("JWT") || err?.message?.includes("key")) {
        setError("Your student session has expired or is invalid. Please log in again.");
      } else {
        setError(err.message || "Failed to reach EduSpark AI. Please check your internet connection.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Copy answer to clipboard helper
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Follow-up question helper
  const handleAskFollowUp = (priorQuestion) => {
    setQuestion(`Regarding "${priorQuestion.slice(0, 40)}...": `);
    if (questionInputRef.current) {
      questionInputRef.current.focus();
      questionInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Filter doubts by subject tab
  const filteredDoubts = activeFilter === "all"
    ? doubts
    : doubts.filter((d) => (d.subject || "").toLowerCase() === activeFilter.toLowerCase());

  return (
    <section className="eduspark-doubt-container" aria-label="AI Doubt Assistant">
      {/* 1. Header Banner */}
      <div className="doubt-hero-banner">
        <div className="doubt-hero-avatar">
          <Bot size={28} />
          <span className="doubt-ai-live-dot" title="AI Assistant Online" />
        </div>

        <div className="doubt-hero-meta">
          <div className="doubt-hero-tag">
            <Sparkles size={13} />
            <span>24/7 STEM MENTOR</span>
          </div>
          <h2>EduSpark AI Doubt Assistant</h2>
          <p>
            Stuck on an experiment or scientific principle? Ask any school-level question
            and get simple, step-by-step guidance tailored for <strong>{selectedClass}</strong>.
          </p>
        </div>
      </div>

      {/* 2. Interactive Subject & Curriculum Selector */}
      <div className="doubt-config-card">
        <span className="doubt-config-title">
          <Layers size={15} /> Customize Topic & Grade Level
        </span>

        {/* Subject Selection Tabs */}
        <div className="doubt-subject-pills">
          {Object.entries(curriculumTopics).map(([subKey, meta]) => {
            const SubIcon = meta.icon;
            const isSelected = selectedSubject === subKey;
            return (
              <button
                key={subKey}
                type="button"
                className={`doubt-sub-btn ${isSelected ? "active" : ""}`}
                style={{
                  borderColor: isSelected ? meta.color : "#E3E9E6",
                  backgroundColor: isSelected ? meta.color : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#313E3B",
                }}
                onClick={() => handleSubjectChange(subKey)}
              >
                <SubIcon size={16} />
                <span>{subKey}</span>
              </button>
            );
          })}
        </div>

        {/* Grade, Chapter, and Experiment Controls */}
        <div className="doubt-selectors-grid">
          <div>
            <label htmlFor="doubt-class-select">Student Grade:</label>
            <select
              id="doubt-class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              disabled={submitting}
            >
              {["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"].map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="doubt-chapter-select">Chapter:</label>
            <select
              id="doubt-chapter-select"
              value={selectedChapter}
              onChange={(e) => handleChapterChange(e.target.value)}
              disabled={submitting}
            >
              {availableChapters.map((chap) => (
                <option key={chap} value={chap}>
                  {chap}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="doubt-exp-select">Lab Experiment / Topic:</label>
            <select
              id="doubt-exp-select"
              value={selectedExperiment}
              onChange={(e) => setSelectedExperiment(e.target.value)}
              disabled={submitting}
            >
              {availableExperiments.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="doubt-cat-select">Doubt Category:</label>
            <select
              id="doubt-cat-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={submitting}
            >
              {doubtCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Question Form */}
      <form className="doubt-input-form" onSubmit={handleSubmit}>
        <div className="doubt-textarea-wrap">
          <label htmlFor="doubt-question-input" className="doubt-textarea-label">
            Type your STEM question ({selectedSubject} · {selectedExperiment}):
          </label>

          <textarea
            ref={questionInputRef}
            id="doubt-question-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Example: Why does sand remain on the filter paper while water passes through in Class 6 filtration?`}
            maxLength={500}
            rows={3}
            disabled={submitting}
          />

          {/* Quick Prompt Chips */}
          <div className="doubt-chips-bar">
            <span className="doubt-chips-label">Quick Prompts:</span>
            {quickPromptChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                className="doubt-chip-btn"
                onClick={() => setQuestion((prev) => (prev ? `${prev} ${chip}` : chip))}
                disabled={submitting}
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="doubt-form-bottom-bar">
            <span className="doubt-char-counter">
              {question.length} / 500 characters
            </span>

            <button
              type="submit"
              className="doubt-ask-btn"
              disabled={submitting || !question.trim()}
            >
              {submitting ? (
                <>
                  <RotateCcw size={16} className="doubt-spin-icon" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Ask EduSpark AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error Notice */}
      {error && (
        <div className="doubt-error-banner" role="alert">
          <AlertCircle size={18} />
          <div style={{ flex: 1 }}>
            <strong>Connection or input notice:</strong>
            <p>{error}</p>
          </div>
          <button
            type="button"
            className="doubt-retry-link"
            onClick={() => handleSubmit()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {submitting && (
        <div className="doubt-thinking-card">
          <div className="doubt-thinking-avatar">
            <Bot size={22} />
          </div>
          <div className="doubt-thinking-content">
            <div className="doubt-thinking-header">
              <span className="doubt-thinking-pulse" />
              <strong>EduSpark AI is formulating an age-appropriate explanation...</strong>
            </div>
            <div className="doubt-skeleton-line" style={{ width: "88%" }} />
            <div className="doubt-skeleton-line" style={{ width: "95%" }} />
            <div className="doubt-skeleton-line" style={{ width: "65%" }} />
          </div>
        </div>
      )}

      {/* 4. Conversation History */}
      <div className="doubt-history-section">
        <div className="doubt-history-header">
          <div>
            <h3>Your Question & Answer History</h3>
            <p>Review explanations, copy notes, or ask follow-up questions.</p>
          </div>

          {/* Filter Pills */}
          <div className="doubt-filter-tabs">
            {["all", "Chemistry", "Physics", "Biology", "Mathematics"].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`doubt-tab-btn ${activeFilter === tab ? "active" : ""}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab === "all" ? "All Subjects" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "#71807D" }}>
            <RotateCcw size={24} className="doubt-spin-icon" style={{ margin: "0 auto 10px" }} />
            <p>Loading your saved STEM doubts...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDoubts.length === 0 && (
          <div className="doubt-empty-card">
            <HelpCircle size={36} color="#8C9895" />
            <h4>No doubts asked yet</h4>
            <p>
              Type your question above about {selectedSubject} to receive step-by-step
              explanations with real-world examples!
            </p>
          </div>
        )}

        {/* Messages List */}
        {!loading && (
          <div className="doubt-thread-list">
            {filteredDoubts.map((item) => {
              const subMeta = curriculumTopics[item.subject] || curriculumTopics.Chemistry;
              const SubIcon = subMeta.icon;

              return (
                <article key={item.id} className="doubt-thread-card">
                  {/* Metadata Tag Line */}
                  <div className="doubt-thread-top">
                    <div className="doubt-thread-badges">
                      <span
                        className="doubt-subject-badge"
                        style={{ backgroundColor: subMeta.color }}
                      >
                        <SubIcon size={12} />
                        {item.subject || "STEM"}
                      </span>

                      {item.experiment && (
                        <span className="doubt-topic-badge">
                          {item.experiment}
                        </span>
                      )}

                      {item.category && (
                        <span className="doubt-category-badge">
                          {item.category}
                        </span>
                      )}
                    </div>

                    <time className="doubt-timestamp">
                      <Clock size={12} />
                      {new Date(item.created_at).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>

                  {/* Student Question Bubble */}
                  <div className="doubt-bubble student-bubble">
                    <div className="doubt-bubble-avatar student-avatar">
                      <User size={16} />
                    </div>
                    <div className="doubt-bubble-body">
                      <span className="doubt-bubble-sender">Your Question:</span>
                      <p className="doubt-bubble-text">{item.question}</p>
                    </div>
                  </div>

                  {/* AI Answer Bubble */}
                  <div className="doubt-bubble ai-bubble">
                    <div className="doubt-bubble-avatar ai-avatar">
                      <Bot size={16} />
                    </div>

                    <div className="doubt-bubble-body">
                      <div className="doubt-bubble-top-row">
                        <span className="doubt-bubble-sender ai-sender-tag">
                          <Sparkles size={12} /> EduSpark AI Mentor
                        </span>

                        <div className="doubt-bubble-actions">
                          <button
                            type="button"
                            className="doubt-action-icon-btn"
                            onClick={() => handleCopy(item.id, item.answer)}
                            title="Copy explanation"
                          >
                            {copiedId === item.id ? (
                              <>
                                <Check size={14} color="#16A34A" />
                                <span style={{ color: "#16A34A" }}>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            className="doubt-action-icon-btn"
                            onClick={() => handleAskFollowUp(item.question)}
                            title="Ask a follow-up question"
                          >
                            <ChevronRight size={14} />
                            <span>Ask Follow-up</span>
                          </button>
                        </div>
                      </div>

                      <div className="doubt-answer-prose">
                        {item.answer.split("\n\n").map((para, pIdx) => (
                          <p key={pIdx}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Safety & Educational Disclaimer */}
      <footer className="doubt-footer-disclaimer">
        <span>🛡️</span>
        <p>
          EduSpark AI explains STEM concepts for learning. In hands-on laboratory sessions,
          always follow your classroom teacher’s safety instructions.
        </p>
      </footer>
    </section>
  );
}

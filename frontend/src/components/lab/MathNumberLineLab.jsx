import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import ExperimentIntroModal from "./ExperimentIntroModal";
import ExperimentCompletionModal from "./ExperimentCompletionModal";
import { queueOfflineProgress } from "../../utils/offlineSync";
import { LAB_ACTIVITIES } from "../../data/labRegistry";
import "./LabStyles.css";

const activityMeta = LAB_ACTIVITIES["math-number-line"];

const practiceProblems = [
  { id: 1, start: -3, op: "+", value: 5, expected: 2, question: "Calculate (-3) + (+5)" },
  { id: 2, start: 4, op: "-", value: 6, expected: -2, question: "Calculate (+4) - (+6)" },
  { id: 3, start: -2, op: "-", value: 4, expected: -6, question: "Calculate (-2) - (+4)" },
  { id: 4, start: 1, op: "+", value: -5, expected: -4, question: "Calculate (+1) + (-5)" },
];

export default function MathNumberLineLab() {
  const [currentVal, setCurrentVal] = useState(0);
  const [history, setHistory] = useState([0]);
  const [jumpFrom, setJumpFrom] = useState(null);

  // Practice Mode
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [problemSolvedCount, setProblemSolvedCount] = useState(0);
  const [userFeedback, setUserFeedback] = useState(null);

  // Modals
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Supabase Save Status
  const [savingStatus, setSavingStatus] = useState("idle");
  const [savingError, setSavingError] = useState("");

  const currentProblem = practiceProblems[activeProblemIdx];

  const handleStep = (delta) => {
    setJumpFrom(currentVal);
    const next = Math.max(-10, Math.min(10, currentVal + delta));
    setCurrentVal(next);
    setHistory((prev) => [...prev.slice(-4), next]);
  };

  const handleReset = () => {
    setCurrentVal(0);
    setJumpFrom(null);
    setHistory([0]);
    setUserFeedback(null);
  };

  const handleCheckAnswer = () => {
    if (currentVal === currentProblem.expected) {
      setUserFeedback({
        correct: true,
        text: `Correct! ${currentProblem.question} = ${currentProblem.expected}.`,
      });
      const nextSolved = problemSolvedCount + 1;
      setProblemSolvedCount(nextSolved);

      if (nextSolved >= 2) {
        handleExperimentComplete();
      }
    } else {
      setUserFeedback({
        correct: false,
        text: `Not quite. Move the pointer to ${currentProblem.expected}. Currently at ${currentVal}.`,
      });
    }
  };

  const handleNextProblem = () => {
    setUserFeedback(null);
    setActiveProblemIdx((prev) => (prev + 1) % practiceProblems.length);
    setCurrentVal(practiceProblems[(activeProblemIdx + 1) % practiceProblems.length].start);
    setJumpFrom(null);
  };

  const handleExperimentComplete = async () => {
    if (savingStatus === "saved" || savingStatus === "saving") return;

    setSavingStatus("saving");
    setSavingError("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        setSavingStatus("error");
        setSavingError("Log in to save your lab progress to Supabase.");
        setIsCompletionOpen(true);
        return;
      }

      if (!navigator.onLine) {
        queueOfflineProgress({
          userId: session.user.id,
          lessonId: activityMeta.lessonId,
          progressPercent: 100,
          completed: true,
        });
        setSavingStatus("saved");
        setIsCompletionOpen(true);
        return;
      }

      const { error: saveError } = await supabase
        .from("learning_progress")
        .upsert(
          {
            user_id: session.user.id,
            lesson_id: activityMeta.lessonId,
            progress_percent: 100,
            completed: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,lesson_id" }
        );

      if (saveError) throw saveError;
      setSavingStatus("saved");
      setIsCompletionOpen(true);
    } catch (err) {
      const {
        data: { session },
      } = await supabase.auth.getSession().catch(() => ({ data: {} }));
      if (session?.user?.id) {
        queueOfflineProgress({
          userId: session.user.id,
          lessonId: activityMeta.lessonId,
          progressPercent: 100,
          completed: true,
        });
        setSavingStatus("saved");
      } else {
        setSavingStatus("error");
        setSavingError(err.message || "Could not save progress.");
      }
      setIsCompletionOpen(true);
    }
  };

  // Coordinate mapping for SVG: range -10 to +10 mapped to X 50 to 750
  const mapValueToX = (val) => 400 + val * 35;

  return (
    <div className="stem-lab-main">
      <div className="stem-lab-grid">
        {/* Left Column: Number Line Simulation */}
        <div>
          <div className="stem-viewport-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", background: "#2D7FF9", padding: "3px 10px", borderRadius: "12px", fontWeight: "700" }}>
                  INTEGER NUMBER LINE
                </span>
                <span style={{ fontSize: "13px", color: "#94A3B8" }}>Classes 6–7</span>
              </div>
              <button
                onClick={handleReset}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#FFFFFF",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                }}
              >
                <RotateCcw size={13} /> Reset Marker
              </button>
            </div>

            {/* SVG Visual Number Line */}
            <div
              style={{
                width: "100%",
                background: "#06130E",
                borderRadius: "10px",
                border: "1px solid #313E3B",
                padding: "20px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <svg viewBox="0 0 800 240" style={{ width: "98%", height: "240px" }}>
                {/* Arrow heads for infinite extension */}
                <defs>
                  <marker id="arrow-left" markerWidth="10" markerHeight="10" refX="2" refY="4" orient="auto">
                    <polygon points="8,0 0,4 8,8" fill="#D5D52B" />
                  </marker>
                  <marker id="arrow-right" markerWidth="10" markerHeight="10" refX="6" refY="4" orient="auto">
                    <polygon points="0,0 8,4 0,8" fill="#D5D52B" />
                  </marker>
                </defs>

                {/* Main Axis Line */}
                <line
                  x1="30"
                  y1="120"
                  x2="770"
                  y2="120"
                  stroke="#D5D52B"
                  strokeWidth="3"
                  markerStart="url(#arrow-left)"
                  markerEnd="url(#arrow-right)"
                />

                {/* Sub-divisions and tick marks */}
                {Array.from({ length: 21 }, (_, i) => i - 10).map((val) => {
                  const x = mapValueToX(val);
                  const isZero = val === 0;
                  const isMajor = val % 5 === 0;
                  const tickHeight = isZero ? 26 : isMajor ? 18 : 10;
                  const isCurrent = val === currentVal;

                  return (
                    <g key={val} cursor="pointer" onClick={() => { setJumpFrom(currentVal); setCurrentVal(val); }}>
                      <line
                        x1={x}
                        y1={120 - tickHeight}
                        x2={x}
                        y2={120 + tickHeight}
                        stroke={isZero ? "#EF4444" : isCurrent ? "#2D7FF9" : "#64748B"}
                        strokeWidth={isZero || isCurrent ? "3" : "1.5"}
                      />
                      <text
                        x={x}
                        y="160"
                        fill={isZero ? "#EF4444" : isCurrent ? "#38BDF8" : "#E2E8F0"}
                        fontSize={isZero ? "16" : isMajor ? "14" : "11"}
                        fontWeight={isZero || isCurrent ? "700" : "400"}
                        textAnchor="middle"
                      >
                        {val > 0 ? `+${val}` : val}
                      </text>
                    </g>
                  );
                })}

                {/* Jump Arc from previous position */}
                {jumpFrom !== null && jumpFrom !== currentVal && (
                  <path
                    d={`M ${mapValueToX(jumpFrom)} 110 Q ${
                      (mapValueToX(jumpFrom) + mapValueToX(currentVal)) / 2
                    } ${60 - Math.min(30, Math.abs(jumpFrom - currentVal) * 4)} ${mapValueToX(currentVal)} 110`}
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />
                )}

                {/* Marker Pointer */}
                <g transform={`translate(${mapValueToX(currentVal)}, 115)`}>
                  <polygon points="0,-10 -10,-28 10,-28" fill="#38BDF8" />
                  <circle cx="0" cy="0" r="7" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />
                  <text x="0" y="-36" fill="#38BDF8" fontSize="13" fontWeight="bold" textAnchor="middle">
                    {currentVal > 0 ? `+${currentVal}` : currentVal}
                  </text>
                </g>

                {/* Zero Origin Label */}
                <text x="400" y="200" fill="#EF4444" fontSize="11" fontWeight="bold" textAnchor="middle">
                  ORIGIN (0)
                </text>
                <text x="180" y="215" fill="#94A3B8" fontSize="11" textAnchor="middle">
                  ← Negative Integers (Left)
                </text>
                <text x="620" y="215" fill="#94A3B8" fontSize="11" textAnchor="middle">
                  Positive Integers (Right) →
                </text>
              </svg>
            </div>

            {/* Quick Step Buttons */}
            <div style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => handleStep(-5)}
                style={{ background: "#1E293B", border: "1px solid #334155", color: "#F1F5F9", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
              >
                - 5 units
              </button>
              <button
                onClick={() => handleStep(-1)}
                style={{ background: "#1E293B", border: "1px solid #334155", color: "#F1F5F9", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
              >
                <Minus size={14} style={{ display: "inline", verticalAlign: "middle" }} /> 1 unit
              </button>
              <button
                onClick={() => handleStep(+1)}
                style={{ background: "#1E293B", border: "1px solid #334155", color: "#F1F5F9", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
              >
                <Plus size={14} style={{ display: "inline", verticalAlign: "middle" }} /> 1 unit
              </button>
              <button
                onClick={() => handleStep(+5)}
                style={{ background: "#1E293B", border: "1px solid #334155", color: "#F1F5F9", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
              >
                + 5 units
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Values & Practice Mission */}
        <div className="stem-controls-card">
          {/* Readout Values */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Sparkles size={16} color="#6655D9" /> Position & Absolute Value
            </h3>
            <div className="stem-metric-grid">
              <div className="stem-metric-item">
                <span className="stem-metric-label">Current Integer</span>
                <span className="stem-metric-val" style={{ color: currentVal < 0 ? "#EF4444" : currentVal > 0 ? "#16A34A" : "#313E3B" }}>
                  {currentVal > 0 ? `+${currentVal}` : currentVal}
                </span>
              </div>
              <div className="stem-metric-item">
                <span className="stem-metric-label">Distance from Zero |x|</span>
                <span className="stem-metric-val">{Math.abs(currentVal)} units</span>
              </div>
            </div>

            <p style={{ fontSize: "12px", color: "#64748B", marginTop: "10px", lineHeight: "1.4" }}>
              The absolute value of an integer represents its non-directional geometric distance from the origin: |{currentVal}| = {Math.abs(currentVal)}.
            </p>
          </div>

          {/* Practice Challenge */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <HelpCircle size={16} color="#2D7FF9" /> Practice Challenge #{activeProblemIdx + 1}
            </h3>
            <div style={{ background: "#F1F5F9", padding: "12px", borderRadius: "8px", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#1E293B" }}>
                {currentProblem.question}
              </span>
              <p style={{ fontSize: "12px", color: "#475569", margin: "4px 0 0" }}>
                1. Set pointer to start value ({currentProblem.start}).<br />
                2. Move {currentProblem.op === "+" ? "right" : "left"} {Math.abs(currentProblem.value)} units.<br />
                3. Click "Check Position".
              </p>
            </div>

            {userFeedback && (
              <div
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  backgroundColor: userFeedback.correct ? "#DCFCE7" : "#FEE2E2",
                  color: userFeedback.correct ? "#166534" : "#991B1B",
                }}
              >
                {userFeedback.correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>{userFeedback.text}</span>
              </div>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleCheckAnswer}
                style={{
                  flex: 1,
                  background: "#6655D9",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Check Position
              </button>
              <button
                onClick={handleNextProblem}
                style={{
                  background: "#F8FAF9",
                  border: "1px solid #CBD5E1",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Next <ChevronRight size={14} style={{ verticalAlign: "middle" }} />
              </button>
            </div>

            <div style={{ marginTop: "14px", borderTop: "1px solid #E2E8F0", paddingTop: "10px", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748B" }}>
              <span>Challenges Solved: <strong>{problemSolvedCount}</strong></span>
              <button
                onClick={handleExperimentComplete}
                style={{ background: "transparent", border: "none", color: "#16A34A", fontWeight: "700", cursor: "pointer" }}
              >
                Finish Lab & Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ExperimentIntroModal
        isOpen={isIntroOpen}
        onClose={() => setIsIntroOpen(false)}
        experimentName={activityMeta.title}
        subject={activityMeta.subjectName}
        classLevel={activityMeta.classLevel}
        chapter={activityMeta.chapter}
        objectives={activityMeta.objectives}
        materials={activityMeta.materials}
        safetyGuidelines={activityMeta.safetyGuidelines}
      />

      <ExperimentCompletionModal
        isOpen={isCompletionOpen}
        onClose={() => setIsCompletionOpen(false)}
        onRestart={handleReset}
        experimentTitle={activityMeta.title}
        subject={activityMeta.subjectName}
        scientificConcept={activityMeta.scientificConcept}
        observations={activityMeta.observations}
        result={activityMeta.result}
        quizRoute={activityMeta.quizRoute}
        quizTitle={`Take ${activityMeta.subjectName} Quiz`}
        savingStatus={savingStatus}
        savingError={savingError}
      />
    </div>
  );
}

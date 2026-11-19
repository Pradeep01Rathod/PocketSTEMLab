import React, { useState } from "react";
import {
  RotateCcw,
  Sparkles,
  Equal,
  Divide,
  Minus,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import ExperimentIntroModal from "./ExperimentIntroModal";
import ExperimentCompletionModal from "./ExperimentCompletionModal";
import { queueOfflineProgress } from "../../utils/offlineSync";
import { LAB_ACTIVITIES } from "../../data/labRegistry";
import "./LabStyles.css";

const activityMeta = LAB_ACTIVITIES["math-algebra"];

const presetEquations = [
  { id: 1, text: "x + 4 = 9", coef: 1, constant: 4, targetTotal: 9, solution: 5 },
  { id: 2, text: "2x + 3 = 11", coef: 2, constant: 3, targetTotal: 11, solution: 4 },
  { id: 3, text: "3x + 2 = 14", coef: 3, constant: 2, targetTotal: 14, solution: 4 },
  { id: 4, text: "2x + 6 = 16", coef: 2, constant: 6, targetTotal: 16, solution: 5 },
];

export default function MathAlgebraLab() {
  const [eqIndex, setEqIndex] = useState(0);
  const currentEq = presetEquations[eqIndex];

  // Dynamic equation state
  const [currentCoef, setCurrentCoef] = useState(currentEq.coef);
  const [leftConst, setLeftConst] = useState(currentEq.constant);
  const [rightTotal, setRightTotal] = useState(currentEq.targetTotal);
  const [historySteps, setHistorySteps] = useState([]);
  const [solvedCount, setSolvedCount] = useState(0);

  // Modals
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Supabase Save Status
  const [savingStatus, setSavingStatus] = useState("idle");
  const [savingError, setSavingError] = useState("");

  // Physical weight calculation assuming x = currentEq.solution
  const leftWeight = currentCoef * currentEq.solution + leftConst;
  const rightWeight = rightTotal;
  const weightDiff = rightWeight - leftWeight;
  // Tilt angle: positive tilts right down, negative tilts left down, max 15 deg
  const tiltAngle = Math.max(-15, Math.min(15, weightDiff * 2.5));
  const isBalanced = weightDiff === 0;
  const isSolved = currentCoef === 1 && leftConst === 0 && rightTotal === currentEq.solution;

  const handleApplyOp = (type, val) => {
    let newLeftConst = leftConst;
    let newRightTotal = rightTotal;
    let newCoef = currentCoef;
    let stepDescription = "";

    if (type === "subtract") {
      newLeftConst -= val;
      newRightTotal -= val;
      stepDescription = `Subtracted ${val} from both sides`;
    } else if (type === "add") {
      newLeftConst += val;
      newRightTotal += val;
      stepDescription = `Added ${val} to both sides`;
    } else if (type === "divide") {
      if (currentCoef > 1 && newLeftConst === 0) {
        newRightTotal = newRightTotal / val;
        newCoef = 1;
        stepDescription = `Divided both sides by ${val}`;
      }
    }

    setLeftConst(newLeftConst);
    setRightTotal(newRightTotal);
    setCurrentCoef(newCoef);
    setHistorySteps((prev) => [...prev, stepDescription]);

    if (newCoef === 1 && newLeftConst === 0 && newRightTotal === currentEq.solution) {
      const nextSolved = solvedCount + 1;
      setSolvedCount(nextSolved);
      if (nextSolved >= 2) {
        handleExperimentComplete();
      }
    }
  };

  const handleSelectEquation = (idx) => {
    setEqIndex(idx);
    const eq = presetEquations[idx];
    setCurrentCoef(eq.coef);
    setLeftConst(eq.constant);
    setRightTotal(eq.targetTotal);
    setHistorySteps([]);
  };

  const handleReset = () => {
    setCurrentCoef(currentEq.coef);
    setLeftConst(currentEq.constant);
    setRightTotal(currentEq.targetTotal);
    setHistorySteps([]);
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

  return (
    <div className="stem-lab-main">
      <div className="stem-lab-grid">
        {/* Left Column: Visual Balance Scale Viewport */}
        <div>
          <div className="stem-viewport-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", background: "#6655D9", padding: "3px 10px", borderRadius: "12px", fontWeight: "700" }}>
                  EQUATION BALANCE SCALE
                </span>
                <span style={{ fontSize: "13px", color: isBalanced ? "#4ADE80" : "#F87171", fontWeight: "600" }}>
                  {isBalanced ? "⚖️ Perfectly Balanced (Equal)" : "⚠️ Unbalanced"}
                </span>
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
                <RotateCcw size={13} /> Reset Equation
              </button>
            </div>

            {/* Current Algebraic Expression Banner */}
            <div
              style={{
                background: "#06130E",
                padding: "12px 20px",
                borderRadius: "8px",
                textAlign: "center",
                marginBottom: "16px",
                border: "1px solid #313E3B",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "1px", color: isSolved ? "#4ADE80" : "#F8FAFC" }}>
                {currentCoef > 1 ? `${currentCoef}x` : currentCoef === 1 ? "x" : ""}
                {leftConst > 0 ? ` + ${leftConst}` : leftConst < 0 ? ` - ${Math.abs(leftConst)}` : ""}
                {currentCoef === 0 && leftConst === 0 ? "0" : ""}{" "}
                <Equal size={20} style={{ display: "inline", verticalAlign: "middle", margin: "0 6px", color: "#D5D52B" }} />{" "}
                {rightTotal}
              </span>
              {isSolved && (
                <div style={{ color: "#4ADE80", fontSize: "13px", fontWeight: "700", marginTop: "4px" }}>
                  ✓ Solved! Unknown variable x = {rightTotal}
                </div>
              )}
            </div>

            {/* SVG Balance Scale Animation */}
            <div
              style={{
                width: "100%",
                background: "#0A1713",
                borderRadius: "10px",
                border: "1px solid #313E3B",
                display: "flex",
                justifyContent: "center",
                padding: "20px 0",
              }}
            >
              <svg viewBox="0 0 600 300" style={{ width: "95%", height: "280px" }}>
                {/* Central Base and Vertical Fulcrum Pillar */}
                <polygon points="260,280 340,280 315,140 285,140" fill="#475569" stroke="#64748B" strokeWidth="2" />
                <circle cx="300" cy="140" r="12" fill="#D5D52B" stroke="#0F172A" strokeWidth="3" />

                {/* Rotating Beam Group */}
                <g transform={`rotate(${tiltAngle}, 300, 140)`} style={{ transition: "transform 0.5s ease" }}>
                  {/* The Horizontal Beam */}
                  <rect x="70" y="135" width="460" height="10" rx="5" fill="#D5D52B" stroke="#A3A31F" strokeWidth="2" />

                  {/* Left Pan Suspension Cords */}
                  <line x1="120" y1="140" x2="80" y2="210" stroke="#94A3B8" strokeWidth="2" />
                  <line x1="120" y1="140" x2="160" y2="210" stroke="#94A3B8" strokeWidth="2" />
                  {/* Left Pan */}
                  <ellipse cx="120" cy="210" rx="50" ry="8" fill="#334155" stroke="#94A3B8" strokeWidth="2" />

                  {/* Left Pan Items */}
                  <g transform="translate(120, 205)">
                    {/* Variable X Blocks */}
                    {Array.from({ length: currentCoef }).map((_, i) => (
                      <g key={i} transform={`translate(${(i - (currentCoef - 1) / 2) * 26}, -20)`}>
                        <rect x="-11" y="-14" width="22" height="22" rx="3" fill="#6655D9" stroke="#A78BFA" strokeWidth="1.5" />
                        <text x="0" y="2" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                          x
                        </text>
                      </g>
                    ))}
                    {/* Unit Weights */}
                    {leftConst > 0 && (
                      <g transform="translate(0, -42)">
                        <rect x="-18" y="-10" width="36" height="18" rx="3" fill="#EF991F" stroke="#FBBF24" strokeWidth="1.5" />
                        <text x="0" y="4" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                          +{leftConst}
                        </text>
                      </g>
                    )}
                  </g>

                  {/* Right Pan Suspension Cords */}
                  <line x1="480" y1="140" x2="440" y2="210" stroke="#94A3B8" strokeWidth="2" />
                  <line x1="480" y1="140" x2="520" y2="210" stroke="#94A3B8" strokeWidth="2" />
                  {/* Right Pan */}
                  <ellipse cx="480" cy="210" rx="50" ry="8" fill="#334155" stroke="#94A3B8" strokeWidth="2" />

                  {/* Right Pan Weight Item */}
                  <g transform="translate(480, 185)">
                    <rect x="-24" y="-14" width="48" height="24" rx="4" fill="#16A34A" stroke="#4ADE80" strokeWidth="2" />
                    <text x="0" y="4" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle">
                      {rightTotal}
                    </text>
                  </g>
                </g>

                {/* Left Pan Weight Label */}
                <text x="120" y="275" fill="#A78BFA" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Left: {currentCoef > 0 ? `${currentCoef}x` : ""} {leftConst !== 0 ? `+ ${leftConst}` : ""}
                </text>

                {/* Right Pan Weight Label */}
                <text x="480" y="275" fill="#4ADE80" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Right: {rightTotal}
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Step Balancing Controls */}
        <div className="stem-controls-card">
          {/* Preset Selector */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Sparkles size={16} color="#6655D9" /> Select Linear Equation
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
              {presetEquations.map((eq, idx) => (
                <button
                  key={eq.id}
                  onClick={() => handleSelectEquation(idx)}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    border: eqIndex === idx ? "2px solid #6655D9" : "1px solid #CBD5E1",
                    background: eqIndex === idx ? "rgba(102, 85, 217, 0.08)" : "#FFFFFF",
                    fontWeight: eqIndex === idx ? "700" : "500",
                    color: eqIndex === idx ? "#6655D9" : "#334155",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  {eq.text}
                </button>
              ))}
            </div>
          </div>

          {/* Inverse Operations Toolbar */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Equal size={16} color="#16A34A" /> Apply Equal Inverse Operations
            </h3>
            <p style={{ fontSize: "12px", color: "#64748B", margin: "0 0 12px" }}>
              Perform operations on BOTH sides simultaneously to keep the scale balanced.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Step 1: Remove Constant */}
              {leftConst > 0 && (
                <button
                  onClick={() => handleApplyOp("subtract", leftConst)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "#F8FAF9",
                    border: "1.5px solid #6655D9",
                    borderRadius: "8px",
                    color: "#313E3B",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  <span>
                    <Minus size={15} style={{ display: "inline", verticalAlign: "middle" }} /> Subtract {leftConst} from both sides
                  </span>
                  <span style={{ fontSize: "11px", color: "#6655D9", fontWeight: "700" }}>RECOMMENDED</span>
                </button>
              )}

              {/* Step 2: Divide by coefficient */}
              {currentCoef > 1 && leftConst === 0 && (
                <button
                  onClick={() => handleApplyOp("divide", currentCoef)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "#ECFDF5",
                    border: "1.5px solid #16A34A",
                    borderRadius: "8px",
                    color: "#065F46",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  <span>
                    <Divide size={15} style={{ display: "inline", verticalAlign: "middle" }} /> Divide both sides by {currentCoef}
                  </span>
                  <span style={{ fontSize: "11px", color: "#16A34A", fontWeight: "700" }}>SOLVE FOR X</span>
                </button>
              )}

              {/* Step History */}
              <div style={{ marginTop: "8px", borderTop: "1px solid #E2E8F0", paddingTop: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>Balancing Steps:</span>
                {historySteps.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "#94A3B8", margin: "4px 0 0" }}>No operations performed yet.</p>
                ) : (
                  <ul style={{ margin: "6px 0 0", paddingLeft: "18px", fontSize: "12px", color: "#334155" }}>
                    {historySteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Solved Summary */}
            <div style={{ marginTop: "16px", borderTop: "1px solid #E2E8F0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Equations Solved: <strong>{solvedCount}</strong>
              </span>
              <button
                onClick={handleExperimentComplete}
                style={{ background: "transparent", border: "none", color: "#16A34A", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
              >
                Complete & Save Lab →
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

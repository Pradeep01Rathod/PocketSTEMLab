import React, { useState } from "react";
import {
  RotateCcw,
  Sparkles,
  TestTube,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import ExperimentIntroModal from "./ExperimentIntroModal";
import ExperimentCompletionModal from "./ExperimentCompletionModal";
import { queueOfflineProgress } from "../../utils/offlineSync";
import { LAB_ACTIVITIES } from "../../data/labRegistry";
import "./LabStyles.css";

const activityMeta = LAB_ACTIVITIES["chem-acids-bases"];

const testSolutions = [
  {
    id: "lemon",
    name: "Lemon Juice",
    nature: "Acidic (Citric Acid)",
    pH: 2.2,
    color: "#FEF08A",
    indicatorResults: {
      blueLitmus: { color: "#EF4444", text: "Turns RED" },
      redLitmus: { color: "#DC2626", text: "Remains RED (No change)" },
      turmeric: { color: "#EAB308", text: "Remains YELLOW (No change)" },
      phenolphthalein: { color: "rgba(255,255,255,0.7)", text: "Remains COLORLESS" },
    },
  },
  {
    id: "vinegar",
    name: "Vinegar Solution",
    nature: "Acidic (Acetic Acid)",
    pH: 2.9,
    color: "#F1F5F9",
    indicatorResults: {
      blueLitmus: { color: "#EF4444", text: "Turns RED" },
      redLitmus: { color: "#DC2626", text: "Remains RED (No change)" },
      turmeric: { color: "#EAB308", text: "Remains YELLOW" },
      phenolphthalein: { color: "rgba(255,255,255,0.7)", text: "Remains COLORLESS" },
    },
  },
  {
    id: "water",
    name: "Pure Distilled Water",
    nature: "Neutral (H2O)",
    pH: 7.0,
    color: "#E0F2FE",
    indicatorResults: {
      blueLitmus: { color: "#2563EB", text: "Remains BLUE (No change)" },
      redLitmus: { color: "#DC2626", text: "Remains RED (No change)" },
      turmeric: { color: "#EAB308", text: "Remains YELLOW" },
      phenolphthalein: { color: "rgba(255,255,255,0.7)", text: "Remains COLORLESS" },
    },
  },
  {
    id: "bakingsoda",
    name: "Baking Soda Solution",
    nature: "Basic (Sodium Bicarbonate)",
    pH: 8.5,
    color: "#F8FAFC",
    indicatorResults: {
      blueLitmus: { color: "#2563EB", text: "Remains BLUE (No change)" },
      redLitmus: { color: "#2563EB", text: "Turns BLUE" },
      turmeric: { color: "#991B1B", text: "Turns REDDISH-BROWN" },
      phenolphthalein: { color: "#EC4899", text: "Turns VIBRANT PINK" },
    },
  },
  {
    id: "soap",
    name: "Soap Solution",
    nature: "Basic (Sodium Stearate)",
    pH: 10.0,
    color: "#E2E8F0",
    indicatorResults: {
      blueLitmus: { color: "#2563EB", text: "Remains BLUE" },
      redLitmus: { color: "#2563EB", text: "Turns BLUE" },
      turmeric: { color: "#7F1D1D", text: "Turns DEEP REDDISH-BROWN" },
      phenolphthalein: { color: "#DB2777", text: "Turns DEEP PINK" },
    },
  },
];

const indicators = [
  { id: "blueLitmus", name: "Blue Litmus Strip", initialColor: "#2563EB" },
  { id: "redLitmus", name: "Red Litmus Strip", initialColor: "#DC2626" },
  { id: "turmeric", name: "Turmeric Extract Paper", initialColor: "#EAB308" },
  { id: "phenolphthalein", name: "Phenolphthalein Drops", initialColor: "rgba(255,255,255,0.7)" },
];

export default function ChemistryAcidsLab() {
  const [selectedSolution, setSelectedSolution] = useState(testSolutions[0]);
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]);
  const [testedPairs, setTestedPairs] = useState(new Set());

  // Modals
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Supabase Save Status
  const [savingStatus, setSavingStatus] = useState("idle");
  const [savingError, setSavingError] = useState("");

  const activeResult = selectedSolution.indicatorResults[selectedIndicator.id];

  const handleApplyIndicator = (ind) => {
    setSelectedIndicator(ind);
    const key = `${selectedSolution.id}-${ind.id}`;
    const updated = new Set(testedPairs).add(key);
    setTestedPairs(updated);
    if (updated.size >= 4) {
      handleExperimentComplete();
    }
  };

  const handleSelectSolution = (sol) => {
    setSelectedSolution(sol);
    const key = `${sol.id}-${selectedIndicator.id}`;
    const updated = new Set(testedPairs).add(key);
    setTestedPairs(updated);
  };

  const handleReset = () => {
    setSelectedSolution(testSolutions[0]);
    setSelectedIndicator(indicators[0]);
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
        {/* Left Column: Indicator Testing Workbench */}
        <div>
          <div className="stem-viewport-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", background: "#6655D9", padding: "3px 10px", borderRadius: "12px", fontWeight: "700" }}>
                  ACID-BASE INDICATOR BENCH
                </span>
                <span style={{ fontSize: "13px", color: selectedSolution.pH < 7 ? "#F87171" : selectedSolution.pH > 7 ? "#60A5FA" : "#4ADE80", fontWeight: "700" }}>
                  {selectedSolution.nature.toUpperCase()}
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
                <RotateCcw size={13} /> Reset Test
              </button>
            </div>

            {/* SVG Interactive Workbench */}
            <div
              style={{
                width: "100%",
                background: "#06130E",
                borderRadius: "10px",
                border: "1px solid #313E3B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px 0",
              }}
            >
              <svg viewBox="0 0 540 280" style={{ width: "95%", height: "260px" }}>
                {/* Lab Bench Surface */}
                <rect x="30" y="220" width="480" height="15" fill="#334155" stroke="#475569" strokeWidth="2" />

                {/* Left: Test Tube Rack */}
                <g transform="translate(130, 160)">
                  {/* Test Tube Body */}
                  <rect x="-20" y="-70" width="40" height="120" rx="20" fill="rgba(255,255,255,0.12)" stroke="#94A3B8" strokeWidth="2" />
                  {/* Solution Liquid */}
                  <rect x="-18" y="-10" width="36" height="60" rx="18" fill={selectedSolution.color} opacity="0.8" />
                  <ellipse cx="0" cy="-10" rx="18" ry="4" fill="#FFFFFF" opacity="0.4" />
                  <text x="0" y="70" fill="#E2E8F0" fontSize="12" fontWeight="bold" textAnchor="middle">
                    {selectedSolution.name}
                  </text>
                </g>

                {/* Center: Dropper / Dipped Indicator Strip */}
                <g transform="translate(360, 140)">
                  {/* Test Strip Backplate */}
                  <rect x="-35" y="-60" width="70" height="120" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="2" />
                  <text x="0" y="-70" fill="#94A3B8" fontSize="11" textAnchor="middle">
                    Reaction Indicator Strip
                  </text>

                  {/* Indicator Strip Material */}
                  <rect x="-15" y="-45" width="30" height="90" rx="3" fill={activeResult.color} stroke="#FFFFFF" strokeWidth="1.5" />

                  {/* Result Color Glow */}
                  <circle cx="0" cy="0" r="16" fill={activeResult.color} opacity="0.3" filter="blur(4px)" />

                  <text x="0" y="75" fill={activeResult.color} fontSize="12" fontWeight="bold" textAnchor="middle">
                    {activeResult.text}
                  </text>
                </g>

                {/* pH Scale Bar at Top */}
                <g transform="translate(120, 25)">
                  <defs>
                    <linearGradient id="ph-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="50%" stopColor="#22C55E" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="300" height="12" rx="6" fill="url(#ph-gradient)" />
                  <text x="5" y="24" fill="#EF4444" fontSize="10" fontWeight="bold">pH 0 (Acid)</text>
                  <text x="150" y="24" fill="#22C55E" fontSize="10" fontWeight="bold" textAnchor="middle">pH 7 (Neutral)</text>
                  <text x="295" y="24" fill="#3B82F6" fontSize="10" fontWeight="bold" textAnchor="end">pH 14 (Base)</text>

                  {/* Marker for Selected Solution */}
                  <polygon
                    points={`${(selectedSolution.pH / 14) * 300},-4 ${(selectedSolution.pH / 14) * 300 - 6},-12 ${(selectedSolution.pH / 14) * 300 + 6},-12`}
                    fill="#D5D52B"
                  />
                  <text
                    x={(selectedSolution.pH / 14) * 300}
                    y="-16"
                    fill="#D5D52B"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    pH {selectedSolution.pH}
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Solution & Indicator Selectors */}
        <div className="stem-controls-card">
          {/* Solution Selector */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <TestTube size={16} color="#6655D9" /> 1. Select Solution
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
              {testSolutions.map((sol) => (
                <button
                  key={sol.id}
                  onClick={() => handleSelectSolution(sol)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "6px",
                    border: selectedSolution.id === sol.id ? "2px solid #6655D9" : "1px solid #CBD5E1",
                    background: selectedSolution.id === sol.id ? "rgba(102, 85, 217, 0.1)" : "#FFFFFF",
                    fontWeight: selectedSolution.id === sol.id ? "700" : "500",
                    color: selectedSolution.id === sol.id ? "#6655D9" : "#334155",
                    fontSize: "12px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {sol.name}
                </button>
              ))}
            </div>
          </div>

          {/* Indicator Reagent Selector */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Sparkles size={16} color="#16A34A" /> 2. Test with Indicator
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {indicators.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => handleApplyIndicator(ind)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "9px 12px",
                    borderRadius: "6px",
                    border: selectedIndicator.id === ind.id ? "2px solid #16A34A" : "1px solid #CBD5E1",
                    background: selectedIndicator.id === ind.id ? "rgba(22, 163, 74, 0.1)" : "#FFFFFF",
                    color: selectedIndicator.id === ind.id ? "#166534" : "#334155",
                    fontWeight: selectedIndicator.id === ind.id ? "700" : "500",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "3px",
                      backgroundColor: ind.initialColor,
                      border: "1px solid #CBD5E1",
                      display: "inline-block",
                    }}
                  />
                  <span>{ind.name}</span>
                </button>
              ))}
            </div>

            {/* Scientific Explanation of Reaction */}
            <div
              style={{
                marginTop: "14px",
                padding: "10px",
                background: "#F8FAF9",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
                fontSize: "12px",
                color: "#475569",
                lineHeight: "1.4",
              }}
            >
              <strong>Reaction Insight:</strong> In {selectedSolution.name} (pH {selectedSolution.pH}), {selectedIndicator.name} {activeResult.text.toLowerCase()}.
            </div>

            <div style={{ marginTop: "14px", borderTop: "1px solid #E2E8F0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Tests Conducted: <strong>{testedPairs.size}</strong>
              </span>
              <button
                onClick={handleExperimentComplete}
                style={{ background: "transparent", border: "none", color: "#16A34A", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
              >
                Complete Lab & Save →
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

import React, { useState, useEffect } from "react";
import {
  RotateCcw,
  Sparkles,
  Heart,
  Activity,
  Sliders,
  CheckCircle2,
  Award,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import ExperimentIntroModal from "./ExperimentIntroModal";
import ExperimentCompletionModal from "./ExperimentCompletionModal";
import { queueOfflineProgress } from "../../utils/offlineSync";
import { LAB_ACTIVITIES } from "../../data/labRegistry";
import "./LabStyles.css";

const activityMeta = LAB_ACTIVITIES["bio-circulation"];

const heartChambers = [
  {
    id: "ra",
    name: "Right Atrium",
    blood: "Deoxygenated (Oxygen-Poor)",
    color: "#2563EB",
    details: "Receives deoxygenated blood returning from body organs via the superior and inferior vena cava. Contracts to send blood into the right ventricle through the tricuspid valve.",
  },
  {
    id: "rv",
    name: "Right Ventricle",
    blood: "Deoxygenated (Oxygen-Poor)",
    color: "#3B82F6",
    details: "Pumps deoxygenated blood under moderate pressure into the pulmonary artery, directing it to both lungs for carbon dioxide removal and oxygen pickup.",
  },
  {
    id: "la",
    name: "Left Atrium",
    blood: "Oxygenated (Oxygen-Rich)",
    color: "#DC2626",
    details: "Receives fresh, bright-red oxygenated blood from the lungs through the pulmonary veins. Contracts to transfer blood into the left ventricle via the bicuspid (mitral) valve.",
  },
  {
    id: "lv",
    name: "Left Ventricle",
    blood: "Oxygenated (Oxygen-Rich)",
    color: "#EF4444",
    details: "The most muscular chamber of the human heart. Possesses thick walls to pump oxygen-rich blood under high pressure through the aorta to all organs, tissues, and brain cells.",
  },
];

export default function BiologyCirculationLab() {
  const [selectedChamber, setSelectedChamber] = useState(heartChambers[0]);
  const [heartRateBpm, setHeartRateBpm] = useState(72); // 40 to 140 BPM
  const [inspectedChambers, setInspectedChambers] = useState(new Set(["ra"]));

  // Modals
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Supabase Save Status
  const [savingStatus, setSavingStatus] = useState("idle");
  const [savingError, setSavingError] = useState("");

  const pulseIntervalSec = 60 / heartRateBpm;

  const handleSelectChamber = (ch) => {
    setSelectedChamber(ch);
    const updated = new Set(inspectedChambers).add(ch.id);
    setInspectedChambers(updated);
    if (updated.size >= 4) {
      handleExperimentComplete();
    }
  };

  const handleReset = () => {
    setSelectedChamber(heartChambers[0]);
    setHeartRateBpm(72);
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
        {/* Left Column: Anatomical 4-Chamber Heart & Circulation SVG */}
        <div>
          <div className="stem-viewport-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", background: "#EF4444", padding: "3px 10px", borderRadius: "12px", fontWeight: "700" }}>
                  DOUBLE CIRCULATORY SYSTEM
                </span>
                <span style={{ fontSize: "13px", color: "#FCA5A5", fontWeight: "700" }}>
                  {heartRateBpm} BPM (Pulse: {pulseIntervalSec.toFixed(2)}s)
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
                <RotateCcw size={13} /> Reset View
              </button>
            </div>

            {/* SVG Anatomical Heart & Dual Circuit Diagram */}
            <div
              style={{
                width: "100%",
                background: "#06130E",
                borderRadius: "10px",
                border: "1px solid #313E3B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 0",
              }}
            >
              <svg viewBox="0 0 600 300" style={{ width: "95%", height: "280px" }}>
                {/* Lungs at Top (Pulmonary Exchange) */}
                <g transform="translate(300, 35)">
                  <ellipse cx="-45" cy="0" rx="30" ry="18" fill="rgba(244, 114, 182, 0.25)" stroke="#F472B6" strokeWidth="1.5" />
                  <ellipse cx="45" cy="0" rx="30" ry="18" fill="rgba(244, 114, 182, 0.25)" stroke="#F472B6" strokeWidth="1.5" />
                  <text x="0" y="4" fill="#F472B6" fontSize="11" fontWeight="bold" textAnchor="middle">
                    LUNGS (Gas Exchange)
                  </text>
                  <text x="0" y="16" fill="#CBD5E1" fontSize="9" textAnchor="middle">
                    CO₂ Out ➔ O₂ In
                  </text>
                </g>

                {/* Body Tissues at Bottom (Systemic Exchange) */}
                <g transform="translate(300, 265)">
                  <rect x="-80" y="-12" width="160" height="24" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                  <text x="0" y="4" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                    REST OF BODY TISSUES & ORGANS
                  </text>
                </g>

                {/* Circulation Pathway Vessels */}
                {/* 1. Pulmonary Artery: Right Ventricle -> Lungs (Blue) */}
                <path d="M 260,150 C 240,110 240,70 265,52" fill="none" stroke="#2563EB" strokeWidth="4" />
                {/* 2. Pulmonary Vein: Lungs -> Left Atrium (Red) */}
                <path d="M 335,52 C 360,70 360,110 340,150" fill="none" stroke="#DC2626" strokeWidth="4" />

                {/* 3. Vena Cava: Body -> Right Atrium (Blue) */}
                <path d="M 235,255 C 200,220 200,160 245,140" fill="none" stroke="#2563EB" strokeWidth="4" />
                {/* 4. Aorta: Left Ventricle -> Body (Red) */}
                <path d="M 355,200 C 400,220 380,240 365,255" fill="none" stroke="#DC2626" strokeWidth="5" />

                {/* The 4-Chambered Heart (Center) */}
                <g transform="translate(300, 160)">
                  {/* Muscular Outer Wall */}
                  <rect x="-80" y="-55" width="160" height="110" rx="20" fill="#881337" stroke="#BE123C" strokeWidth="3" />

                  {/* Septum (Central dividing wall separating oxygenated and deoxygenated blood) */}
                  <line x1="0" y1="-55" x2="0" y2="55" stroke="#FFFFFF" strokeWidth="4" />
                  {/* Horizontal Atrio-Ventricular Divider */}
                  <line x1="-80" y1="0" x2="80" y2="0" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" />

                  {/* Chamber 1: Right Atrium (Top-Left in mirror diagram) */}
                  <rect
                    x="-75"
                    y="-50"
                    width="70"
                    height="45"
                    rx="10"
                    fill={selectedChamber.id === "ra" ? "#1D4ED8" : "rgba(37, 99, 235, 0.4)"}
                    stroke={selectedChamber.id === "ra" ? "#D5D52B" : "#2563EB"}
                    strokeWidth={selectedChamber.id === "ra" ? "3" : "1.5"}
                    cursor="pointer"
                    onClick={() => handleSelectChamber(heartChambers[0])}
                  />
                  <text x="-40" y="-28" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" cursor="pointer" onClick={() => handleSelectChamber(heartChambers[0])}>
                    Right Atrium
                  </text>
                  <text x="-40" y="-14" fill="#93C5FD" fontSize="9" textAnchor="middle">
                    [Deoxygenated]
                  </text>

                  {/* Chamber 2: Right Ventricle (Bottom-Left) */}
                  <rect
                    x="-75"
                    y="5"
                    width="70"
                    height="45"
                    rx="10"
                    fill={selectedChamber.id === "rv" ? "#1D4ED8" : "rgba(37, 99, 235, 0.4)"}
                    stroke={selectedChamber.id === "rv" ? "#D5D52B" : "#2563EB"}
                    strokeWidth={selectedChamber.id === "rv" ? "3" : "1.5"}
                    cursor="pointer"
                    onClick={() => handleSelectChamber(heartChambers[1])}
                  />
                  <text x="-40" y="27" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" cursor="pointer" onClick={() => handleSelectChamber(heartChambers[1])}>
                    Right Ventricle
                  </text>
                  <text x="-40" y="41" fill="#93C5FD" fontSize="9" textAnchor="middle">
                    [To Lungs]
                  </text>

                  {/* Chamber 3: Left Atrium (Top-Right) */}
                  <rect
                    x="5"
                    y="-50"
                    width="70"
                    height="45"
                    rx="10"
                    fill={selectedChamber.id === "la" ? "#B91C1C" : "rgba(220, 38, 38, 0.4)"}
                    stroke={selectedChamber.id === "la" ? "#D5D52B" : "#DC2626"}
                    strokeWidth={selectedChamber.id === "la" ? "3" : "1.5"}
                    cursor="pointer"
                    onClick={() => handleSelectChamber(heartChambers[2])}
                  />
                  <text x="40" y="-28" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" cursor="pointer" onClick={() => handleSelectChamber(heartChambers[2])}>
                    Left Atrium
                  </text>
                  <text x="40" y="-14" fill="#FCA5A5" fontSize="9" textAnchor="middle">
                    [Oxygenated]
                  </text>

                  {/* Chamber 4: Left Ventricle (Bottom-Right, Thick Wall) */}
                  <rect
                    x="5"
                    y="5"
                    width="70"
                    height="45"
                    rx="10"
                    fill={selectedChamber.id === "lv" ? "#B91C1C" : "rgba(220, 38, 38, 0.4)"}
                    stroke={selectedChamber.id === "lv" ? "#D5D52B" : "#DC2626"}
                    strokeWidth={selectedChamber.id === "lv" ? "3" : "1.5"}
                    cursor="pointer"
                    onClick={() => handleSelectChamber(heartChambers[3])}
                  />
                  <text x="40" y="27" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" cursor="pointer" onClick={() => handleSelectChamber(heartChambers[3])}>
                    Left Ventricle
                  </text>
                  <text x="40" y="41" fill="#FCA5A5" fontSize="9" textAnchor="middle">
                    [To Aorta / Body]
                  </text>
                </g>

                {/* Blood flow direction indicators */}
                <text x="215" y="100" fill="#2563EB" fontSize="14" fontWeight="bold">▲</text>
                <text x="360" y="100" fill="#DC2626" fontSize="14" fontWeight="bold">▼</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Chamber Details & Heart Rate Slider */}
        <div className="stem-controls-card">
          {/* Heart Rate Slider Card */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Activity size={16} color="#EF4444" /> Heart Rate (BPM)
            </h3>

            <div className="stem-slider-group">
              <div className="stem-slider-header">
                <span>Cardiac Frequency</span>
                <span style={{ color: "#EF4444", fontWeight: "700" }}>{heartRateBpm} BPM</span>
              </div>
              <input
                type="range"
                min="40"
                max="140"
                step="2"
                value={heartRateBpm}
                onChange={(e) => setHeartRateBpm(Number(e.target.value))}
                className="stem-slider-input"
              />
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => setHeartRateBpm(60)}
                style={{ flex: 1, padding: "6px", fontSize: "11px", borderRadius: "6px", border: "1px solid #CBD5E1", background: "#FFFFFF", cursor: "pointer" }}
              >
                Resting (60)
              </button>
              <button
                onClick={() => setHeartRateBpm(72)}
                style={{ flex: 1, padding: "6px", fontSize: "11px", borderRadius: "6px", border: "1px solid #CBD5E1", background: "#FFFFFF", cursor: "pointer" }}
              >
                Normal (72)
              </button>
              <button
                onClick={() => setHeartRateBpm(120)}
                style={{ flex: 1, padding: "6px", fontSize: "11px", borderRadius: "6px", border: "1px solid #CBD5E1", background: "#FFFFFF", cursor: "pointer" }}
              >
                Exercise (120)
              </button>
            </div>
          </div>

          {/* Selected Chamber Fact Card */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Heart size={16} color="#DC2626" /> Chamber Anatomy: {selectedChamber.name}
            </h3>

            <div style={{ background: selectedChamber.color === "#2563EB" || selectedChamber.color === "#3B82F6" ? "#EFF6FF" : "#FEF2F2", padding: "12px", borderRadius: "8px", border: `1px solid ${selectedChamber.color}33`, marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: selectedChamber.color, textTransform: "uppercase" }}>
                {selectedChamber.blood}
              </span>
              <p style={{ fontSize: "13px", color: "#334155", margin: "6px 0 0", lineHeight: "1.4" }}>
                {selectedChamber.details}
              </p>
            </div>

            {/* Quick Chamber Selector Grid */}
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#313E3B", display: "block", marginBottom: "6px" }}>
              Inspect 4 Heart Chambers:
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
              {heartChambers.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChamber(ch)}
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: selectedChamber.id === ch.id ? `2px solid ${ch.color}` : "1px solid #CBD5E1",
                    background: selectedChamber.id === ch.id ? `${ch.color}15` : "#FFFFFF",
                    color: selectedChamber.id === ch.id ? ch.color : "#334155",
                    fontWeight: selectedChamber.id === ch.id ? "700" : "500",
                    fontSize: "12px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  {ch.name}
                </button>
              ))}
            </div>

            <div style={{ marginTop: "14px", borderTop: "1px solid #E2E8F0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Chambers Inspected: <strong>{inspectedChambers.size} of 4</strong>
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

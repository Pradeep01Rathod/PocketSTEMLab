import React, { useState } from "react";
import {
  RotateCcw,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import ExperimentIntroModal from "./ExperimentIntroModal";
import ExperimentCompletionModal from "./ExperimentCompletionModal";
import { queueOfflineProgress } from "../../utils/offlineSync";
import { LAB_ACTIVITIES } from "../../data/labRegistry";
import "./LabStyles.css";

const activityMeta = LAB_ACTIVITIES["physics-reflection"];

const anglePresets = [
  { label: "Normal (0°)", angle: 0 },
  { label: "30°", angle: 30 },
  { label: "45°", angle: 45 },
  { label: "60°", angle: 60 },
];

export default function PhysicsReflectionLab() {
  const [incidentAngle, setIncidentAngle] = useState(45); // degrees relative to normal
  const [testedAngles, setTestedAngles] = useState(new Set([45]));

  // Modals
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Supabase Save Status
  const [savingStatus, setSavingStatus] = useState("idle");
  const [savingError, setSavingError] = useState("");

  const reflectedAngle = incidentAngle; // 1st Law of Reflection: i = r

  const handleAngleChange = (angle) => {
    setIncidentAngle(angle);
    const updated = new Set(testedAngles).add(angle);
    setTestedAngles(updated);
    if (updated.size >= 3) {
      handleExperimentComplete();
    }
  };

  const handleReset = () => {
    setIncidentAngle(45);
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

  // Ray geometry: Point of incidence at (300, 220)
  const originX = 300;
  const originY = 220;
  const rayLength = 190;

  // Incident ray comes from top-left: angle measured relative to vertical normal (0 deg is straight up)
  const incRad = (incidentAngle * Math.PI) / 180;
  const incStartX = originX - rayLength * Math.sin(incRad);
  const incStartY = originY - rayLength * Math.cos(incRad);

  // Reflected ray goes to top-right: angle relative to vertical normal
  const refEndX = originX + rayLength * Math.sin(incRad);
  const refEndY = originY - rayLength * Math.cos(incRad);

  return (
    <div className="stem-lab-main">
      <div className="stem-lab-grid">
        {/* Left Column: Optics Ray Viewport */}
        <div>
          <div className="stem-viewport-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", background: "#EF991F", padding: "3px 10px", borderRadius: "12px", fontWeight: "700" }}>
                  RAY OPTICS SIMULATOR
                </span>
                <span style={{ fontSize: "13px", color: "#4ADE80", fontWeight: "600" }}>
                  ✓ ∠i = ∠r = {incidentAngle}°
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
                <RotateCcw size={13} /> Reset Ray
              </button>
            </div>

            {/* SVG Optical Ray Diagram */}
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
              <svg viewBox="0 0 600 280" style={{ width: "95%", height: "260px" }}>
                {/* Horizontal Silvered Mirror */}
                <rect x="50" y="220" width="500" height="12" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="2" />
                {/* Mirror Hatch Marks */}
                {Array.from({ length: 25 }, (_, i) => 60 + i * 20).map((x) => (
                  <line key={x} x1={x} y1="232" x2={x - 8} y2="242" stroke="#64748B" strokeWidth="1.5" />
                ))}
                <text x="50" y="260" fill="#94A3B8" fontSize="11" fontWeight="bold">
                  Polished Plane Mirror
                </text>

                {/* Vertical Normal Line (perpendicular to mirror at origin) */}
                <line
                  x1={originX}
                  y1="220"
                  x2={originX}
                  y2="20"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
                <text x={originX} y="15" fill="#38BDF8" fontSize="12" fontWeight="bold" textAnchor="middle">
                  Normal (90° to Mirror)
                </text>

                {/* Laser Emitter Icon / Box */}
                <circle cx={incStartX} cy={incStartY} r="8" fill="#EF4444" stroke="#F87171" strokeWidth="2" />
                <text x={incStartX - 10} y={incStartY - 10} fill="#EF4444" fontSize="11" fontWeight="bold" textAnchor="end">
                  Laser Source
                </text>

                {/* Incident Ray (Red Laser) */}
                <line
                  x1={incStartX}
                  y1={incStartY}
                  x2={originX}
                  y2={originY}
                  stroke="#EF4444"
                  strokeWidth="3.5"
                />
                {/* Reflected Ray (Amber/Yellow Ray) */}
                <line
                  x1={originX}
                  y1={originY}
                  x2={refEndX}
                  y2={refEndY}
                  stroke="#D5D52B"
                  strokeWidth="3.5"
                />

                {/* Point of Incidence Marker */}
                <circle cx={originX} cy={originY} r="5" fill="#D5D52B" stroke="#000000" strokeWidth="2" />
                <text x={originX} y="210" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Point O
                </text>

                {/* Angle of Incidence Arc */}
                {incidentAngle > 0 && (
                  <g>
                    <path
                      d={`M ${originX} 140 A 80 80 0 0 0 ${originX - 80 * Math.sin(incRad)} ${originY - 80 * Math.cos(incRad)}`}
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="2"
                    />
                    <text
                      x={originX - 45 * Math.sin(incRad / 2)}
                      y={originY - 45 * Math.cos(incRad / 2)}
                      fill="#EF4444"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ∠i = {incidentAngle}°
                    </text>
                  </g>
                )}

                {/* Angle of Reflection Arc */}
                {reflectedAngle > 0 && (
                  <g>
                    <path
                      d={`M ${originX} 140 A 80 80 0 0 1 ${originX + 80 * Math.sin(incRad)} ${originY - 80 * Math.cos(incRad)}`}
                      fill="none"
                      stroke="#D5D52B"
                      strokeWidth="2"
                    />
                    <text
                      x={originX + 45 * Math.sin(incRad / 2)}
                      y={originY - 45 * Math.cos(incRad / 2)}
                      fill="#D5D52B"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ∠r = {reflectedAngle}°
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Angle Inspector */}
        <div className="stem-controls-card">
          {/* Angle Slider Card */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Sliders size={16} color="#EF991F" /> Set Angle of Incidence (∠i)
            </h3>

            <div className="stem-slider-group">
              <div className="stem-slider-header">
                <span>Incident Angle (i)</span>
                <span style={{ color: "#EF4444", fontWeight: "700" }}>{incidentAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="75"
                step="1"
                value={incidentAngle}
                onChange={(e) => handleAngleChange(Number(e.target.value))}
                className="stem-slider-input"
              />
            </div>

            {/* Quick Angle Presets */}
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#313E3B", display: "block", marginBottom: "6px" }}>
              Quick Angle Presets:
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
              {anglePresets.map((preset) => (
                <button
                  key={preset.angle}
                  onClick={() => handleAngleChange(preset.angle)}
                  style={{
                    padding: "6px",
                    borderRadius: "6px",
                    border: incidentAngle === preset.angle ? "2px solid #EF991F" : "1px solid #CBD5E1",
                    background: incidentAngle === preset.angle ? "rgba(239, 153, 31, 0.12)" : "#FFFFFF",
                    color: incidentAngle === preset.angle ? "#B45309" : "#334155",
                    fontWeight: incidentAngle === preset.angle ? "700" : "500",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Laws of Reflection Verification */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <CheckCircle2 size={16} color="#16A34A" /> Laws of Reflection Verification
            </h3>

            <div className="stem-metric-grid">
              <div className="stem-metric-item">
                <span className="stem-metric-label">Angle of Incidence (∠i)</span>
                <span className="stem-metric-val" style={{ color: "#EF4444" }}>
                  {incidentAngle}°
                </span>
              </div>
              <div className="stem-metric-item">
                <span className="stem-metric-label">Angle of Reflection (∠r)</span>
                <span className="stem-metric-val" style={{ color: "#16A34A" }}>
                  {reflectedAngle}°
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: "12px",
                padding: "10px",
                background: "#ECFDF5",
                borderRadius: "8px",
                border: "1px solid #A7F3D0",
                fontSize: "12px",
                color: "#065F46",
              }}
            >
              <strong>1st Law of Reflection:</strong> The angle of incidence equals the angle of reflection (∠i = ∠r = {incidentAngle}°).
            </div>

            <div style={{ marginTop: "14px", borderTop: "1px solid #E2E8F0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Angles Tested: <strong>{testedAngles.size}</strong>
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

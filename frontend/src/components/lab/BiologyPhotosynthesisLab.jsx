import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  RotateCcw,
  Sparkles,
  Sun,
  Droplets,
  Wind,
  Gauge,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import ExperimentIntroModal from "./ExperimentIntroModal";
import ExperimentCompletionModal from "./ExperimentCompletionModal";
import { queueOfflineProgress } from "../../utils/offlineSync";
import { LAB_ACTIVITIES } from "../../data/labRegistry";
import "./LabStyles.css";

const activityMeta = LAB_ACTIVITIES["bio-photosynthesis"];

export default function BiologyPhotosynthesisLab() {
  const [lightIntensity, setLightIntensity] = useState(70); // 0 to 100%
  const [co2Level, setCo2Level] = useState(60); // 0 to 100%
  const [waterLevel, setWaterLevel] = useState(80); // 0 to 100%

  // Simulation state
  const [bubbles, setBubbles] = useState([]);
  const [bubblesProduced, setBubblesProduced] = useState(0);

  // Modals
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Supabase Save Status
  const [savingStatus, setSavingStatus] = useState("idle");
  const [savingError, setSavingError] = useState("");

  const animFrameRef = useRef(null);
  const lastBubbleTimeRef = useRef(0);

  // Rate of photosynthesis calculation: Liebig's Law of the Minimum
  const calculatedRate = Math.round(
    ((lightIntensity / 100) * (co2Level / 100) * (waterLevel / 100)) * 100
  );

  const handleExperimentComplete = useCallback(async () => {
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
  }, [savingStatus]);

  // Bubble animation loop
  useEffect(() => {
    let active = true;

    const loop = (timestamp) => {
      if (!active) return;

      // Spawn bubble based on rate
      if (calculatedRate > 5 && timestamp - lastBubbleTimeRef.current > (1500 - calculatedRate * 12)) {
        lastBubbleTimeRef.current = timestamp;
        setBubbles((prev) => [
          ...prev.slice(-15),
          { id: Math.random(), x: 235 + (Math.random() - 0.5) * 20, y: 170, vy: 1 + calculatedRate / 40 },
        ]);
        setBubblesProduced((prev) => {
          const next = prev + 1;
          if (next >= 12 && savingStatus === "idle") {
            handleExperimentComplete();
          }
          return next;
        });
      }

      // Animate bubbles rising
      setBubbles((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - b.vy }))
          .filter((b) => b.y > 60)
      );

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [calculatedRate, savingStatus, handleExperimentComplete]);

  const handleReset = () => {
    setLightIntensity(70);
    setCo2Level(60);
    setWaterLevel(80);
    setBubbles([]);
  };

  return (
    <div className="stem-lab-main">
      <div className="stem-lab-grid">
        {/* Left Column: Photosynthesis Visual Apparatus */}
        <div>
          <div className="stem-viewport-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", background: "#16A34A", padding: "3px 10px", borderRadius: "12px", fontWeight: "700" }}>
                  PHOTOSYNTHESIS CHAMBER
                </span>
                <span style={{ fontSize: "13px", color: calculatedRate > 40 ? "#4ADE80" : "#FBBF24", fontWeight: "600" }}>
                  Rate: {calculatedRate}% ({calculatedRate === 0 ? "Inactive" : calculatedRate < 40 ? "Low" : "High Production"})
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
                <RotateCcw size={13} /> Reset Controls
              </button>
            </div>

            {/* SVG Aquatic Plant Photosynthesis Apparatus */}
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
                {/* Sunlight Emitter / Lamp on Left */}
                <g transform="translate(60, 60)">
                  <circle cx="0" cy="0" r={18 + (lightIntensity / 100) * 10} fill="#FBBF24" opacity="0.9" />
                  <circle cx="0" cy="0" r={26 + (lightIntensity / 100) * 16} fill="rgba(251, 191, 36, 0.25)" />
                  {/* Sun rays pointing to plant */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <line
                      key={i}
                      x1="20"
                      y1={-10 + i * 8}
                      x2={120 + (lightIntensity / 100) * 30}
                      y2={40 + i * 16}
                      stroke="#FDE047"
                      strokeWidth={1 + (lightIntensity / 100) * 2}
                      strokeDasharray="4 4"
                      opacity={lightIntensity / 100}
                    />
                  ))}
                  <text x="0" y="45" fill="#FDE047" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Light {lightIntensity}%
                  </text>
                </g>

                {/* Glass Beaker Container */}
                <g transform="translate(240, 60)">
                  <rect x="-80" y="0" width="160" height="190" rx="6" fill="rgba(255,255,255,0.06)" stroke="#94A3B8" strokeWidth="2" />
                  {/* Water Solution inside Beaker */}
                  <rect x="-78" y="25" width="156" height="163" rx="4" fill="rgba(56, 189, 248, 0.25)" />

                  {/* Inverted Glass Funnel */}
                  <polygon points="-50,180 50,180 6,100 -6,100" fill="rgba(255,255,255,0.15)" stroke="#CBD5E1" strokeWidth="1.5" />
                  {/* Inverted Test Tube on top */}
                  <rect x="-10" y="10" width="20" height="90" rx="6" fill="rgba(255,255,255,0.2)" stroke="#CBD5E1" strokeWidth="1.5" />
                  {/* Oxygen Gas Collection at top of test tube */}
                  <rect x="-9" y="12" width="18" height="24" rx="4" fill="rgba(34, 197, 94, 0.4)" />
                  <text x="0" y="28" fill="#4ADE80" fontSize="9" fontWeight="bold" textAnchor="middle">
                    O₂ Gas
                  </text>

                  {/* Hydrilla Green Aquatic Plant inside Funnel */}
                  <path
                    d="M 0,180 Q -10,140 -20,120 Q -5,130 0,150 Q 15,130 20,115 Q 10,140 0,180"
                    fill="#15803D"
                    stroke="#22C55E"
                    strokeWidth="2"
                  />
                  <ellipse cx="-12" cy="135" rx="8" ry="4" fill="#16A34A" transform="rotate(-30 -12 135)" />
                  <ellipse cx="14" cy="130" rx="8" ry="4" fill="#16A34A" transform="rotate(30 14 130)" />
                  <ellipse cx="-8" cy="155" rx="7" ry="3.5" fill="#16A34A" transform="rotate(-20 -8 155)" />
                  <ellipse cx="10" cy="150" rx="7" ry="3.5" fill="#16A34A" transform="rotate(20 10 150)" />
                  <text x="0" y="200" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Hydrilla Aquatic Plant
                  </text>

                  {/* Rising Oxygen (O2) Bubbles */}
                  {bubbles.map((b) => (
                    <circle key={b.id} cx={b.x - 240} cy={b.y - 60} r="3" fill="#4ADE80" stroke="#FFFFFF" strokeWidth="1" />
                  ))}
                </g>

                {/* Chemical Inputs / Outputs Flow Legend on Right */}
                <g transform="translate(430, 80)">
                  <rect x="-55" y="-10" width="110" height="150" rx="8" fill="#1E293B" stroke="#334155" strokeWidth="1.5" />
                  <text x="0" y="10" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    INPUT RAW MATERIALS
                  </text>
                  <text x="0" y="30" fill="#FDE047" fontSize="11" textAnchor="middle">
                    ☀️ Light: {lightIntensity}%
                  </text>
                  <text x="0" y="50" fill="#60A5FA" fontSize="11" textAnchor="middle">
                    💧 H₂O: {waterLevel}%
                  </text>
                  <text x="0" y="70" fill="#CBD5E1" fontSize="11" textAnchor="middle">
                    💨 CO₂: {co2Level}%
                  </text>

                  <line x1="-45" y1="85" x2="45" y2="85" stroke="#475569" strokeWidth="1" />

                  <text x="0" y="102" fill="#4ADE80" fontSize="10" fontWeight="bold" textAnchor="middle">
                    OUTPUT PRODUCTS
                  </text>
                  <text x="0" y="120" fill="#4ADE80" fontSize="11" fontWeight="bold" textAnchor="middle">
                    🌿 Glucose (C₆H₁₂O₆)
                  </text>
                  <text x="0" y="136" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    🫧 Oxygen (O₂)
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Environmental Control Sliders */}
        <div className="stem-controls-card">
          {/* Sliders Card */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Sparkles size={16} color="#16A34A" /> Environmental Inputs
            </h3>

            {/* Sunlight Slider */}
            <div className="stem-slider-group">
              <div className="stem-slider-header">
                <span><Sun size={14} style={{ display: "inline", verticalAlign: "middle", color: "#FBBF24" }} /> Light Intensity</span>
                <span style={{ color: "#FBBF24", fontWeight: "700" }}>{lightIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={lightIntensity}
                onChange={(e) => setLightIntensity(Number(e.target.value))}
                className="stem-slider-input"
              />
            </div>

            {/* CO2 Concentration Slider */}
            <div className="stem-slider-group">
              <div className="stem-slider-header">
                <span><Wind size={14} style={{ display: "inline", verticalAlign: "middle", color: "#94A3B8" }} /> Carbon Dioxide (CO₂)</span>
                <span style={{ color: "#94A3B8", fontWeight: "700" }}>{co2Level}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={co2Level}
                onChange={(e) => setCo2Level(Number(e.target.value))}
                className="stem-slider-input"
              />
            </div>

            {/* Water Availability Slider */}
            <div className="stem-slider-group">
              <div className="stem-slider-header">
                <span><Droplets size={14} style={{ display: "inline", verticalAlign: "middle", color: "#38BDF8" }} /> Water (H₂O)</span>
                <span style={{ color: "#38BDF8", fontWeight: "700" }}>{waterLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={waterLevel}
                onChange={(e) => setWaterLevel(Number(e.target.value))}
                className="stem-slider-input"
              />
            </div>
          </div>

          {/* Chemical Equation & Rate Card */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Gauge size={16} color="#16A34A" /> Balanced Chemical Equation
            </h3>

            <div
              style={{
                background: "#0F1A15",
                padding: "10px 14px",
                borderRadius: "8px",
                color: "#FFFFFF",
                fontSize: "12px",
                fontFamily: "monospace",
                lineHeight: "1.5",
                marginBottom: "12px",
              }}
            >
              6CO₂ + 6H₂O <span style={{ color: "#D5D52B" }}>[Light + Chlorophyll]</span> ➔ C₆H₁₂O₆ + 6O₂
            </div>

            <div className="stem-metric-grid">
              <div className="stem-metric-item">
                <span className="stem-metric-label">Photosynthesis Rate</span>
                <span className="stem-metric-val" style={{ color: "#16A34A" }}>
                  {calculatedRate}%
                </span>
              </div>
              <div className="stem-metric-item">
                <span className="stem-metric-label">O₂ Bubbles Generated</span>
                <span className="stem-metric-val">{bubblesProduced}</span>
              </div>
            </div>

            <div style={{ marginTop: "14px", borderTop: "1px solid #E2E8F0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Target: <strong>12 bubbles</strong>
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

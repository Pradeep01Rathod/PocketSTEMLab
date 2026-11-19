import React, { useState, useEffect, useRef } from "react";
import {
  RotateCcw,
  Sparkles,
  Flame,
  Thermometer,
  Boxes,
  Award,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import ExperimentIntroModal from "./ExperimentIntroModal";
import ExperimentCompletionModal from "./ExperimentCompletionModal";
import { queueOfflineProgress } from "../../utils/offlineSync";
import { LAB_ACTIVITIES } from "../../data/labRegistry";
import "./LabStyles.css";

const activityMeta = LAB_ACTIVITIES["chem-matter-kinetic"];

export default function ChemistryStatesLab() {
  const [temperature, setTemperature] = useState(25); // Celsius (-50 to 150)
  const [exploredStates, setExploredStates] = useState(new Set(["liquid"]));

  // Modals
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Supabase Save Status
  const [savingStatus, setSavingStatus] = useState("idle");
  const [savingError, setSavingError] = useState("");

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Phase state determination
  const statePhase = temperature < 0 ? "solid" : temperature > 100 ? "gas" : "liquid";

  // Initialize particles once
  useEffect(() => {
    const numParticles = 48;
    const initialParticles = [];
    for (let i = 0; i < numParticles; i++) {
      initialParticles.push({
        x: 100 + (i % 8) * 35,
        y: 180 + Math.floor(i / 8) * 25,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        baseX: 100 + (i % 8) * 35,
        baseY: 180 + Math.floor(i / 8) * 25,
      });
    }
    particlesRef.current = initialParticles;
  }, []);

  // Particle motion canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw container walls
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 30, width - 80, height - 60);

      // Kinetic speed multiplier based on temp: 0.2 at -50°C, 1.0 at 25°C, 3.5 at 150°C
      const speedFactor = Math.max(0.15, (temperature + 60) / 75);

      particlesRef.current.forEach((p, idx) => {
        if (statePhase === "solid") {
          // Rigid lattice vibration around baseX, baseY
          const jitter = (temperature + 50) / 100;
          p.x = p.baseX + (Math.random() - 0.5) * (jitter * 5);
          p.y = p.baseY + (Math.random() - 0.5) * (jitter * 5);

          // Draw lattice bonds between neighbors
          if (idx % 8 !== 7) {
            const nextP = particlesRef.current[idx + 1];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(nextP.x, nextP.y);
            ctx.strokeStyle = "rgba(102, 85, 217, 0.35)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        } else if (statePhase === "liquid") {
          // Dynamic flow, settling at bottom half
          p.x += p.vx * speedFactor;
          p.y += p.vy * speedFactor;

          // Boundaries: bottom half of vessel
          const minX = 55;
          const maxX = width - 55;
          const minY = height / 2 - 10;
          const maxY = height - 45;

          if (p.x < minX) { p.x = minX; p.vx *= -1; }
          if (p.x > maxX) { p.x = maxX; p.vx *= -1; }
          if (p.y < minY) { p.y = minY; p.vy *= -1; }
          if (p.y > maxY) { p.y = maxY; p.vy *= -1; }
        } else {
          // Gas: rapid motion, bouncing off all 4 walls
          p.x += p.vx * speedFactor * 1.8;
          p.y += p.vy * speedFactor * 1.8;

          const minX = 55;
          const maxX = width - 55;
          const minY = 45;
          const maxY = height - 45;

          if (p.x < minX) { p.x = minX; p.vx *= -1; }
          if (p.x > maxX) { p.x = maxX; p.vx *= -1; }
          if (p.y < minY) { p.y = minY; p.vy *= -1; }
          if (p.y > maxY) { p.y = maxY; p.vy *= -1; }
        }

        // Draw particle sphere
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        if (statePhase === "solid") {
          ctx.fillStyle = "#38BDF8"; // Cyan blue ice
        } else if (statePhase === "liquid") {
          ctx.fillStyle = "#2563EB"; // Water blue
        } else {
          ctx.fillStyle = "#EF4444"; // Red hot steam
        }
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [temperature, statePhase]);

  const handleTempChange = (newTemp) => {
    setTemperature(newTemp);
    const newPhase = newTemp < 0 ? "solid" : newTemp > 100 ? "gas" : "liquid";
    const updated = new Set(exploredStates).add(newPhase);
    setExploredStates(updated);
    if (updated.size >= 3) {
      handleExperimentComplete();
    }
  };

  const handleReset = () => {
    setTemperature(25);
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
        {/* Left Column: Particle Canvas Viewport */}
        <div>
          <div className="stem-viewport-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", background: "#6655D9", padding: "3px 10px", borderRadius: "12px", fontWeight: "700" }}>
                  KINETIC PARTICLE CHAMBER
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: statePhase === "solid" ? "#38BDF8" : statePhase === "liquid" ? "#60A5FA" : "#F87171",
                  }}
                >
                  Current State: {statePhase.toUpperCase()}
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
                <RotateCcw size={13} /> Reset Room Temp (25°C)
              </button>
            </div>

            {/* Canvas Vessel */}
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
              <canvas ref={canvasRef} width={500} height={280} style={{ width: "95%", height: "260px" }} />
            </div>
          </div>
        </div>

        {/* Right Column: Temperature Controls & Phase Info */}
        <div className="stem-controls-card">
          {/* Temperature Slider Card */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Thermometer size={16} color="#EF4444" /> Thermal Energy Control
            </h3>

            <div className="stem-slider-group">
              <div className="stem-slider-header">
                <span>Temperature (°C)</span>
                <span style={{ color: temperature < 0 ? "#38BDF8" : temperature > 100 ? "#EF4444" : "#16A34A", fontWeight: "700" }}>
                  {temperature}°C
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="150"
                step="1"
                value={temperature}
                onChange={(e) => handleTempChange(Number(e.target.value))}
                className="stem-slider-input"
              />
            </div>

            {/* Quick State Presets */}
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#313E3B", display: "block", marginBottom: "6px" }}>
              Phase Presets:
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
              <button
                onClick={() => handleTempChange(-20)}
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: statePhase === "solid" ? "2px solid #38BDF8" : "1px solid #CBD5E1",
                  background: statePhase === "solid" ? "rgba(56, 189, 248, 0.15)" : "#FFFFFF",
                  color: statePhase === "solid" ? "#0284C7" : "#334155",
                  fontWeight: "700",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Solid (-20°C)
              </button>
              <button
                onClick={() => handleTempChange(25)}
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: statePhase === "liquid" ? "2px solid #2563EB" : "1px solid #CBD5E1",
                  background: statePhase === "liquid" ? "rgba(37, 99, 235, 0.15)" : "#FFFFFF",
                  color: statePhase === "liquid" ? "#1D4ED8" : "#334155",
                  fontWeight: "700",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Liquid (25°C)
              </button>
              <button
                onClick={() => handleTempChange(120)}
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: statePhase === "gas" ? "2px solid #EF4444" : "1px solid #CBD5E1",
                  background: statePhase === "gas" ? "rgba(239, 68, 68, 0.15)" : "#FFFFFF",
                  color: statePhase === "gas" ? "#B91C1C" : "#334155",
                  fontWeight: "700",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Gas (120°C)
              </button>
            </div>
          </div>

          {/* Kinetic Properties Card */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Boxes size={16} color="#6655D9" /> Kinetic Molecular Properties
            </h3>

            <div className="stem-metric-grid">
              <div className="stem-metric-item">
                <span className="stem-metric-label">Particle Arrangement</span>
                <span className="stem-metric-val" style={{ fontSize: "14px" }}>
                  {statePhase === "solid" ? "Fixed Lattice" : statePhase === "liquid" ? "Fluid Random" : "Dispersed"}
                </span>
              </div>
              <div className="stem-metric-item">
                <span className="stem-metric-label">Intermolecular Spaces</span>
                <span className="stem-metric-val" style={{ fontSize: "14px" }}>
                  {statePhase === "solid" ? "Extremely Small" : statePhase === "liquid" ? "Moderate" : "Very Large"}
                </span>
              </div>
              <div className="stem-metric-item">
                <span className="stem-metric-label">Kinetic Energy</span>
                <span className="stem-metric-val" style={{ fontSize: "14px" }}>
                  {statePhase === "solid" ? "Vibrational only" : statePhase === "liquid" ? "Translational" : "High Speed"}
                </span>
              </div>
              <div className="stem-metric-item">
                <span className="stem-metric-label">Shape & Volume</span>
                <span className="stem-metric-val" style={{ fontSize: "14px" }}>
                  {statePhase === "solid" ? "Definite Shape" : statePhase === "liquid" ? "Definite Volume" : "No Definite Shape"}
                </span>
              </div>
            </div>

            <div style={{ marginTop: "14px", borderTop: "1px solid #E2E8F0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Phases Explored: <strong>{exploredStates.size} of 3</strong>
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

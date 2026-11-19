import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  RotateCcw,
  Sparkles,
  Play,
  Pause,
  Clock,
  Globe2,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import ExperimentIntroModal from "./ExperimentIntroModal";
import ExperimentCompletionModal from "./ExperimentCompletionModal";
import { queueOfflineProgress } from "../../utils/offlineSync";
import { LAB_ACTIVITIES } from "../../data/labRegistry";
import "./LabStyles.css";

const activityMeta = LAB_ACTIVITIES["physics-pendulum"];

const celestialBodies = [
  { id: "earth", name: "Earth (g = 9.8 m/s²)", g: 9.8 },
  { id: "moon", name: "Moon (g = 1.62 m/s²)", g: 1.62 },
  { id: "mars", name: "Mars (g = 3.72 m/s²)", g: 3.72 },
  { id: "jupiter", name: "Jupiter (g = 24.8 m/s²)", g: 24.8 },
];

export default function PhysicsPendulumLab() {
  // Parameters
  const [length, setLength] = useState(1.0); // meters (0.2 to 2.0)
  const [selectedBody, setSelectedBody] = useState(celestialBodies[0]);
  const [maxAngleDeg, setMaxAngleDeg] = useState(15); // degrees
  const [isRunning, setIsRunning] = useState(false);

  // Simulation dynamics
  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  const [oscillations, setOscillations] = useState(0);
  const [currentAngleDeg, setCurrentAngleDeg] = useState(15);

  // Modals
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Supabase Save Status
  const [savingStatus, setSavingStatus] = useState("idle");
  const [savingError, setSavingError] = useState("");

  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedAtRef = useRef(0);

  // Theoretical physics calculations
  const g = selectedBody.g;
  const theoreticalPeriod = 2 * Math.PI * Math.sqrt(length / g);
  const frequency = 1 / theoreticalPeriod;

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

  useEffect(() => {
    if (!isRunning) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp - pausedAtRef.current * 1000;
      }

      const totalSec = (timestamp - startTimeRef.current) / 1000;
      setElapsedTime(totalSec);

      // Simple Harmonic Oscillation formula: theta(t) = theta0 * cos(2pi * t / T)
      const omega = (2 * Math.PI) / theoreticalPeriod;
      const angle = maxAngleDeg * Math.cos(omega * totalSec);
      setCurrentAngleDeg(angle);

      // Count full cycles
      const completedOsc = Math.floor(totalSec / theoreticalPeriod);
      setOscillations(completedOsc);

      if (completedOsc >= 5 && savingStatus === "idle") {
        handleExperimentComplete();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, length, g, maxAngleDeg, theoreticalPeriod, savingStatus, handleExperimentComplete]);

  const handleTogglePlay = () => {
    if (isRunning) {
      pausedAtRef.current = elapsedTime;
      startTimeRef.current = null;
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    startTimeRef.current = null;
    pausedAtRef.current = 0;
    setElapsedTime(0);
    setOscillations(0);
    setCurrentAngleDeg(maxAngleDeg);
  };

  // Convert string length (0.2m to 2.0m) to SVG pixel length (70px to 210px)
  const pixelLength = 70 + (length / 2.0) * 140;
  // Pivot coordinates at (250, 40)
  const angleRad = (currentAngleDeg * Math.PI) / 180;
  const bobX = 250 + pixelLength * Math.sin(angleRad);
  const bobY = 40 + pixelLength * Math.cos(angleRad);

  return (
    <div className="stem-lab-main">
      <div className="stem-lab-grid">
        {/* Left Column: Animated Pendulum Viewport */}
        <div>
          <div className="stem-viewport-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", background: "#EF991F", padding: "3px 10px", borderRadius: "12px", fontWeight: "700" }}>
                  PERIODIC MOTION SIMULATOR
                </span>
                <span style={{ fontSize: "13px", color: isRunning ? "#4ADE80" : "#94A3B8" }}>
                  {isRunning ? "● Oscillating" : "❚❚ Paused"}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleTogglePlay}
                  style={{
                    background: isRunning ? "#DC2626" : "#16A34A",
                    border: "none",
                    color: "#FFFFFF",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  {isRunning ? <Pause size={14} /> : <Play size={14} />}
                  {isRunning ? "Pause" : "Start Swing"}
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#FFFFFF",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                  }}
                >
                  <RotateCcw size={14} /> Reset
                </button>
              </div>
            </div>

            {/* SVG Pendulum Canvas */}
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
              <svg viewBox="0 0 500 300" style={{ width: "95%", height: "280px" }}>
                {/* Ceiling Support Bar */}
                <rect x="180" y="25" width="140" height="15" rx="3" fill="#475569" stroke="#64748B" strokeWidth="2" />
                {/* Pivot Mount */}
                <circle cx="250" cy="40" r="7" fill="#D5D52B" stroke="#0F172A" strokeWidth="2" />

                {/* Mean Position Dashed Equilibrium Line */}
                <line x1="250" y1="40" x2="250" y2="270" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="250" y="285" fill="#94A3B8" fontSize="10" textAnchor="middle">
                  Mean Equilibrium Position
                </text>

                {/* Pendulum Swing Arc Trajectory */}
                <path
                  d={`M ${250 - pixelLength * Math.sin((maxAngleDeg * Math.PI) / 180)} ${
                    40 + pixelLength * Math.cos((maxAngleDeg * Math.PI) / 180)
                  } A ${pixelLength} ${pixelLength} 0 0 0 ${
                    250 + pixelLength * Math.sin((maxAngleDeg * Math.PI) / 180)
                  } ${40 + pixelLength * Math.cos((maxAngleDeg * Math.PI) / 180)}`}
                  fill="none"
                  stroke="rgba(239, 153, 31, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />

                {/* Pendulum Suspension String */}
                <line x1="250" y1="40" x2={bobX} y2={bobY} stroke="#E2E8F0" strokeWidth="2.5" />

                {/* Pendulum Metallic Spherical Bob */}
                <defs>
                  <radialGradient id="bob-gradient" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FDE047" />
                    <stop offset="60%" stopColor="#EF991F" />
                    <stop offset="100%" stopColor="#9A3412" />
                  </radialGradient>
                </defs>
                <circle cx={bobX} cy={bobY} r="18" fill="url(#bob-gradient)" stroke="#FFFFFF" strokeWidth="2" />

                {/* Extreme Positions Markers */}
                <text x="80" y="220" fill="#EF991F" fontSize="11" textAnchor="middle">
                  ← Extreme Position
                </text>
                <text x="420" y="220" fill="#EF991F" fontSize="11" textAnchor="middle">
                  Extreme Position →
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Dynamic Readout */}
        <div className="stem-controls-card">
          {/* Controls Card */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Sparkles size={16} color="#EF991F" /> Physical Parameters
            </h3>

            {/* String Length */}
            <div className="stem-slider-group">
              <div className="stem-slider-header">
                <span>String Length (L)</span>
                <span>{length.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.05"
                value={length}
                onChange={(e) => {
                  setLength(Number(e.target.value));
                  handleReset();
                }}
                className="stem-slider-input"
              />
            </div>

            {/* Initial Angle */}
            <div className="stem-slider-group">
              <div className="stem-slider-header">
                <span>Release Angle (θ₀)</span>
                <span>{maxAngleDeg}°</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={maxAngleDeg}
                onChange={(e) => {
                  setMaxAngleDeg(Number(e.target.value));
                  setCurrentAngleDeg(Number(e.target.value));
                }}
                className="stem-slider-input"
              />
            </div>

            {/* Gravitational Environment */}
            <div style={{ marginTop: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#313E3B", display: "block", marginBottom: "6px" }}>
                <Globe2 size={14} style={{ display: "inline", verticalAlign: "middle" }} /> Celestial Gravity (g)
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
                {celestialBodies.map((body) => (
                  <button
                    key={body.id}
                    onClick={() => {
                      setSelectedBody(body);
                      handleReset();
                    }}
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      border: selectedBody.id === body.id ? "2px solid #EF991F" : "1px solid #CBD5E1",
                      background: selectedBody.id === body.id ? "rgba(239, 153, 31, 0.1)" : "#FFFFFF",
                      color: selectedBody.id === body.id ? "#B45309" : "#334155",
                      fontWeight: selectedBody.id === body.id ? "700" : "500",
                      fontSize: "11px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {body.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Measurements & Calculations Card */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Clock size={16} color="#16A34A" /> Time Period & Oscillation Formula
            </h3>

            <div className="stem-metric-grid">
              <div className="stem-metric-item">
                <span className="stem-metric-label">Theoretical Period (T)</span>
                <span className="stem-metric-val" style={{ color: "#EF991F" }}>
                  {theoreticalPeriod.toFixed(2)} s
                </span>
                <span style={{ fontSize: "10px", color: "#64748B", marginTop: "2px" }}>
                  T = 2π√(L/g)
                </span>
              </div>
              <div className="stem-metric-item">
                <span className="stem-metric-label">Frequency (f = 1/T)</span>
                <span className="stem-metric-val">{frequency.toFixed(2)} Hz</span>
              </div>
              <div className="stem-metric-item">
                <span className="stem-metric-label">Stopwatch Time</span>
                <span className="stem-metric-val">{elapsedTime.toFixed(1)} s</span>
              </div>
              <div className="stem-metric-item">
                <span className="stem-metric-label">Completed Cycles</span>
                <span className="stem-metric-val">{oscillations}</span>
              </div>
            </div>

            <div style={{ marginTop: "14px", borderTop: "1px solid #E2E8F0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Target: <strong>5 oscillations</strong>
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

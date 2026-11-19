import React, { useState, useEffect, useRef } from "react";
import {
  RotateCcw,
  Sparkles,
  Play,
  Pause,
  Gauge,
  Sliders,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import ExperimentIntroModal from "./ExperimentIntroModal";
import ExperimentCompletionModal from "./ExperimentCompletionModal";
import { queueOfflineProgress } from "../../utils/offlineSync";
import { LAB_ACTIVITIES } from "../../data/labRegistry";
import "./LabStyles.css";

const activityMeta = LAB_ACTIVITIES["physics-force"];

export default function PhysicsForceLab() {
  const [force, setForce] = useState(10); // Newtons (1 to 25)
  const [mass, setMass] = useState(2); // Kilograms (1 to 5)
  const [isRunning, setIsRunning] = useState(false);

  // Motion dynamics
  const [time, setTime] = useState(0); // seconds
  const [distance, setDistance] = useState(0); // meters (0 to 10)
  const [trialsCount, setTrialsCount] = useState(0);

  // Modals
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Supabase Save Status
  const [savingStatus, setSavingStatus] = useState("idle");
  const [savingError, setSavingError] = useState("");

  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedAtRef = useRef(0);

  // Newton's 2nd Law: a = F / m
  const acceleration = force / mass;
  const currentVelocity = acceleration * time;

  useEffect(() => {
    if (!isRunning) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp - pausedAtRef.current * 1000;
      }

      const elapsedSec = (timestamp - startTimeRef.current) / 1000;
      const d = 0.5 * acceleration * Math.pow(elapsedSec, 2);

      if (d >= 10) {
        // Reached end of track
        setDistance(10);
        setTime(Math.sqrt(20 / acceleration));
        setIsRunning(false);
        const nextTrials = trialsCount + 1;
        setTrialsCount(nextTrials);
        if (nextTrials >= 2) {
          handleExperimentComplete();
        }
        return;
      }

      setTime(elapsedSec);
      setDistance(d);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, acceleration, trialsCount]);

  const handleTogglePlay = () => {
    if (isRunning) {
      pausedAtRef.current = time;
      startTimeRef.current = null;
      setIsRunning(false);
    } else {
      if (distance >= 10) {
        handleReset();
      }
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    startTimeRef.current = null;
    pausedAtRef.current = 0;
    setTime(0);
    setDistance(0);
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

  // Convert distance (0m to 10m) to SVG track pixels (x: 50 to 520)
  const cartPixelX = 50 + (distance / 10) * 470;

  return (
    <div className="stem-lab-main">
      <div className="stem-lab-grid">
        {/* Left Column: Dynamics Track Viewport */}
        <div>
          <div className="stem-viewport-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", background: "#EF991F", padding: "3px 10px", borderRadius: "12px", fontWeight: "700" }}>
                  DYNAMICS TRACK (F = ma)
                </span>
                <span style={{ fontSize: "13px", color: isRunning ? "#4ADE80" : "#94A3B8" }}>
                  {isRunning ? "● Accelerating" : distance >= 10 ? "🏁 Finished Track" : "❚❚ Ready"}
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
                  {isRunning ? "Pause" : distance >= 10 ? "Restart" : "Apply Force"}
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

            {/* SVG Dynamics Track */}
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
              <svg viewBox="0 0 620 280" style={{ width: "95%", height: "260px" }}>
                {/* Horizontal Guide Track */}
                <rect x="30" y="190" width="560" height="14" fill="#334155" stroke="#475569" strokeWidth="2" />

                {/* Track Graduation Marks (0m to 10m) */}
                {Array.from({ length: 11 }, (_, i) => i).map((m) => {
                  const x = 50 + (m / 10) * 470;
                  return (
                    <g key={m}>
                      <line x1={x} y1="190" x2={x} y2="204" stroke="#D5D52B" strokeWidth="2" />
                      <text x={x} y="222" fill="#94A3B8" fontSize="11" textAnchor="middle">
                        {m}m
                      </text>
                    </g>
                  );
                })}

                {/* Track End Buffer Stopper */}
                <rect x="530" y="150" width="16" height="40" fill="#EF4444" rx="3" stroke="#F87171" strokeWidth="2" />

                {/* Applied Force Vector Arrow */}
                {force > 0 && (
                  <g transform={`translate(${cartPixelX + 60}, 145)`}>
                    <line x1="0" y1="0" x2={Math.min(80, force * 3)} y2="0" stroke="#EF4444" strokeWidth="3" markerEnd="url(#arrow-red)" />
                    <text x={force * 1.5} y="-8" fill="#EF4444" fontSize="12" fontWeight="bold">
                      F = {force}N
                    </text>
                  </g>
                )}

                <defs>
                  <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                    <polygon points="0,1 6,4 0,7" fill="#EF4444" />
                  </marker>
                </defs>

                {/* Wheeled Cart Body */}
                <g transform={`translate(${cartPixelX}, 135)`}>
                  {/* Cart Chassis */}
                  <rect x="-30" y="-15" width="60" height="30" rx="4" fill="#6655D9" stroke="#A78BFA" strokeWidth="2" />
                  {/* Cart Wheels */}
                  <circle cx="-18" cy="20" r="7" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2" />
                  <circle cx="18" cy="20" r="7" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2" />

                  {/* Mass Weight Plates on Top */}
                  {Array.from({ length: mass }).map((_, i) => (
                    <rect
                      key={i}
                      x="-20"
                      y={-22 - i * 8}
                      width="40"
                      height="6"
                      rx="2"
                      fill="#EF991F"
                      stroke="#FBBF24"
                      strokeWidth="1"
                    />
                  ))}

                  <text x="0" y="6" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {mass} kg
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Acceleration Metrics */}
        <div className="stem-controls-card">
          {/* Sliders Card */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Sliders size={16} color="#EF991F" /> Force & Mass Controls
            </h3>

            {/* Force Slider */}
            <div className="stem-slider-group">
              <div className="stem-slider-header">
                <span>Applied Net Force (F)</span>
                <span style={{ color: "#EF4444", fontWeight: "700" }}>{force} N</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={force}
                onChange={(e) => {
                  setForce(Number(e.target.value));
                  handleReset();
                }}
                className="stem-slider-input"
              />
            </div>

            {/* Mass Slider */}
            <div className="stem-slider-group">
              <div className="stem-slider-header">
                <span>Cart Mass (m)</span>
                <span style={{ color: "#6655D9", fontWeight: "700" }}>{mass} kg</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={mass}
                onChange={(e) => {
                  setMass(Number(e.target.value));
                  handleReset();
                }}
                className="stem-slider-input"
              />
            </div>
          </div>

          {/* Acceleration & Motion Metrics */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Gauge size={16} color="#16A34A" /> Calculated Acceleration: a = F / m
            </h3>

            <div className="stem-metric-grid">
              <div className="stem-metric-item">
                <span className="stem-metric-label">Acceleration (a)</span>
                <span className="stem-metric-val" style={{ color: "#EF991F" }}>
                  {acceleration.toFixed(2)} m/s²
                </span>
                <span style={{ fontSize: "10px", color: "#64748B", marginTop: "2px" }}>
                  {force}N ÷ {mass}kg
                </span>
              </div>
              <div className="stem-metric-item">
                <span className="stem-metric-label">Instant Velocity (v)</span>
                <span className="stem-metric-val">{currentVelocity.toFixed(2)} m/s</span>
              </div>
              <div className="stem-metric-item">
                <span className="stem-metric-label">Distance Traveled (d)</span>
                <span className="stem-metric-val">{distance.toFixed(2)} m</span>
              </div>
              <div className="stem-metric-item">
                <span className="stem-metric-label">Elapsed Time (t)</span>
                <span className="stem-metric-val">{time.toFixed(2)} s</span>
              </div>
            </div>

            <div style={{ marginTop: "14px", borderTop: "1px solid #E2E8F0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Trials Run: <strong>{trialsCount}</strong>
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

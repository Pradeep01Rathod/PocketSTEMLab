import React, { useState } from "react";
import {
  RotateCcw,
  Sparkles,
  Calculator,
  Square,
  Triangle,
  Circle,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import ExperimentIntroModal from "./ExperimentIntroModal";
import ExperimentCompletionModal from "./ExperimentCompletionModal";
import { queueOfflineProgress } from "../../utils/offlineSync";
import { LAB_ACTIVITIES } from "../../data/labRegistry";
import "./LabStyles.css";

const activityMeta = LAB_ACTIVITIES["math-geometry"];

export default function MathGeometryCalcLab() {
  const [selectedShape, setSelectedShape] = useState("rectangle"); // "rectangle" | "triangle" | "circle"

  // Rectangle dimensions
  const [rectLength, setRectLength] = useState(8);
  const [rectWidth, setRectWidth] = useState(5);

  // Triangle dimensions
  const [triBase, setTriBase] = useState(8);
  const [triHeight, setTriHeight] = useState(6);

  // Circle dimensions
  const [circleRadius, setCircleRadius] = useState(5);

  const [shapesExplored, setShapesExplored] = useState(new Set(["rectangle"]));

  // Modals
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Supabase Save Status
  const [savingStatus, setSavingStatus] = useState("idle");
  const [savingError, setSavingError] = useState("");

  const handleSelectShape = (shape) => {
    setSelectedShape(shape);
    const updated = new Set(shapesExplored).add(shape);
    setShapesExplored(updated);
    if (updated.size >= 3) {
      handleExperimentComplete();
    }
  };

  const handleReset = () => {
    setRectLength(8);
    setRectWidth(5);
    setTriBase(8);
    setTriHeight(6);
    setCircleRadius(5);
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

  // Computations
  const rectPerimeter = 2 * (rectLength + rectWidth);
  const rectArea = rectLength * rectWidth;

  const triHypotenuse = Math.sqrt(Math.pow(triBase / 2, 2) + Math.pow(triHeight, 2));
  const triPerimeter = (triBase + 2 * triHypotenuse).toFixed(1);
  const triArea = (0.5 * triBase * triHeight).toFixed(1);

  const circleCircumference = (2 * Math.PI * circleRadius).toFixed(2);
  const circleArea = (Math.PI * Math.pow(circleRadius, 2)).toFixed(2);

  return (
    <div className="stem-lab-main">
      <div className="stem-lab-grid">
        {/* Left Column: Interactive Shape Viewport */}
        <div>
          <div className="stem-viewport-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", background: "#2D7FF9", padding: "3px 10px", borderRadius: "12px", fontWeight: "700" }}>
                  2D GEOMETRY CANVAS
                </span>
                <span style={{ fontSize: "13px", color: "#94A3B8" }}>
                  Shape: {selectedShape.toUpperCase()}
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
                <RotateCcw size={13} /> Reset Dimensions
              </button>
            </div>

            {/* Shape Selector Tabs */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <button
                onClick={() => handleSelectShape("rectangle")}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "8px",
                  borderRadius: "8px",
                  background: selectedShape === "rectangle" ? "#2D7FF9" : "#1E293B",
                  color: "#FFFFFF",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                <Square size={16} /> Rectangle
              </button>
              <button
                onClick={() => handleSelectShape("triangle")}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "8px",
                  borderRadius: "8px",
                  background: selectedShape === "triangle" ? "#2D7FF9" : "#1E293B",
                  color: "#FFFFFF",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                <Triangle size={16} /> Triangle
              </button>
              <button
                onClick={() => handleSelectShape("circle")}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "8px",
                  borderRadius: "8px",
                  background: selectedShape === "circle" ? "#2D7FF9" : "#1E293B",
                  color: "#FFFFFF",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                <Circle size={16} /> Circle
              </button>
            </div>

            {/* SVG Dynamic Rendering */}
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
              <svg viewBox="0 0 500 280" style={{ width: "95%", height: "260px" }}>
                {/* Background Grid Pattern */}
                <defs>
                  <pattern id="geom-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="500" height="280" fill="url(#geom-grid)" />

                {/* 1. Rectangle Rendering */}
                {selectedShape === "rectangle" && (
                  <g transform="translate(250, 140)">
                    {/* Rendered Rectangle (scale: 1cm = 22px) */}
                    <rect
                      x={(-rectLength * 22) / 2}
                      y={(-rectWidth * 22) / 2}
                      width={rectLength * 22}
                      height={rectWidth * 22}
                      fill="rgba(45, 127, 249, 0.25)"
                      stroke="#2D7FF9"
                      strokeWidth="3"
                      rx="4"
                    />
                    {/* Length indicator (top) */}
                    <line
                      x1={(-rectLength * 22) / 2}
                      y1={(-rectWidth * 22) / 2 - 14}
                      x2={(rectLength * 22) / 2}
                      y2={(-rectWidth * 22) / 2 - 14}
                      stroke="#D5D52B"
                      strokeWidth="2"
                    />
                    <text
                      x="0"
                      y={(-rectWidth * 22) / 2 - 20}
                      fill="#D5D52B"
                      fontSize="13"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Length = {rectLength} cm
                    </text>

                    {/* Width indicator (right) */}
                    <line
                      x1={(rectLength * 22) / 2 + 14}
                      y1={(-rectWidth * 22) / 2}
                      x2={(rectLength * 22) / 2 + 14}
                      y2={(rectWidth * 22) / 2}
                      stroke="#D5D52B"
                      strokeWidth="2"
                    />
                    <text
                      x={(rectLength * 22) / 2 + 22}
                      y="5"
                      fill="#D5D52B"
                      fontSize="13"
                      fontWeight="bold"
                      textAnchor="start"
                    >
                      Width = {rectWidth} cm
                    </text>
                  </g>
                )}

                {/* 2. Triangle Rendering */}
                {selectedShape === "triangle" && (
                  <g transform="translate(250, 140)">
                    {/* Rendered Isosceles Triangle */}
                    <polygon
                      points={`0,${(-triHeight * 20) / 2} ${(-triBase * 20) / 2},${(triHeight * 20) / 2} ${(triBase * 20) / 2},${(triHeight * 20) / 2}`}
                      fill="rgba(239, 153, 31, 0.25)"
                      stroke="#EF991F"
                      strokeWidth="3"
                    />
                    {/* Height dashed line */}
                    <line
                      x1="0"
                      y1={(-triHeight * 20) / 2}
                      x2="0"
                      y2={(triHeight * 20) / 2}
                      stroke="#D5D52B"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <text x="8" y="0" fill="#D5D52B" fontSize="12" fontWeight="bold">
                      h = {triHeight} cm
                    </text>

                    {/* Base indicator */}
                    <line
                      x1={(-triBase * 20) / 2}
                      y1={(triHeight * 20) / 2 + 14}
                      x2={(triBase * 20) / 2}
                      y2={(triHeight * 20) / 2 + 14}
                      stroke="#D5D52B"
                      strokeWidth="2"
                    />
                    <text
                      x="0"
                      y={(triHeight * 20) / 2 + 28}
                      fill="#D5D52B"
                      fontSize="13"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Base = {triBase} cm
                    </text>
                  </g>
                )}

                {/* 3. Circle Rendering */}
                {selectedShape === "circle" && (
                  <g transform="translate(250, 140)">
                    {/* Rendered Circle */}
                    <circle
                      cx="0"
                      cy="0"
                      r={circleRadius * 18}
                      fill="rgba(102, 85, 217, 0.25)"
                      stroke="#6655D9"
                      strokeWidth="3"
                    />
                    <circle cx="0" cy="0" r="4" fill="#D5D52B" />
                    {/* Radius line */}
                    <line
                      x1="0"
                      y1="0"
                      x2={circleRadius * 18}
                      y2="0"
                      stroke="#D5D52B"
                      strokeWidth="2"
                    />
                    <text
                      x={(circleRadius * 18) / 2}
                      y="-8"
                      fill="#D5D52B"
                      fontSize="13"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      r = {circleRadius} cm
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Sliders & Live Formulas */}
        <div className="stem-controls-card">
          {/* Sliders Card */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Sparkles size={16} color="#6655D9" /> Adjust Dimensions
            </h3>

            {selectedShape === "rectangle" && (
              <>
                <div className="stem-slider-group">
                  <div className="stem-slider-header">
                    <span>Length (L)</span>
                    <span>{rectLength} cm</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="14"
                    step="1"
                    value={rectLength}
                    onChange={(e) => setRectLength(Number(e.target.value))}
                    className="stem-slider-input"
                  />
                </div>
                <div className="stem-slider-group">
                  <div className="stem-slider-header">
                    <span>Width (W)</span>
                    <span>{rectWidth} cm</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="1"
                    value={rectWidth}
                    onChange={(e) => setRectWidth(Number(e.target.value))}
                    className="stem-slider-input"
                  />
                </div>
              </>
            )}

            {selectedShape === "triangle" && (
              <>
                <div className="stem-slider-group">
                  <div className="stem-slider-header">
                    <span>Base (b)</span>
                    <span>{triBase} cm</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="14"
                    step="1"
                    value={triBase}
                    onChange={(e) => setTriBase(Number(e.target.value))}
                    className="stem-slider-input"
                  />
                </div>
                <div className="stem-slider-group">
                  <div className="stem-slider-header">
                    <span>Height (h)</span>
                    <span>{triHeight} cm</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="1"
                    value={triHeight}
                    onChange={(e) => setTriHeight(Number(e.target.value))}
                    className="stem-slider-input"
                  />
                </div>
              </>
            )}

            {selectedShape === "circle" && (
              <div className="stem-slider-group">
                <div className="stem-slider-header">
                  <span>Radius (r)</span>
                  <span>{circleRadius} cm</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="7"
                  step="0.5"
                  value={circleRadius}
                  onChange={(e) => setCircleRadius(Number(e.target.value))}
                  className="stem-slider-input"
                />
              </div>
            )}
          </div>

          {/* Real-Time Formula & Measurement Card */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Calculator size={16} color="#16A34A" /> Calculated Results & Formulas
            </h3>

            {selectedShape === "rectangle" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="stem-metric-item">
                  <span className="stem-metric-label">Perimeter: P = 2(L + W)</span>
                  <span className="stem-metric-val">{rectPerimeter} cm</span>
                  <span style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                    2 × ({rectLength} + {rectWidth}) = {rectPerimeter} cm
                  </span>
                </div>
                <div className="stem-metric-item">
                  <span className="stem-metric-label">Area: A = L × W</span>
                  <span className="stem-metric-val" style={{ color: "#16A34A" }}>
                    {rectArea} cm²
                  </span>
                  <span style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                    {rectLength} × {rectWidth} = {rectArea} cm²
                  </span>
                </div>
              </div>
            )}

            {selectedShape === "triangle" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="stem-metric-item">
                  <span className="stem-metric-label">Perimeter: P = a + b + c</span>
                  <span className="stem-metric-val">{triPerimeter} cm</span>
                </div>
                <div className="stem-metric-item">
                  <span className="stem-metric-label">Area: A = 1/2 × base × height</span>
                  <span className="stem-metric-val" style={{ color: "#16A34A" }}>
                    {triArea} cm²
                  </span>
                  <span style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                    0.5 × {triBase} × {triHeight} = {triArea} cm²
                  </span>
                </div>
              </div>
            )}

            {selectedShape === "circle" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="stem-metric-item">
                  <span className="stem-metric-label">Circumference: C = 2πr</span>
                  <span className="stem-metric-val">{circleCircumference} cm</span>
                  <span style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                    2 × 3.1416 × {circleRadius} = {circleCircumference} cm
                  </span>
                </div>
                <div className="stem-metric-item">
                  <span className="stem-metric-label">Area: A = πr²</span>
                  <span className="stem-metric-val" style={{ color: "#16A34A" }}>
                    {circleArea} cm²
                  </span>
                  <span style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                    3.1416 × ({circleRadius})² = {circleArea} cm²
                  </span>
                </div>
              </div>
            )}

            <div style={{ marginTop: "16px", borderTop: "1px solid #E2E8F0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Shapes Explored: <strong>{shapesExplored.size} of 3</strong>
              </span>
              <button
                onClick={handleExperimentComplete}
                style={{ background: "transparent", border: "none", color: "#16A34A", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}
              >
                Complete Lab →
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

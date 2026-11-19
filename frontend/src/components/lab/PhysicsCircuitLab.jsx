import React, { useState, useCallback } from "react";
import {
  Power,
  ChevronLeft,
  ChevronRight,
  Award
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import LabHeader from "./LabHeader";
import ExperimentIntroModal from "./ExperimentIntroModal";
import ExperimentCompletionModal from "./ExperimentCompletionModal";
import { queueOfflineProgress } from "../../utils/offlineSync";
import "./LabStyles.css";

const testMaterials = [
  { id: "copper", name: "Copper Wire", isConductor: true, desc: "Good electrical conductor" },
  { id: "iron", name: "Iron Key", isConductor: true, desc: "Metallic conductor" },
  { id: "graphite", name: "Graphite Pencil Core", isConductor: true, desc: "Non-metal conductor" },
  { id: "plastic", name: "Plastic Strip", isConductor: false, desc: "Electrical insulator" },
  { id: "rubber", name: "Rubber Eraser", isConductor: false, desc: "Electrical insulator" },
];

const physicsSteps = [
  {
    title: "Inspect Circuit Components",
    instruction: "Observe the DC battery cell (1.5V), open knife switch, copper connecting wires, and bulb.",
    explanation: "A simple circuit needs an energy source, conductive connecting wires, a control switch, and a load.",
  },
  {
    title: "Select a Test Material",
    instruction: "Choose a material to connect across the circuit terminal gap (e.g. Copper Wire or Iron Key).",
    explanation: "Conductors have free electrons that allow current to pass, while insulators resist electron flow.",
  },
  {
    title: "Close the Knife Switch",
    instruction: "Toggle the knife switch to close the circuit and observe the light bulb.",
    explanation: "When a closed conducting loop is formed, electric potential pushes electrons through the filament.",
  },
];

export default function PhysicsCircuitLab({ hideHeader = false }) {
  // Lab Controls
  const [isSwitchClosed, setIsSwitchClosed] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(testMaterials[0]); // copper by default
  const [batteryVoltage, setBatteryVoltage] = useState(1.5); // 1.5V or 3.0V
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Modals
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Supabase Save Status
  const [savingStatus, setSavingStatus] = useState("idle");
  const [savingError, setSavingError] = useState("");

  // Circuit Continuity Computation
  const isCircuitClosed = isSwitchClosed && selectedMaterial.isConductor;

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
        return;
      }

      if (!navigator.onLine) {
        queueOfflineProgress({
          userId: session.user.id,
          lessonId: "physics-circuit",
          progressPercent: 100,
          completed: true,
        });
        setSavingStatus("saved");
        return;
      }

      const { error: saveError } = await supabase
        .from("learning_progress")
        .upsert(
          {
            user_id: session.user.id,
            lesson_id: "physics-circuit",
            progress_percent: 100,
            completed: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,lesson_id" }
        );

      if (saveError) throw saveError;
      setSavingStatus("saved");
    } catch (err) {
      const { data: { session } } = await supabase.auth.getSession().catch(() => ({ data: {} }));
      if (session?.user?.id) {
        queueOfflineProgress({
          userId: session.user.id,
          lessonId: "physics-circuit",
          progressPercent: 100,
          completed: true,
        });
        setSavingStatus("saved");
      } else {
        setSavingStatus("error");
        setSavingError(err.message || "Could not save progress.");
      }
    }
  }, [savingStatus]);

  const toggleSwitch = () => {
    const nextState = !isSwitchClosed;
    setIsSwitchClosed(nextState);
    if (nextState && selectedMaterial.isConductor) {
      handleExperimentComplete();
    }
  };

  const selectMaterial = (mat) => {
    setSelectedMaterial(mat);
    if (isSwitchClosed && mat.isConductor) {
      handleExperimentComplete();
    }
  };

  const handleReset = () => {
    setIsSwitchClosed(false);
    setSelectedMaterial(testMaterials[0]);
    setCurrentStepIndex(0);
    setSavingStatus("idle");
  };

  const currentStep = physicsSteps[currentStepIndex];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F4F7F5", display: "flex", flexDirection: "column" }}>
      {/* Top Header */}
      {!hideHeader && (
        <LabHeader
          subjectId="physics"
          subjectName="Physics"
          experimentTitle="Building a Simple Closed Electric Circuit"
          classLevel="Class 6 · Chapter: Electricity & Circuits"
          onReset={handleReset}
          onOpenIntro={() => setIsIntroOpen(true)}
        />
      )}

      {/* Main Workspace Layout */}
      <main style={{ maxWidth: "1320px", width: "100%", margin: "0 auto", padding: "24px", boxSizing: "border-box" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>
          {/* Left Column: Interactive Simulation Workspace */}
          <div>
            <div
              style={{
                backgroundColor: "#1E2826",
                borderRadius: "14px",
                padding: "36px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                color: "#FFFFFF",
                position: "relative",
                minHeight: "440px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: "2px solid #313E3B",
              }}
            >
              {/* Interactive Circuit Diagram SVG with Live States */}
              <div style={{ textAlign: "center", position: "relative" }}>
                <svg viewBox="0 0 700 320" style={{ width: "100%", maxHeight: "320px" }}>
                  {/* Outer Circuit Rectangular Path */}
                  <rect
                    x="100"
                    y="50"
                    width="500"
                    height="200"
                    rx="12"
                    fill="none"
                    stroke={isCircuitClosed ? "#D5D52B" : "#4B5563"}
                    strokeWidth="5"
                    strokeDasharray={isCircuitClosed ? "10,6" : "none"}
                    style={{
                      animation: isCircuitClosed ? "dash 1s linear infinite" : "none",
                    }}
                  />

                  {/* Battery Station (Left) */}
                  <g transform="translate(100, 150)">
                    <rect x="-35" y="-30" width="70" height="60" fill="#374151" rx="4" stroke="#D5D52B" strokeWidth="2" />
                    <text x="0" y="-5" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
                      BATTERY
                    </text>
                    <text x="0" y="16" fill="#D5D52B" fontSize="15" fontWeight="bold" textAnchor="middle">
                      {batteryVoltage}V
                    </text>
                    <text x="-48" y="5" fill="#EF4444" fontSize="16" fontWeight="bold">
                      +
                    </text>
                    <text x="40" y="5" fill="#3B82F6" fontSize="18" fontWeight="bold">
                      -
                    </text>
                  </g>

                  {/* Knife Switch Station (Top Center) */}
                  <g transform="translate(350, 50)">
                    <rect x="-40" y="-18" width="80" height="36" fill="#1F2937" rx="4" />
                    <circle cx="-25" cy="0" r="5" fill="#D5D52B" />
                    <circle cx="25" cy="0" r="5" fill="#D5D52B" />
                    {/* Switch Arm */}
                    <line
                      x1="-25"
                      y1="0"
                      x2={isSwitchClosed ? 25 : 15}
                      y2={isSwitchClosed ? 0 : -22}
                      stroke={isSwitchClosed ? "#10B981" : "#EF4444"}
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <text x="0" y="-28" fill="#D1D5DB" fontSize="11" fontWeight="600" textAnchor="middle">
                      {isSwitchClosed ? "SWITCH: CLOSED" : "SWITCH: OPEN"}
                    </text>
                  </g>

                  {/* Test Material Slot (Bottom Center) */}
                  <g transform="translate(350, 250)">
                    <rect x="-70" y="-18" width="140" height="36" fill="#111827" rx="6" stroke="#4B5563" strokeDasharray="3,3" />
                    <text x="0" y="-26" fill="#9CA3AF" fontSize="11" fontWeight="600" textAnchor="middle">
                      TEST TERMINAL GAP
                    </text>
                    <rect
                      x="-60"
                      y="-12"
                      width="120"
                      height="24"
                      rx="4"
                      fill={selectedMaterial.isConductor ? "#D5D52B" : "#6B7280"}
                    />
                    <text x="0" y="4" fill="#111827" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {selectedMaterial.name}
                    </text>
                  </g>

                  {/* Light Bulb Station (Right) */}
                  <g transform="translate(600, 150)">
                    <circle
                      cx="0"
                      cy="0"
                      r="32"
                      fill={isCircuitClosed ? "#FEF08A" : "#374151"}
                      stroke={isCircuitClosed ? "#FACC15" : "#4B5563"}
                      strokeWidth="3"
                    />
                    {isCircuitClosed && (
                      <circle cx="0" cy="0" r="48" fill="rgba(250, 204, 21, 0.25)" filter="blur(8px)" />
                    )}
                    <text x="0" y="5" fill={isCircuitClosed ? "#713F12" : "#9CA3AF"} fontSize="13" fontWeight="bold" textAnchor="middle">
                      {isCircuitClosed ? "GLOWING" : "OFF"}
                    </text>
                  </g>
                </svg>
              </div>

              {/* Status Bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "rgba(0,0,0,0.3)",
                  padding: "14px 20px",
                  borderRadius: "8px",
                  marginTop: "16px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", display: "block" }}>
                    CURRENT CIRCUIT STATUS:
                  </span>
                  <strong style={{ fontSize: "16px", color: isCircuitClosed ? "#10B981" : "#EF4444" }}>
                    {isCircuitClosed ? "✓ Complete Closed Loop (Current Flowing)" : "○ Incomplete Loop (Zero Current)"}
                  </strong>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={toggleSwitch}
                    style={{
                      padding: "9px 18px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: isSwitchClosed ? "#EF4444" : "#10B981",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Power size={16} />
                    <span>{isSwitchClosed ? "Open Switch" : "Close Switch"}</span>
                  </button>

                  <button
                    onClick={() => setBatteryVoltage(batteryVoltage === 1.5 ? 3.0 : 1.5)}
                    style={{
                      padding: "9px 14px",
                      borderRadius: "6px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      backgroundColor: "transparent",
                      color: "#FFFFFF",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Voltage: {batteryVoltage}V
                  </button>
                </div>
              </div>
            </div>

            {/* Guided Step Walkthrough & Feedback Panel */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                padding: "24px",
                marginTop: "20px",
                border: "1px solid #E8ECE9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#D5D52B", backgroundColor: "#313E3B", padding: "4px 10px", borderRadius: "4px" }}>
                  STEP {currentStepIndex + 1} OF {physicsSteps.length}
                </span>
                <span style={{ fontSize: "12px", color: "#71807D" }}>
                  {isCircuitClosed ? "Goal Achieved!" : "Follow instruction"}
                </span>
              </div>

              <h3 style={{ fontSize: "18px", margin: "0 0 6px", color: "#313E3B" }}>{currentStep.title}</h3>
              <p style={{ fontSize: "14px", color: "#4A5653", margin: "0 0 10px", lineHeight: "1.5" }}>
                {currentStep.instruction}
              </p>
              <p style={{ fontSize: "12.5px", color: "#71807D", margin: "0 0 16px", fontStyle: "italic" }}>
                Why this matters: {currentStep.explanation}
              </p>

              {/* Step Navigation Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "1px solid #D9E0DD",
                    backgroundColor: "#FFFFFF",
                    color: "#313E3B",
                    cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
                    opacity: currentStepIndex === 0 ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "13px",
                  }}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                {isCircuitClosed && (
                  <button
                    onClick={() => setIsCompletionOpen(true)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "#16A34A",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                    }}
                  >
                    <Award size={16} /> View Observations & Results
                  </button>
                )}

                <button
                  disabled={currentStepIndex >= physicsSteps.length - 1}
                  onClick={() => setCurrentStepIndex((prev) => Math.min(physicsSteps.length - 1, prev + 1))}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "1px solid #D9E0DD",
                    backgroundColor: "#FFFFFF",
                    color: "#313E3B",
                    cursor: currentStepIndex >= physicsSteps.length - 1 ? "not-allowed" : "pointer",
                    opacity: currentStepIndex >= physicsSteps.length - 1 ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "13px",
                  }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Conductor vs Insulator Testing Drawer */}
          <aside
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              padding: "24px",
              border: "1px solid #E8ECE9",
              boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
            }}
          >
            <h4 style={{ fontSize: "16px", margin: "0 0 6px", color: "#313E3B" }}>Conductor vs Insulator Test</h4>
            <p style={{ fontSize: "13px", color: "#71807D", margin: "0 0 16px", lineHeight: "1.4" }}>
              Insert different test objects into the circuit gap to observe whether the bulb illuminates.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {testMaterials.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => selectMaterial(mat)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: selectedMaterial.id === mat.id ? "2px solid #313E3B" : "1px solid #E8ECE9",
                    backgroundColor: selectedMaterial.id === mat.id ? "#F8FAF9" : "#FFFFFF",
                    color: "#313E3B",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong style={{ display: "block", fontSize: "13px" }}>{mat.name}</strong>
                    <small style={{ color: "#71807D", fontSize: "11px" }}>{mat.desc}</small>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      padding: "2px 6px",
                      borderRadius: "3px",
                      backgroundColor: mat.isConductor ? "#DCFCE7" : "#FEE2E2",
                      color: mat.isConductor ? "#15803D" : "#B91C1C",
                    }}
                  >
                    {mat.isConductor ? "CONDUCTOR" : "INSULATOR"}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", padding: "12px", borderRadius: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#166534", display: "block", marginBottom: "2px" }}>
                💡 Physics Tip:
              </span>
              <p style={{ fontSize: "12px", color: "#15803D", margin: 0, lineHeight: "1.4" }}>
                Metals conduct electricity because valence electrons are delocalised and drift freely when voltage is applied.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Intro Modal */}
      <ExperimentIntroModal
        isOpen={isIntroOpen}
        onClose={() => setIsIntroOpen(false)}
        experimentName="Building a Simple Closed Electric Circuit"
        subject="Physics"
        classLevel="Class 6"
        chapter="Electricity and Circuits"
        objectives={[
          "Understand how a complete closed loop is necessary for electric current to flow.",
          "Identify the essential components: battery cell, wires, knife switch, and load.",
          "Differentiate practically between electrical conductors and insulators.",
        ]}
        materials={[
          "1.5V / 3.0V DC Chemical Cell Battery",
          "Single-pole Knife Switch",
          "Copper conducting connecting leads",
          "Incandescent miniature filament bulb",
          "Material samples: Copper, Iron key, Graphite, Plastic, Rubber",
        ]}
        safetyGuidelines={[
          "In real laboratory practice, never connect the two terminals of a battery directly together without a load (short circuit).",
          "Never experiment with high-voltage wall power sockets.",
          "Check for loose wire connections when circuit does not conduct.",
        ]}
      />

      {/* Completion Modal */}
      <ExperimentCompletionModal
        isOpen={isCompletionOpen}
        onClose={() => setIsCompletionOpen(false)}
        onRestart={handleReset}
        experimentTitle="Building a Simple Closed Electric Circuit"
        subject="Physics"
        scientificConcept="An electric circuit is a continuous conducting path connecting the terminals of a power source to an electrical load. Electric current flows from high potential to low potential only when the loop is unbroken and composed of conducting materials."
        observations={[
          "When the switch was open, the gap broke the conducting path and the bulb remained unlit.",
          "When the switch was closed with a conductor (Copper/Iron/Graphite), current flowed and the bulb filament glowed brightly.",
          "When an insulator (Plastic/Rubber) was inserted, the electron flow was blocked and the bulb did not glow.",
        ]}
        result="The closed circuit successfully verified the relationship between voltage, continuity, and conductivity."
        quizRoute="/quiz/physics_circuit"
        quizTitle="Take Electric Circuit Quiz"
        savingStatus={savingStatus}
        savingError={savingError}
      />
    </div>
  );
}

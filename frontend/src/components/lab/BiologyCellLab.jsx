import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Award,
  Eye,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import LabHeader from "./LabHeader";
import ExperimentIntroModal from "./ExperimentIntroModal";
import ExperimentCompletionModal from "./ExperimentCompletionModal";
import { queueOfflineProgress } from "../../utils/offlineSync";
import "./LabStyles.css";

const organelles = [
  {
    id: "cellwall",
    name: "Cell Wall",
    color: "#15803D",
    purpose: "Rigid outer protective layer composed of cellulose fibers.",
    function: "Provides structural rigidity, prevents bursting under high turgor pressure, and maintains definite plant shape.",
    foundIn: "Plant cells only (absent in animal cells).",
    presentInAnimal: false,
  },
  {
    id: "membrane",
    name: "Cell Membrane (Plasma Membrane)",
    color: "#22C55E",
    purpose: "Selectively permeable phospholipid lipid bilayer.",
    function: "Regulates the entry and exit of ions, nutrients, and water molecules via diffusion and osmosis.",
    foundIn: "Both plant and animal cells.",
    presentInAnimal: true,
  },
  {
    id: "nucleus",
    name: "Nucleus",
    color: "#854D0E",
    purpose: "The informational command centre of the cell.",
    function: "Contains DNA organized into chromosomes; directs protein synthesis, cellular growth, and reproduction.",
    foundIn: "All eukaryotic cells (peripheral in plants, central in animals).",
    presentInAnimal: true,
  },
  {
    id: "chloroplast",
    name: "Chloroplast",
    color: "#166534",
    purpose: "Double-membrane photosynthesis organelle containing green chlorophyll.",
    function: "Converts light energy, carbon dioxide, and water into chemical energy (glucose) and releases oxygen.",
    foundIn: "Green plant cells and photosynthetic algae (absent in animals).",
    presentInAnimal: false,
  },
  {
    id: "vacuole",
    name: "Vacuole",
    color: "#0284C7",
    purpose: "Fluid-filled internal storage sac enclosed by a membrane.",
    function: "In plants: 1 giant central vacuole stores water and maintains turgidity. In animals: multiple small temporary vacuoles.",
    foundIn: "Both (Large central in plants; small and temporary in animals).",
    presentInAnimal: true,
  },
  {
    id: "mitochondria",
    name: "Mitochondria",
    color: "#EA580C",
    purpose: "Double-membraned organelle with folded inner cristae.",
    function: "The 'powerhouse' of the cell. Generates ATP energy through cellular aerobic respiration.",
    foundIn: "Both plant and animal cells.",
    presentInAnimal: true,
  },
  {
    id: "cytoplasm",
    name: "Cytoplasm",
    color: "#65A30D",
    purpose: "Aqueous gel-like ground substance filling the cell interior.",
    function: "Suspends organelles and acts as the medium for enzymatic reactions, glycolysis, and intracellular transport.",
    foundIn: "All living cells.",
    presentInAnimal: true,
  },
];

const bioSteps = [
  {
    title: "Prepare & Focus the Slide",
    instruction: "Inspect the mounted specimen on a glass slide and switch between Plant and Animal cells.",
    explanation: "Plant cells feature rigid bounding walls, while animal cells have flexible, rounded membranes.",
  },
  {
    title: "Inspect Cell Wall and Chloroplasts",
    instruction: "Select the outer Cell Wall and green Chloroplasts in the organelle inspector.",
    explanation: "These two structures are unique hallmarks of plant cells that are never found in animal cells.",
  },
  {
    title: "Examine Nucleus and Central Vacuole",
    instruction: "Compare the peripheral nucleus in plants against the central nucleus in animal cells.",
    explanation: "Because plant vacuoles swell with water to keep the stem upright, the plant nucleus is pushed to the periphery.",
  },
];

export default function BiologyCellLab({ hideHeader = false }) {
  const [cellMode, setCellMode] = useState("plant"); // "plant" | "animal"
  const [selectedOrganelle, setSelectedOrganelle] = useState(organelles[0]);
  const [magnification, setMagnification] = useState("40x");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [viewedCount, setViewedCount] = useState(1);

  // Modals
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Supabase Save Status
  const [savingStatus, setSavingStatus] = useState("idle");
  const [savingError, setSavingError] = useState("");

  const handleSelectOrganelle = (org) => {
    setSelectedOrganelle(org);
    setViewedCount((prev) => Math.min(organelles.length, prev + 1));
    if (viewedCount >= 4) {
      handleExperimentComplete();
    }
  };

  const handleToggleMode = (mode) => {
    setCellMode(mode);
    if (mode === "animal" && !selectedOrganelle.presentInAnimal) {
      setSelectedOrganelle(organelles[1]); // switch to membrane
    }
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
        return;
      }

      if (!navigator.onLine) {
        queueOfflineProgress({
          userId: session.user.id,
          lessonId: "biology-cell",
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
            lesson_id: "biology-cell",
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
          lessonId: "biology-cell",
          progressPercent: 100,
          completed: true,
        });
        setSavingStatus("saved");
      } else {
        setSavingStatus("error");
        setSavingError(err.message || "Could not save progress.");
      }
    }
  };

  const currentStep = bioSteps[currentStepIndex];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F4F7F5", display: "flex", flexDirection: "column" }}>
      {/* Top Header */}
      {!hideHeader && (
        <LabHeader
          subjectId="biology"
          subjectName="Biology"
          experimentTitle="Plant & Animal Cell Explorer"
          classLevel="Class 8 · Chapter: Cell — Structure & Functions"
          onOpenIntro={() => setIsIntroOpen(true)}
        />
      )}

      {/* Main Workspace Layout */}
      <main style={{ maxWidth: "1320px", width: "100%", margin: "0 auto", padding: "24px", boxSizing: "border-box" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px", alignItems: "start" }}>
          {/* Left Column: Microscope Viewport */}
          <div>
            <div
              style={{
                backgroundColor: "#0F1A15",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                color: "#FFFFFF",
                position: "relative",
                minHeight: "440px",
                border: "2px solid #313E3B",
              }}
            >
              {/* Plant vs Animal Cell Mode Selector */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleToggleMode("plant")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      border: cellMode === "plant" ? "2px solid #D5D52B" : "1px solid rgba(255,255,255,0.2)",
                      backgroundColor: cellMode === "plant" ? "#166534" : "transparent",
                      color: cellMode === "plant" ? "#FFFFFF" : "#CBD5E1",
                      fontWeight: "700",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    🌿 Plant Cell (Onion Peel)
                  </button>
                  <button
                    onClick={() => handleToggleMode("animal")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      border: cellMode === "animal" ? "2px solid #D5D52B" : "1px solid rgba(255,255,255,0.2)",
                      backgroundColor: cellMode === "animal" ? "#991B1B" : "transparent",
                      color: cellMode === "animal" ? "#FFFFFF" : "#CBD5E1",
                      fontWeight: "700",
                      fontSize: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    🔬 Animal Cell (Cheek Cell)
                  </button>
                </div>

                {/* Magnification Controls */}
                <div style={{ display: "flex", gap: "6px" }}>
                  {["10x", "40x", "100x"].map((mag) => (
                    <button
                      key={mag}
                      onClick={() => setMagnification(mag)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: magnification === mag ? "1.5px solid #D5D52B" : "1px solid rgba(255,255,255,0.2)",
                        backgroundColor: magnification === mag ? "#D5D52B" : "transparent",
                        color: magnification === mag ? "#313E3B" : "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      {mag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Microscope Circular Field of View Frame */}
              <div
                style={{
                  width: "100%",
                  maxHeight: "360px",
                  aspectRatio: "16 / 9",
                  margin: "0 auto",
                  position: "relative",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: cellMode === "plant" ? "#0A2218" : "#1A0F1A",
                  border: "2px solid rgba(213, 213, 43, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* 1. PLANT CELL SVG DIAGRAM */}
                {cellMode === "plant" && (
                  <svg viewBox="0 0 600 320" style={{ width: "95%", height: "95%" }}>
                    {/* Outer Thick Cell Wall */}
                    <polygon
                      points="60,60 540,40 560,260 80,280"
                      fill="#15803D"
                      stroke="#D5D52B"
                      strokeWidth={selectedOrganelle.id === "cellwall" ? "5" : "2"}
                      opacity="0.9"
                      cursor="pointer"
                      onClick={() => handleSelectOrganelle(organelles[0])}
                    />

                    {/* Inner Cell Membrane */}
                    <polygon
                      points="75,75 525,55 545,245 95,265"
                      fill="#4ADE80"
                      stroke="#16A34A"
                      strokeWidth={selectedOrganelle.id === "membrane" ? "4" : "1.5"}
                      opacity="0.85"
                      cursor="pointer"
                      onClick={() => handleSelectOrganelle(organelles[1])}
                    />

                    {/* Cytoplasm Matrix */}
                    <polygon
                      points="85,85 515,65 535,235 105,255"
                      fill="#ECFDF5"
                      opacity="0.95"
                      cursor="pointer"
                      onClick={() => handleSelectOrganelle(organelles[6])}
                    />

                    {/* Large Central Vacuole */}
                    <ellipse
                      cx="330"
                      cy="160"
                      rx="140"
                      ry="75"
                      fill="#BAE6FD"
                      stroke="#0284C7"
                      strokeWidth={selectedOrganelle.id === "vacuole" ? "4" : "2"}
                      cursor="pointer"
                      onClick={() => handleSelectOrganelle(organelles[4])}
                    />
                    <text x="330" y="165" fill="#0369A1" fontSize="13" fontWeight="bold" textAnchor="middle">
                      CENTRAL VACUOLE (Cell Sap)
                    </text>

                    {/* Nucleus (Pushed towards top-left) */}
                    <circle
                      cx="170"
                      cy="115"
                      r="32"
                      fill="#FEF08A"
                      stroke="#CA8A04"
                      strokeWidth={selectedOrganelle.id === "nucleus" ? "4" : "2"}
                      cursor="pointer"
                      onClick={() => handleSelectOrganelle(organelles[2])}
                    />
                    <circle cx="170" cy="115" r="10" fill="#854D0E" />
                    <text x="170" y="156" fill="#854D0E" fontSize="11" fontWeight="bold" textAnchor="middle">
                      NUCLEUS
                    </text>

                    {/* Chloroplasts scattered in cytoplasm */}
                    {[
                      [140, 210],
                      [220, 235],
                      [440, 95],
                      [470, 185],
                      [410, 230],
                    ].map(([x, y], idx) => (
                      <g key={idx} cursor="pointer" onClick={() => handleSelectOrganelle(organelles[3])}>
                        <ellipse
                          cx={x}
                          cy={y}
                          rx="22"
                          ry="13"
                          fill="#166534"
                          stroke={selectedOrganelle.id === "chloroplast" ? "#D5D52B" : "#14532D"}
                          strokeWidth={selectedOrganelle.id === "chloroplast" ? "3" : "1.5"}
                        />
                        <line x1={x - 14} y1={y} x2={x + 14} y2={y} stroke="#86EFAC" strokeWidth="2" />
                      </g>
                    ))}

                    {/* Mitochondria in plant cell */}
                    <g cursor="pointer" onClick={() => handleSelectOrganelle(organelles[5])} transform="translate(240, 95)">
                      <ellipse cx="0" cy="0" rx="18" ry="9" fill="#EA580C" stroke="#F97316" strokeWidth={selectedOrganelle.id === "mitochondria" ? "3" : "1.5"} />
                      <path d="M -10,0 Q -5,-5 0,0 Q 5,5 10,0" stroke="#FFEDD5" fill="none" strokeWidth="1.5" />
                    </g>
                  </svg>
                )}

                {/* 2. ANIMAL CELL SVG DIAGRAM */}
                {cellMode === "animal" && (
                  <svg viewBox="0 0 600 320" style={{ width: "95%", height: "95%" }}>
                    {/* Flexible Rounded Outer Cell Membrane (NO CELL WALL!) */}
                    <path
                      d="M 120,70 Q 280,30 480,80 Q 550,180 470,260 Q 300,290 130,250 Q 60,150 120,70 Z"
                      fill="#FCE7F3"
                      stroke={selectedOrganelle.id === "membrane" ? "#D5D52B" : "#DB2777"}
                      strokeWidth={selectedOrganelle.id === "membrane" ? "5" : "3"}
                      cursor="pointer"
                      onClick={() => handleSelectOrganelle(organelles[1])}
                    />

                    {/* Central Nucleus */}
                    <circle
                      cx="300"
                      cy="160"
                      r="45"
                      fill="#FEF08A"
                      stroke="#CA8A04"
                      strokeWidth={selectedOrganelle.id === "nucleus" ? "4" : "2"}
                      cursor="pointer"
                      onClick={() => handleSelectOrganelle(organelles[2])}
                    />
                    <circle cx="300" cy="160" r="15" fill="#854D0E" />
                    <text x="300" y="218" fill="#854D0E" fontSize="12" fontWeight="bold" textAnchor="middle">
                      CENTRAL NUCLEUS
                    </text>

                    {/* Multiple Small Temporary Vacuoles */}
                    <circle cx="180" cy="110" r="14" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" cursor="pointer" onClick={() => handleSelectOrganelle(organelles[4])} />
                    <circle cx="420" cy="190" r="16" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" cursor="pointer" onClick={() => handleSelectOrganelle(organelles[4])} />
                    <circle cx="210" cy="220" r="12" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" cursor="pointer" onClick={() => handleSelectOrganelle(organelles[4])} />

                    {/* Mitochondria (Abundant in animal cells) */}
                    {[
                      [200, 160],
                      [410, 110],
                      [360, 235],
                    ].map(([x, y], idx) => (
                      <g key={idx} cursor="pointer" onClick={() => handleSelectOrganelle(organelles[5])} transform={`translate(${x}, ${y})`}>
                        <ellipse cx="0" cy="0" rx="20" ry="10" fill="#EA580C" stroke="#F97316" strokeWidth={selectedOrganelle.id === "mitochondria" ? "3" : "1.5"} />
                        <path d="M -12,0 Q -6,-6 0,0 Q 6,6 12,0" stroke="#FFEDD5" fill="none" strokeWidth="1.5" />
                      </g>
                    ))}

                    <text x="300" y="45" fill="#F472B6" fontSize="13" fontWeight="bold" textAnchor="middle">
                      ANIMAL CELL: Flexible Plasma Membrane · Central Nucleus · No Cell Wall
                    </text>
                  </svg>
                )}

                {/* Magnification Crosshair Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#D5D52B",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Eye size={13} /> {magnification} Zoom
                </div>
              </div>

              {/* Viewport Toolbar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
                  Click on any organelle above or select from the inspector panel to view.
                </span>
                <span style={{ fontSize: "12px", color: "#D5D52B", fontWeight: "700" }}>
                  Mode: {cellMode === "plant" ? "Plant Cell (Onion)" : "Animal Cell (Cheek)"}
                </span>
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
                  STEP {currentStepIndex + 1} OF {bioSteps.length}
                </span>
                <span style={{ fontSize: "12px", color: "#71807D" }}>
                  {viewedCount} of {organelles.length} Organelles Inspected
                </span>
              </div>

              <h3 style={{ fontSize: "18px", margin: "0 0 6px", color: "#313E3B" }}>{currentStep.title}</h3>
              <p style={{ fontSize: "14px", color: "#4A5653", margin: "0 0 10px", lineHeight: "1.5" }}>
                {currentStep.instruction}
              </p>
              <p style={{ fontSize: "12.5px", color: "#71807D", margin: "0 0 16px", fontStyle: "italic" }}>
                Microscopy Note: {currentStep.explanation}
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

                {viewedCount >= 4 && (
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
                  disabled={currentStepIndex >= bioSteps.length - 1}
                  onClick={() => setCurrentStepIndex((prev) => Math.min(bioSteps.length - 1, prev + 1))}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "1px solid #D9E0DD",
                    backgroundColor: "#FFFFFF",
                    color: "#313E3B",
                    cursor: currentStepIndex >= bioSteps.length - 1 ? "not-allowed" : "pointer",
                    opacity: currentStepIndex >= bioSteps.length - 1 ? 0.5 : 1,
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

          {/* Right Column: Organelle Detail Inspector Panel */}
          <aside
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              padding: "24px",
              border: "1px solid #E8ECE9",
              boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
            }}
          >
            <h4 style={{ fontSize: "16px", margin: "0 0 6px", color: "#313E3B" }}>Organelle Inspector</h4>
            <p style={{ fontSize: "13px", color: "#71807D", margin: "0 0 16px" }}>
              Select an organelle to compare structure and physiological function.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
              {organelles.map((org) => {
                const isAbsentInCurrent = cellMode === "animal" && !org.presentInAnimal;

                return (
                  <button
                    key={org.id}
                    onClick={() => handleSelectOrganelle(org)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      border: selectedOrganelle.id === org.id ? "1.5px solid #313E3B" : "1px solid #E8ECE9",
                      backgroundColor: selectedOrganelle.id === org.id ? "#313E3B" : "#F8FAF9",
                      color: selectedOrganelle.id === org.id ? "#D5D52B" : isAbsentInCurrent ? "#94A3B8" : "#4A5653",
                      textDecoration: isAbsentInCurrent ? "line-through" : "none",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {org.name}
                  </button>
                );
              })}
            </div>

            {selectedOrganelle && (
              <div style={{ backgroundColor: "#F8FAF9", border: "1px solid #E8ECE9", borderRadius: "8px", padding: "18px" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: selectedOrganelle.color, textTransform: "uppercase" }}>
                  ORGANELLE PROFILE
                </span>
                <h3 style={{ fontSize: "18px", margin: "4px 0 10px", color: "#313E3B" }}>{selectedOrganelle.name}</h3>

                <strong style={{ fontSize: "12px", color: "#71807D", display: "block" }}>Structure & Purpose:</strong>
                <p style={{ fontSize: "13px", color: "#4A5653", margin: "2px 0 12px", lineHeight: "1.4" }}>
                  {selectedOrganelle.purpose}
                </p>

                <strong style={{ fontSize: "12px", color: "#71807D", display: "block" }}>Primary Function:</strong>
                <p style={{ fontSize: "13px", color: "#4A5653", margin: "2px 0 12px", lineHeight: "1.4" }}>
                  {selectedOrganelle.function}
                </p>

                <div style={{ background: "#FFFFFF", padding: "8px 12px", borderRadius: "6px", border: "1px solid #E2E8E5", fontSize: "12px", color: "#313E3B" }}>
                  <strong>Distribution:</strong> {selectedOrganelle.foundIn}
                </div>
              </div>
            )}

            {/* Side-by-side comparison mini card */}
            <div style={{ marginTop: "16px", padding: "12px", borderRadius: "8px", background: "#F1F5F9", border: "1px solid #E2E8F0" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#1E293B", display: "block", marginBottom: "6px" }}>
                Plant vs Animal Cell Key Differences:
              </span>
              <ul style={{ margin: "0", paddingLeft: "16px", fontSize: "11px", color: "#475569", lineHeight: "1.4" }}>
                <li><strong>Cell Wall:</strong> Present in Plants (rigid cellulose), Absent in Animals.</li>
                <li><strong>Chloroplasts:</strong> Present in Plants (photosynthesis), Absent in Animals.</li>
                <li><strong>Vacuoles:</strong> 1 Large Central in Plants; multiple small in Animals.</li>
                <li><strong>Nucleus:</strong> Peripheral in Plants; Centered in Animals.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* Intro Modal */}
      <ExperimentIntroModal
        isOpen={isIntroOpen}
        onClose={() => setIsIntroOpen(false)}
        experimentName="Plant & Animal Cell Explorer"
        subject="Biology"
        classLevel="Class 8"
        chapter="Cell — Structure and Functions"
        objectives={[
          "Identify and compare major organelles of both plant and animal cells.",
          "Understand the functional role of cell wall, nucleus, central vacuole, mitochondria, and chloroplasts.",
          "Distinguish anatomical differences between plant cells and animal cells.",
        ]}
        materials={[
          "Compound Optical Microscope (10x, 40x, 100x Objectives)",
          "Fresh Onion (Allium cepa) bulb epidermal peel (Plant cell)",
          "Human cheek epithelial scrapings (Animal cell)",
          "Dilute iodine solution and methylene blue nuclear stain",
        ]}
        safetyGuidelines={[
          "Use a sterile toothpick when collecting oral cheek cell specimens.",
          "Lower cover slips at a 45-degree angle to avoid air bubble entrapment.",
          "Do not touch high-power microscope objective lenses with bare fingers.",
        ]}
      />

      {/* Completion Modal */}
      <ExperimentCompletionModal
        isOpen={isCompletionOpen}
        onClose={() => setIsCompletionOpen(false)}
        experimentTitle="Plant & Animal Cell Explorer"
        subject="Biology"
        scientificConcept="The cell is the basic structural and functional unit of life. While all eukaryotic cells share nuclei, membranes, cytoplasm, and mitochondria, plant cells possess cellulose cell walls for mechanical rigidity, large vacuoles for maintaining hydrostatic turgor pressure, and chloroplasts containing chlorophyll for autotrophic photosynthesis."
        observations={[
          "Plant cells showed rigid rectangular boundaries bounded by cell walls with green chloroplasts.",
          "Animal cells exhibited flexible, rounded plasma membranes with a prominent centrally positioned nucleus.",
          "Plant nuclei were pushed to the cell periphery by the large central vacuole.",
        ]}
        result="The microscopic inspection successfully proved the cellular basis of living organisms and validated plant vs animal structural adaptations."
        quizRoute="/quiz/biology_cell"
        quizTitle="Take Cell Quiz"
        savingStatus={savingStatus}
        savingError={savingError}
      />
    </div>
  );
}

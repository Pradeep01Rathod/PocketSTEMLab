import React, { useState } from "react";
import {
  RotateCcw,
  Sparkles,
  FlaskConical,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import ExperimentIntroModal from "./ExperimentIntroModal";
import ExperimentCompletionModal from "./ExperimentCompletionModal";
import { queueOfflineProgress } from "../../utils/offlineSync";
import { LAB_ACTIVITIES } from "../../data/labRegistry";
import "./LabStyles.css";

const activityMeta = LAB_ACTIVITIES["chem-separation"];

const mixtures = [
  {
    id: "sand-water",
    name: "Sand and Water Suspension",
    type: "Insoluble solid + liquid",
    correctTechnique: "filtration",
    property: "Particle size & insolubility: Sand particles cannot pass through porous filter paper.",
    svgType: "filtration",
  },
  {
    id: "salt-water",
    name: "Salt Water Solution",
    type: "Soluble solid dissolved in liquid",
    correctTechnique: "evaporation",
    property: "Boiling point difference: Water evaporates into steam, leaving solid NaCl salt crystals.",
    svgType: "evaporation",
  },
  {
    id: "iron-sand",
    name: "Iron Filings and Sand Mixture",
    type: "Magnetic solid + non-magnetic solid",
    correctTechnique: "magnetic",
    property: "Ferromagnetism: Iron is attracted to the magnetic field, while sand remains behind.",
    svgType: "magnetic",
  },
  {
    id: "grain-flour",
    name: "Flour and Rice Grains",
    type: "Solids of different particle dimensions",
    correctTechnique: "sieving",
    property: "Particle size difference: Fine flour passes through the mesh while large rice grains stay on top.",
    svgType: "sieving",
  },
];

const techniques = [
  { id: "filtration", name: "Filtration (Filter Funnel)", desc: "Porous barrier separates insoluble solids" },
  { id: "evaporation", name: "Evaporation (Heat & Dish)", desc: "Thermal heat vaporizes the liquid solvent" },
  { id: "magnetic", name: "Magnetic Separation (Magnet)", desc: "Attracts ferromagnetic materials" },
  { id: "sieving", name: "Sieving (Wire Mesh)", desc: "Separates solids by physical grain size" },
];

export default function ChemistrySeparationLab() {
  const [selectedMixIdx, setSelectedMixIdx] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [separatedCount, setSeparatedCount] = useState(0);

  // Modals
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Supabase Save Status
  const [savingStatus, setSavingStatus] = useState("idle");
  const [savingError, setSavingError] = useState("");

  const currentMix = mixtures[selectedMixIdx];

  const handleTestSeparation = (techId) => {
    setSelectedTechnique(techId);
    if (techId === currentMix.correctTechnique) {
      setFeedback({
        success: true,
        text: `✓ Success! ${currentMix.name} is properly separated using ${techId.toUpperCase()}. ${currentMix.property}`,
      });
      const nextCount = separatedCount + 1;
      setSeparatedCount(nextCount);
      if (nextCount >= 2) {
        handleExperimentComplete();
      }
    } else {
      setFeedback({
        success: false,
        text: `✗ Incompatible method. Think about the physical properties: ${currentMix.type}.`,
      });
    }
  };

  const handleNextMixture = () => {
    setFeedback(null);
    setSelectedTechnique(null);
    setSelectedMixIdx((prev) => (prev + 1) % mixtures.length);
  };

  const handleReset = () => {
    setSelectedMixIdx(0);
    setSelectedTechnique(null);
    setFeedback(null);
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
        {/* Left Column: Apparatus Viewport */}
        <div>
          <div className="stem-viewport-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", background: "#6655D9", padding: "3px 10px", borderRadius: "12px", fontWeight: "700" }}>
                  MIXTURE SEPARATION BENCH
                </span>
                <span style={{ fontSize: "13px", color: "#D5D52B", fontWeight: "600" }}>
                  {currentMix.name}
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
                <RotateCcw size={13} /> Reset Bench
              </button>
            </div>

            {/* SVG Apparatus Representation */}
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

                {/* Left: Mixture Beaker / Sample Dish */}
                <g transform="translate(130, 160)">
                  <rect x="-35" y="-40" width="70" height="60" rx="4" fill="rgba(255,255,255,0.08)" stroke="#94A3B8" strokeWidth="2" />
                  {/* Mixture Contents inside Beaker */}
                  {currentMix.id === "sand-water" && (
                    <>
                      <rect x="-33" y="-10" width="66" height="28" fill="rgba(56, 189, 248, 0.4)" />
                      <ellipse cx="0" cy="14" rx="28" ry="4" fill="#92400E" />
                    </>
                  )}
                  {currentMix.id === "salt-water" && (
                    <>
                      <rect x="-33" y="-10" width="66" height="28" fill="rgba(56, 189, 248, 0.4)" />
                      <circle cx="-10" cy="5" r="2" fill="#FFFFFF" />
                      <circle cx="10" cy="10" r="2" fill="#FFFFFF" />
                    </>
                  )}
                  {currentMix.id === "iron-sand" && (
                    <>
                      <rect x="-33" y="2" width="66" height="16" fill="#78350F" />
                      <circle cx="-12" cy="10" r="3" fill="#1E293B" stroke="#CBD5E1" />
                      <circle cx="8" cy="8" r="3" fill="#1E293B" stroke="#CBD5E1" />
                    </>
                  )}
                  {currentMix.id === "grain-flour" && (
                    <>
                      <rect x="-33" y="2" width="66" height="16" fill="#FEF08A" />
                      <ellipse cx="-10" cy="10" rx="4" ry="2" fill="#CA8A04" />
                      <ellipse cx="12" cy="8" rx="4" ry="2" fill="#CA8A04" />
                    </>
                  )}
                  <text x="0" y="32" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Sample Mixture
                  </text>
                </g>

                {/* Arrow to Separation Station */}
                <text x="245" y="160" fill="#D5D52B" fontSize="22" fontWeight="bold">
                  ➔
                </text>

                {/* Right: Selected Separation Apparatus */}
                <g transform="translate(370, 150)">
                  {selectedTechnique === "filtration" && (
                    <g>
                      {/* Stand & Funnel */}
                      <line x1="-30" y1="70" x2="-30" y2="-40" stroke="#64748B" strokeWidth="3" />
                      <polygon points="-25,-30 25,-30 4,10 -4,10" fill="rgba(255,255,255,0.15)" stroke="#94A3B8" strokeWidth="2" />
                      {/* Filter Paper Cone */}
                      <polygon points="-20,-28 20,-28 0,-5" fill="#FEF08A" opacity="0.85" />
                      {/* Collection Flask below */}
                      <polygon points="-20,68 20,68 10,25 -10,25" fill="rgba(56, 189, 248, 0.3)" stroke="#94A3B8" strokeWidth="2" />
                      <text x="0" y="86" fill="#4ADE80" fontSize="11" fontWeight="bold" textAnchor="middle">
                        Filtrate Collected
                      </text>
                    </g>
                  )}

                  {selectedTechnique === "evaporation" && (
                    <g>
                      {/* Tripod and Burner Flame */}
                      <polygon points="-8,65 0,40 8,65" fill="#EF4444" />
                      <polygon points="-4,65 0,48 4,65" fill="#FBBF24" />
                      {/* Evaporating Dish */}
                      <ellipse cx="0" cy="30" rx="35" ry="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
                      {/* Steam Waves */}
                      <path d="M -10,18 Q -15,0 -10,-15" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
                      <path d="M 10,18 Q 15,0 10,-15" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
                      <text x="0" y="86" fill="#FBBF24" fontSize="11" fontWeight="bold" textAnchor="middle">
                        Evaporating Solvent
                      </text>
                    </g>
                  )}

                  {selectedTechnique === "magnetic" && (
                    <g>
                      {/* Horseshoe / Bar Magnet */}
                      <rect x="-15" y="-20" width="30" height="45" rx="4" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.5" />
                      <rect x="-15" y="10" width="30" height="15" fill="#2563EB" />
                      <text x="0" y="0" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                        N
                      </text>
                      <text x="0" y="22" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                        S
                      </text>
                      {/* Attracted iron particles clinging */}
                      <circle cx="-10" cy="28" r="2.5" fill="#CBD5E1" />
                      <circle cx="0" cy="29" r="2.5" fill="#CBD5E1" />
                      <circle cx="10" cy="27" r="2.5" fill="#CBD5E1" />
                      <text x="0" y="86" fill="#60A5FA" fontSize="11" fontWeight="bold" textAnchor="middle">
                        Iron Attracted
                      </text>
                    </g>
                  )}

                  {selectedTechnique === "sieving" && (
                    <g>
                      {/* Mesh Sieve Plate */}
                      <ellipse cx="0" cy="0" rx="40" ry="12" fill="#334155" stroke="#CBD5E1" strokeWidth="2" />
                      <line x1="-35" y1="0" x2="35" y2="0" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="2 2" />
                      {/* Particles dropping through */}
                      <circle cx="-5" cy="25" r="1.5" fill="#FEF08A" />
                      <circle cx="8" cy="35" r="1.5" fill="#FEF08A" />
                      <text x="0" y="86" fill="#FBBF24" fontSize="11" fontWeight="bold" textAnchor="middle">
                        Fine Powder Sieved
                      </text>
                    </g>
                  )}

                  {!selectedTechnique && (
                    <g>
                      <rect x="-40" y="-30" width="80" height="80" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" strokeWidth="2" />
                      <text x="0" y="15" fill="#64748B" fontSize="12" textAnchor="middle">
                        Select Technique
                      </text>
                    </g>
                  )}
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Technique Selection */}
        <div className="stem-controls-card">
          {/* Mixture Info Card */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <FlaskConical size={16} color="#6655D9" /> Active Mixture #{selectedMixIdx + 1}
            </h3>
            <div style={{ background: "#F8FAFC", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
              <span style={{ fontSize: "15px", fontWeight: "700", color: "#1E293B" }}>
                {currentMix.name}
              </span>
              <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0" }}>
                Classification: <strong>{currentMix.type}</strong>
              </p>
            </div>
          </div>

          {/* Technique Picker */}
          <div className="stem-card-white">
            <h3 className="stem-card-title">
              <Sparkles size={16} color="#16A34A" /> Choose Separation Technique
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {techniques.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => handleTestSeparation(tech.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: selectedTechnique === tech.id ? "2px solid #6655D9" : "1px solid #CBD5E1",
                    background: selectedTechnique === tech.id ? "rgba(102, 85, 217, 0.08)" : "#FFFFFF",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#1E293B" }}>
                    {tech.name}
                  </span>
                  <span style={{ fontSize: "11px", color: "#64748B" }}>{tech.desc}</span>
                </button>
              ))}
            </div>

            {feedback && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  backgroundColor: feedback.success ? "#DCFCE7" : "#FEE2E2",
                  color: feedback.success ? "#166534" : "#991B1B",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {feedback.success ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>{feedback.text}</span>
              </div>
            )}

            <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
              <button
                onClick={handleNextMixture}
                style={{
                  flex: 1,
                  background: "#F8FAF9",
                  border: "1px solid #CBD5E1",
                  padding: "9px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Next Mixture →
              </button>
            </div>

            <div style={{ marginTop: "14px", borderTop: "1px solid #E2E8F0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#64748B" }}>
                Separated: <strong>{separatedCount} of 4</strong>
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

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  CheckCircle2,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Home,
  X
} from "lucide-react";
import "./LabStyles.css";

export default function ExperimentCompletionModal({
  isOpen,
  onClose,
  onRestart,
  experimentTitle = "Separation of Sand and Water (Filtration)",
  subject = "Chemistry",
  scientificConcept = "Filtration is a mechanical separation technique that separates insoluble solid particles from a liquid suspension based on particle size. Filter paper contains microscopic pores: solvent water molecules pass freely through the pores, while larger insoluble sand particles are trapped on top.",
  observations = [
    "Before pouring: Insoluble sand particles were suspended inside the turbid water mixture.",
    "During filtration: Water dripped steadily through the filter funnel stem into the measuring cylinder.",
    "After filtration: Brown sand grains remained trapped on the porous paper surface as residue.",
    "In collection cylinder: Clear, transparent water collected as the liquid filtrate.",
  ],
  result = "The mixture of sand and water was successfully separated through filtration without requiring chemical reagents or thermal energy.",
  quizRoute = "/quiz",
  quizTitle = "Take Filtration Quiz",
  savingStatus = "saved", // "saving" | "saved" | "error"
  savingError = "",
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="stem-modal-overlay" onClick={onClose}>
      <div className="stem-modal-card completion-modal" onClick={(e) => e.stopPropagation()}>
        <button className="stem-modal-close" onClick={onClose} aria-label="Close completion modal">
          <X size={20} />
        </button>

        {/* Celebration Header */}
        <div className="stem-comp-header">
          <div className="stem-comp-trophy">
            <Trophy size={42} />
          </div>
          <span className="stem-comp-kicker">{subject.toUpperCase()} · EXPERIMENT COMPLETED</span>
          <h2>Great work! You mastered this experiment.</h2>
          <p className="stem-comp-subtitle">{experimentTitle}</p>
        </div>

        {/* Persistence Status */}
        <div className={`stem-save-indicator ${savingStatus}`}>
          {savingStatus === "saving" && (
            <span>⏳ Synchronizing experiment progress to Supabase...</span>
          )}
          {savingStatus === "saved" && (
            <span>✓ Experiment completion recorded in your student profile!</span>
          )}
          {savingStatus === "error" && (
            <span>Notice: {savingError || "Could not sync to cloud. Log in to save scores."}</span>
          )}
        </div>

        {/* 1. Scientific Concept */}
        <div className="stem-comp-box">
          <div className="stem-comp-box-title">
            <BookOpen size={17} color="#D5D52B" />
            <h4>The Scientific Concept</h4>
          </div>
          <p>{scientificConcept}</p>
        </div>

        {/* 2. Key Observations */}
        <div className="stem-comp-box">
          <div className="stem-comp-box-title">
            <CheckCircle2 size={17} color="#16A34A" />
            <h4>Experimental Observations</h4>
          </div>
          <ul className="stem-comp-obs-list">
            {observations.map((obs, idx) => (
              <li key={idx}>
                <strong>Observation {idx + 1}:</strong> {obs}
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Final Result */}
        <div className="stem-comp-box result-highlight">
          <div className="stem-comp-box-title">
            <Award size={17} color="#313E3B" />
            <h4>Final Scientific Result</h4>
          </div>
          <p>{result}</p>
        </div>

        {/* Next Actions & Quiz Link */}
        <div className="stem-comp-actions">
          {quizRoute && (
            <Link to={quizRoute} className="stem-action-btn-quiz">
              <Award size={18} />
              <span>{quizTitle}</span>
              <ArrowRight size={18} />
            </Link>
          )}

          <div className="stem-comp-secondary-btns">
            {onRestart && (
              <button className="stem-btn-secondary" onClick={onRestart}>
                <RotateCcw size={16} />
                <span>Repeat Experiment</span>
              </button>
            )}

            <button className="stem-btn-secondary" onClick={() => navigate("/dashboard")}>
              <Home size={16} />
              <span>Return to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

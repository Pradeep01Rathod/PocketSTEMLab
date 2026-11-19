import React from "react";
import {
  ShieldAlert,
  CheckCircle2,
  BookOpen,
  FlaskConical,
  X,
  Play,
  Sparkles
} from "lucide-react";
import "./LabStyles.css";

export default function ExperimentIntroModal({
  isOpen,
  onClose,
  experimentName = "Separation of Sand and Water (Filtration)",
  subject = "Chemistry",
  classLevel = "Class 6",
  chapter = "Separation of Substances",
  objectives = [
    "Understand the mechanical principle of separating an insoluble solid from a liquid.",
    "Learn the role of filter paper, funnels, beakers, and measuring cylinders in practical chemistry.",
    "Observe how liquid filtrate passes through porous paper while solid residue is trapped.",
  ],
  materials = [
    "Glass beaker containing sand and water suspension",
    "Conical glass filter funnel",
    "High-retention porous circular filter paper",
    "Calibrated measuring cylinder for filtrate collection",
    "Laboratory workbench stations with support stands",
  ],
  safetyGuidelines = [
    "Wear virtual safety goggles when manipulating glassware.",
    "Handle delicate glass equipment with care to avoid simulated breakage.",
    "Keep workbenches orderly; return unused apparatus to storage shelves.",
    "Always observe the meniscus at eye level when reading measuring cylinders.",
  ],
}) {
  if (!isOpen) return null;

  return (
    <div className="stem-modal-overlay" onClick={onClose}>
      <div className="stem-modal-card intro-modal" onClick={(e) => e.stopPropagation()}>
        <button className="stem-modal-close" onClick={onClose} aria-label="Close intro">
          <X size={20} />
        </button>

        <div className="stem-intro-badge-row">
          <span className="stem-badge-primary">
            <Sparkles size={13} /> {subject.toUpperCase()} LAB
          </span>
          <span className="stem-badge-secondary">{classLevel}</span>
          <span className="stem-badge-secondary">Chapter: {chapter}</span>
        </div>

        <h2 className="stem-intro-title">{experimentName}</h2>

        {/* 1. Learning Objectives */}
        <div className="stem-intro-section">
          <div className="stem-intro-section-title">
            <BookOpen size={17} color="#D5D52B" />
            <h4>Learning Objectives</h4>
          </div>
          <ul className="stem-intro-list">
            {objectives.map((obj, idx) => (
              <li key={idx}>
                <CheckCircle2 size={16} color="#16A34A" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Materials & Equipment */}
        <div className="stem-intro-section">
          <div className="stem-intro-section-title">
            <FlaskConical size={17} color="#D5D52B" />
            <h4>Required Virtual Apparatus</h4>
          </div>
          <div className="stem-materials-grid">
            {materials.map((mat, idx) => (
              <div key={idx} className="stem-material-chip">
                <span className="stem-mat-num">0{idx + 1}</span>
                <span>{mat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Safety Information */}
        <div className="stem-intro-section safety-box">
          <div className="stem-intro-section-title">
            <ShieldAlert size={17} color="#EF4444" />
            <h4>Laboratory Safety Protocol</h4>
          </div>
          <ul className="stem-intro-list safety-list">
            {safetyGuidelines.map((safe, idx) => (
              <li key={idx}>
                <span className="safety-bullet">⚠️</span>
                <span>{safe}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Start Button */}
        <div className="stem-intro-footer">
          <button className="stem-start-lab-btn" onClick={onClose}>
            <Play size={17} fill="currentColor" />
            <span>Start Guided Experiment</span>
          </button>
        </div>
      </div>
    </div>
  );
}

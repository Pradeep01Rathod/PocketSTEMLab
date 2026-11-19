import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Atom,
  ArrowLeft,
  ShieldAlert,
  RotateCcw,
  FlaskConical,
  Zap,
  Microscope,
  Shapes,
  Home
} from "lucide-react";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useLanguage } from "../../i18n/LanguageContext";
import "./LabStyles.css";

const subjectIcons = {
  chemistry: FlaskConical,
  physics: Zap,
  biology: Microscope,
  math: Shapes,
};

export default function LabHeader({
  subjectId = "chemistry",
  subjectName = "Chemistry",
  experimentTitle = "Filtration Experiment",
  classLevel = "Class 6",
  onReset,
  onOpenIntro,
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const SubjectIcon = subjectIcons[subjectId] || FlaskConical;

  return (
    <header className="stem-lab-header">
      <div className="stem-lab-header-left">
        {/* Brand */}
        <Link to="/" className="stem-lab-brand" title="EduSpark Home">
          <div className="stem-lab-brand-icon">
            <Atom size={20} />
          </div>
          <span className="stem-lab-brand-name">
            Edu<strong>Spark</strong>
          </span>
        </Link>

        <span className="stem-lab-divider">/</span>

        {/* Return to Dashboard */}
        <button
          className="stem-lab-back-btn"
          onClick={() => navigate("/dashboard")}
          title="Return to Student Dashboard"
        >
          <ArrowLeft size={16} />
          <span>Dashboard</span>
        </button>

        <span className="stem-lab-divider">/</span>

        {/* Experiment Pill */}
        <div className="stem-lab-title-pill">
          <SubjectIcon size={16} className="stem-lab-subject-icon" />
          <span className="stem-lab-subject-tag">{subjectName}</span>
          <span className="stem-lab-exp-name">{experimentTitle}</span>
          <span className="stem-lab-class-tag">{classLevel}</span>
        </div>
      </div>

      <div className="stem-lab-header-right">
        <LanguageSwitcher compact />

        {onOpenIntro && (
          <button
            className="stem-lab-action-btn"
            onClick={onOpenIntro}
            title="View Experiment Objectives and Safety Information"
          >
            <ShieldAlert size={16} />
            <span>Lab Guide & Safety</span>
          </button>
        )}

        {onReset && (
          <button
            className="stem-lab-action-btn"
            onClick={onReset}
            title="Reset Experiment Apparatus"
          >
            <RotateCcw size={16} />
            <span>{t("btn_reset", "Reset Lab")}</span>
          </button>
        )}

        <button
          className="stem-lab-action-btn dashboard-btn"
          onClick={() => navigate("/dashboard")}
        >
          <Home size={16} />
          <span>{t("nav_back_dashboard", "Exit Lab")}</span>
        </button>
      </div>
    </header>
  );
}

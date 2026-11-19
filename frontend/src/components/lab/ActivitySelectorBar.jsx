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
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useLanguage } from "../../i18n/LanguageContext";
import "./LabStyles.css";

const subjectIcons = {
  chemistry: FlaskConical,
  physics: Zap,
  biology: Microscope,
  math: Shapes,
  mathematics: Shapes,
};

export default function ActivitySelectorBar({
  subjectId = "math",
  subjectName = "Mathematics",
  activities = [],
  currentActivityId = "",
  onSelectActivity,
  onOpenIntro,
  onReset,
  completedMap = {},
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const SubjectIcon = subjectIcons[subjectId] || Shapes;

  return (
    <div className="activity-selector-container">
      {/* Top Header Bar */}
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

          {/* Subject Pill */}
          <div className="stem-lab-title-pill">
            <SubjectIcon size={16} className="stem-lab-subject-icon" />
            <span className="stem-lab-subject-tag">{subjectName}</span>
            <span className="stem-lab-class-tag">Classes 6–10</span>
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
              <span>Lab Guide</span>
            </button>
          )}

          {onReset && (
            <button
              className="stem-lab-action-btn"
              onClick={onReset}
              title="Reset Experiment Apparatus"
            >
              <RotateCcw size={16} />
              <span>{t("btn_reset", "Reset")}</span>
            </button>
          )}

          <button
            className="stem-lab-action-btn dashboard-btn"
            onClick={() => navigate("/subjects")}
            title="Browse All Subjects"
          >
            <span>All Subjects</span>
          </button>
        </div>
      </header>

      {/* Activity Navigation Tab Bar */}
      <nav className="activity-tabs-strip" aria-label="Laboratory Activities">
        <div className="activity-tabs-label">
          <Sparkles size={14} color="#6655D9" />
          <span>Interactive Labs:</span>
        </div>
        <div className="activity-tabs-list">
          {activities.map((act) => {
            const isActive = act.id === currentActivityId;
            const isDone = Boolean(completedMap[act.lessonId || act.id]);

            return (
              <button
                key={act.id}
                type="button"
                className={`activity-tab-btn ${isActive ? "active" : ""} ${
                  isDone ? "completed" : ""
                }`}
                onClick={() => onSelectActivity(act.id)}
                title={act.subtitle || act.title}
              >
                {isDone && (
                  <CheckCircle2
                    size={13}
                    className="tab-done-icon"
                    color="#16A34A"
                  />
                )}
                <span className="tab-title">{act.title}</span>
                <span className="tab-grade">{act.classLevel}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

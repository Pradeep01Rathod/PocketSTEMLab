import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Atom,
  Compass,
  BookOpen,
  FlaskConical,
  Trophy,
  Award,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function DashboardSidebar({
  activeTab = "dashboard",
  isOpen = false,
  onClose = () => {},
  profile = null,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut().catch(() => {});
    navigate("/login", { replace: true });
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Compass,
      path: "/dashboard",
      isAnchor: false,
    },
    {
      id: "subjects",
      label: "Explore Subjects",
      icon: BookOpen,
      path: "/subjects",
      isAnchor: false,
      badge: "4 Core",
    },
    {
      id: "quizzes",
      label: "Available Quizzes",
      icon: Award,
      path: "/quiz",
      isAnchor: false,
    },
    {
      id: "lab",
      label: "3D Chemistry Lab",
      icon: FlaskConical,
      path: "/chemistry-lab",
      isAnchor: false,
      highlight: true,
    },
    {
      id: "progress",
      label: "My Progress",
      icon: Trophy,
      path: "/dashboard#my-progress",
      isAnchor: true,
    },
    {
      id: "activity",
      label: "Learning Activity",
      icon: Sparkles,
      path: "/dashboard#recent-activity",
      isAnchor: true,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="dash-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`dash-sidebar ${isOpen ? "open" : ""}`} aria-label="Student Sidebar Navigation">
        {/* Sidebar Brand Header */}
        <div className="dash-sidebar-header">
          <Link to="/" className="dash-sidebar-brand" onClick={onClose}>
            <div className="dash-brand-icon-box">
              <Atom size={22} />
            </div>
            <div className="dash-brand-text-wrap">
              <span className="dash-sidebar-brand-name">
                Edu<strong>Spark</strong>
              </span>
              <span className="dash-sidebar-brand-tag">STEM LABORATORY</span>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            className="dash-sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="dash-sidebar-nav">
          <div className="dash-nav-section-label">MAIN NAVIGATION</div>
          <ul className="dash-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                (item.id === "dashboard" && location.pathname === "/dashboard") ||
                (item.id === "subjects" && location.pathname === "/subjects") ||
                (item.id === activeTab);

              return (
                <li key={item.id} className="dash-nav-item">
                  <Link
                    to={item.path}
                    className={`dash-nav-link ${isActive ? "active" : ""} ${
                      item.highlight ? "highlight" : ""
                    }`}
                    onClick={onClose}
                  >
                    <span className="dash-nav-icon">
                      <Icon size={18} />
                    </span>
                    <span className="dash-nav-label">{item.label}</span>
                    {item.badge && <span className="dash-nav-badge">{item.badge}</span>}
                    {isActive && <span className="dash-nav-active-indicator" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom User Info & Logout */}
        <div className="dash-sidebar-footer">
          <div className="dash-user-chip">
            <div className="dash-user-avatar">
              {(profile?.display_name || "S").charAt(0).toUpperCase()}
            </div>
            <div className="dash-user-info">
              <span className="dash-user-name">{profile?.display_name || "Student"}</span>
              <span className="dash-user-class">
                {profile?.student_class?.toString().startsWith("Class")
                  ? profile.student_class
                  : `Class ${profile?.student_class || "6"}`}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="dash-sidebar-logout-btn"
            onClick={handleLogout}
            title="Log out of student portal"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

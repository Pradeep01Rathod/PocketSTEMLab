import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { supabase } from "../../supabaseClient";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { useLanguage } from "../../i18n/LanguageContext";

export default function DashboardHeader({
  profile = null,
  onToggleSidebar = () => {},
  pageTitle = "",
  pageSubtitle = "",
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await supabase.auth.signOut().catch(() => {});
    navigate("/login", { replace: true });
  };

  const studentName = profile?.display_name || "Student";
  const studentInitial = studentName.charAt(0).toUpperCase();
  const rawClass = profile?.student_class || "6";
  const formattedClass = rawClass.toString().startsWith("Class")
    ? rawClass
    : `Class ${rawClass}`;

  return (
    <header className="dash-top-header" role="banner">
      <div className="dash-top-header-inner">
        {/* Left Side: Mobile Menu Button & Breadcrumb */}
        <div className="dash-header-left">
          <button
            type="button"
            className="dash-hamburger-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation drawer"
          >
            <Menu size={22} />
          </button>

          <div className="dash-page-titles">
            <h1 className="dash-page-heading">
              {pageTitle || `Welcome back, ${studentName}!`}
            </h1>
            {pageSubtitle && (
              <p className="dash-page-subheading">{pageSubtitle}</p>
            )}
          </div>
        </div>

        {/* Right Side: Language Switcher, Profile Pill, Logout */}
        <div className="dash-header-right">
          <div className="dash-header-lang-wrap">
            <LanguageSwitcher />
          </div>

          <div className="dash-header-profile-pill" title={`Logged in as ${studentName} (${formattedClass})`}>
            <div className="dash-header-avatar" aria-hidden="true">
              {studentInitial}
            </div>
            <div className="dash-header-profile-meta">
              <span className="dash-header-profile-name">{studentName}</span>
              <span className="dash-header-profile-class">{formattedClass}</span>
            </div>
          </div>

          <button
            type="button"
            className="dash-header-logout-btn"
            onClick={handleLogout}
            title={t("nav_logout", "Log out")}
            aria-label="Log out of student portal"
          >
            <LogOut size={16} />
            <span className="dash-logout-text">{t("nav_logout", "Logout")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Atom,
  FlaskConical,
  Zap,
  Microscope,
  Shapes,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Award,
  Globe2,
  Accessibility,
  Laptop,
  Compass,
  ArrowUp,
  ShieldCheck
} from "lucide-react";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import { useLanguage } from "../i18n/LanguageContext";
import "./Crafto.css";

export default function CraftoLanding() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track scrolling for sticky navbar styling & scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 40);
      setShowScrollTop(offset > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="crafto-root">
      {/* =========================================================================
          SECTION 1 — NAVIGATION HEADER
      ========================================================================= */}
      <header className={`crafto-header ${isScrolled ? "scrolled" : ""}`}>
        {/* Top announcement bar */}
        <div className="crafto-topbar">
          <div className="crafto-container crafto-topbar-inner">
            <div className="crafto-topbar-left">
              <span className="crafto-topbar-item">
                <Sparkles size={14} color="#D5D52B" />
                <span>Interactive STEM Education Platform · <strong>Classes 6–10</strong></span>
              </span>
            </div>
            <div className="crafto-topbar-right">
              <LanguageSwitcher compact />
              <span className="crafto-topbar-divider">|</span>
              <Link to="/chemistry-lab" className="crafto-topbar-link highlight">
                ⚡ Try 3D Chemistry Lab
              </Link>
              <span className="crafto-topbar-divider">|</span>
              <Link to="/login" className="crafto-topbar-link">
                Student Login
              </Link>
              <Link to="/register" className="crafto-topbar-link register-pill">
                Register Free
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="crafto-nav-wrap">
          <div className="crafto-container crafto-nav-inner">
            {/* EduSpark Brand Logo */}
            <Link to="/" className="crafto-brand-logo" aria-label="EduSpark Home">
              <div className="crafto-brand-icon">
                <Atom size={24} />
              </div>
              <div className="crafto-brand-text">
                <span className="crafto-brand-title">
                  Edu<strong>Spark</strong>
                </span>
                <span className="crafto-brand-subtitle">STEM LABORATORY</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="crafto-nav-menu" aria-label="Main Navigation">
              <button
                type="button"
                className="crafto-nav-link"
                onClick={() => scrollToSection("home")}
              >
                {t("nav_home", "Home")}
              </button>
              <button
                type="button"
                className="crafto-nav-link"
                onClick={() => scrollToSection("about")}
              >
                {t("landing_nav_about", "About")}
              </button>
              <button
                type="button"
                className="crafto-nav-link"
                onClick={() => scrollToSection("features")}
              >
                {t("landing_nav_features", "Features")}
              </button>
              <button
                type="button"
                className="crafto-nav-link"
                onClick={() => scrollToSection("subjects")}
              >
                {t("nav_subjects", "Subjects")}
              </button>
              <button
                type="button"
                className="crafto-nav-link"
                onClick={() => scrollToSection("how-it-works")}
              >
                {t("landing_nav_how_it_works", "How It Works")}
              </button>
              <button
                type="button"
                className="crafto-nav-link"
                onClick={() => scrollToSection("virtual-lab")}
              >
                {t("landing_nav_virtual_lab", "Virtual Lab")}
              </button>
              <button
                type="button"
                className="crafto-nav-link"
                onClick={() => scrollToSection("accessibility")}
              >
                {t("landing_nav_accessibility", "Accessibility")}
              </button>
            </nav>

            {/* Right Action Buttons */}
            <div className="crafto-nav-actions">
              <Link to="/login" className="crafto-login-ghost-btn">
                {t("nav_login", "Log In")}
              </Link>

              <Link to="/register" className="crafto-btn crafto-btn-primary crafto-nav-cta">
                {t("landing_btn_start", "Start Learning")}
                <span className="crafto-btn-icon">
                  <ArrowRight size={16} />
                </span>
              </Link>

              {/* Mobile menu toggle */}
              <button
                type="button"
                className="crafto-mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="crafto-mobile-drawer">
            <div className="crafto-mobile-menu">
              <button
                type="button"
                className="crafto-mobile-link"
                onClick={() => scrollToSection("home")}
              >
                Home
              </button>
              <button
                type="button"
                className="crafto-mobile-link"
                onClick={() => scrollToSection("about")}
              >
                About
              </button>
              <button
                type="button"
                className="crafto-mobile-link"
                onClick={() => scrollToSection("features")}
              >
                Features
              </button>
              <button
                type="button"
                className="crafto-mobile-link"
                onClick={() => scrollToSection("subjects")}
              >
                Subjects
              </button>
              <button
                type="button"
                className="crafto-mobile-link"
                onClick={() => scrollToSection("how-it-works")}
              >
                How It Works
              </button>
              <button
                type="button"
                className="crafto-mobile-link"
                onClick={() => scrollToSection("virtual-lab")}
              >
                Virtual 3D Lab
              </button>
              <button
                type="button"
                className="crafto-mobile-link"
                onClick={() => scrollToSection("accessibility")}
              >
                Accessibility & Offline
              </button>

              <div className="crafto-mobile-actions">
                <Link
                  to="/login"
                  className="crafto-mobile-btn secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Student Login
                </Link>
                <Link
                  to="/register"
                  className="crafto-mobile-btn primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register Free
                </Link>
                <Link
                  to="/chemistry-lab"
                  className="crafto-mobile-btn lab-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ⚡ Enter 3D Chemistry Lab
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main id="main-content">
        {/* =========================================================================
            SECTION 2 — HERO SECTION
        ========================================================================= */}
        <section className="crafto-hero" id="home">
          {/* Abstract decor graphics from existing public assets */}
          <img
            src="/crafto/demo-elearning-01.png"
            alt=""
            aria-hidden="true"
            className="crafto-hero-decor crafto-decor-1"
          />
          <img
            src="/crafto/demo-elearning-03.png"
            alt=""
            aria-hidden="true"
            className="crafto-hero-decor crafto-decor-2"
          />

          <div className="crafto-container crafto-hero-grid">
            {/* Left Content Column */}
            <div className="crafto-hero-content">
              <div className="crafto-badge">
                <span className="crafto-badge-dot"></span>
                <span>{t("landing_hero_badge", "Explore. Experiment. Experience Science.")}</span>
              </div>

              <h1 className="crafto-hero-title">
                {t("landing_hero_title", "Discover STEM Through Interactive Learning.")}
              </h1>

              <p className="crafto-hero-subtitle">
                {t(
                  "landing_hero_desc",
                  "Explore Mathematics, Physics, Chemistry and Biology through engaging lessons, interactive activities and virtual science experiments designed specifically for school students in Classes 6–10."
                )}
              </p>

              <div className="crafto-hero-actions">
                <Link to="/register" className="crafto-btn crafto-btn-primary">
                  {t("landing_btn_start", "Start Learning")}
                  <span className="crafto-btn-icon">
                    <ArrowRight size={18} />
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => scrollToSection("subjects")}
                  className="crafto-btn crafto-btn-outline"
                >
                  {t("landing_btn_explore_subjects", "Explore Subjects")}
                </button>

                <Link to="/chemistry-lab" className="crafto-hero-lab-pill">
                  <span className="crafto-hero-lab-pill-icon">⚡</span>
                  <span>{t("landing_btn_try_lab", "Try 3D Filtration Lab")}</span>
                </Link>
              </div>

              {/* STEM Core Value Highlights */}
              <div className="crafto-hero-highlights">
                <span className="crafto-highlight-item">
                  <CheckCircle2 size={16} color="#D5D52B" />
                  <span>Classes 6–10 Curriculum</span>
                </span>
                <span className="crafto-highlight-item">
                  <CheckCircle2 size={16} color="#D5D52B" />
                  <span>Interactive 3D Equipment</span>
                </span>
                <span className="crafto-highlight-item">
                  <CheckCircle2 size={16} color="#D5D52B" />
                  <span>Free for All Students</span>
                </span>
              </div>
            </div>

            {/* Right Visual Column with Local STEM Asset & 4 Real Subject Badges */}
            <div className="crafto-hero-visual">
              <div className="crafto-hero-img-wrap">
                <img
                  src="/crafto/demo-elearning-hero-banner-01.webp"
                  alt="Student exploring interactive STEM laboratory experiments"
                  className="crafto-hero-main-img"
                  loading="eager"
                />

                {/* Floating Badge 1: Chemistry */}
                <div className="crafto-floating-stem-badge badge-chemistry">
                  <div className="stem-badge-icon" style={{ backgroundColor: "rgba(102, 85, 217, 0.15)", color: "#6655D9" }}>
                    <FlaskConical size={18} />
                  </div>
                  <div className="stem-badge-text">
                    <strong>Chemistry</strong>
                    <span>3D Virtual Filtration Lab</span>
                  </div>
                </div>

                {/* Floating Badge 2: Physics */}
                <div className="crafto-floating-stem-badge badge-physics">
                  <div className="stem-badge-icon" style={{ backgroundColor: "rgba(239, 153, 31, 0.15)", color: "#EF991F" }}>
                    <Zap size={18} />
                  </div>
                  <div className="stem-badge-text">
                    <strong>Physics</strong>
                    <span>Electric Circuit Simulation</span>
                  </div>
                </div>

                {/* Floating Badge 3: Biology */}
                <div className="crafto-floating-stem-badge badge-biology">
                  <div className="stem-badge-icon" style={{ backgroundColor: "rgba(40, 182, 122, 0.15)", color: "#28B67A" }}>
                    <Microscope size={18} />
                  </div>
                  <div className="stem-badge-text">
                    <strong>Biology</strong>
                    <span>Plant Cell Explorer</span>
                  </div>
                </div>

                {/* Floating Badge 4: Mathematics */}
                <div className="crafto-floating-stem-badge badge-math">
                  <div className="stem-badge-icon" style={{ backgroundColor: "rgba(45, 127, 249, 0.15)", color: "#2D7FF9" }}>
                    <Shapes size={18} />
                  </div>
                  <div className="stem-badge-text">
                    <strong>Mathematics</strong>
                    <span>3D Polyhedrons & Euler's Law</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3 — ABOUT EDUSPARK
        ========================================================================= */}
        <section className="crafto-about-sec" id="about">
          <div className="crafto-container">
            <div className="crafto-about-grid">
              {/* Left Side: Illustrative Visual */}
              <div className="crafto-about-img-wrap">
                <img
                  src="/crafto/demo-elearning-07-600x430.jpg"
                  alt="Practical STEM exploration in EduSpark"
                  className="crafto-about-img"
                  loading="lazy"
                />
                <div className="crafto-about-callout-card">
                  <span className="crafto-about-callout-number">4</span>
                  <span className="crafto-about-callout-label">
                    Core STEM Subjects Integrated in One Platform
                  </span>
                </div>
              </div>

              {/* Right Side: Narrative */}
              <div className="crafto-about-text-wrap">
                <div className="crafto-badge crafto-badge-dark">
                  <span className="crafto-badge-dot"></span>
                  <span>ABOUT EDUSPARK</span>
                </div>

                <h2 className="crafto-sec-title">
                  {t("landing_about_title", "Learning Beyond the Classroom.")}
                </h2>

                <p className="crafto-sec-lead">
                  {t(
                    "landing_about_desc",
                    "EduSpark bridges the gap between textbook theory and practical scientific understanding for school students in Classes 6–10, especially in rural and underserved communities where physical laboratory apparatus may be limited."
                  )}
                </p>

                <p className="crafto-sec-body">
                  Instead of merely memorizing formulas, students step into interactive environments:
                  measuring chemical solutions, assembling closed electrical circuits, investigating
                  microscopic cell walls, and manipulating 3D polyhedrons with immediate feedback.
                </p>

                <div className="crafto-about-pillars">
                  <div className="crafto-pillar-item">
                    <div className="crafto-pillar-icon">
                      <Compass size={20} color="#D5D52B" />
                    </div>
                    <div>
                      <h4>Active Concept Exploration</h4>
                      <p>Students learn by doing — rotating models, testing hypotheses, and observing real scientific consequences.</p>
                    </div>
                  </div>

                  <div className="crafto-pillar-item">
                    <div className="crafto-pillar-icon">
                      <ShieldCheck size={20} color="#D5D52B" />
                    </div>
                    <div>
                      <h4>Safe Digital Experimentation</h4>
                      <p>A zero-risk digital laboratory where mistakes are safe opportunities to analyze and improve.</p>
                    </div>
                  </div>

                  <div className="crafto-pillar-item">
                    <div className="crafto-pillar-icon">
                      <Accessibility size={20} color="#D5D52B" />
                    </div>
                    <div>
                      <h4>Inclusivity for Every School</h4>
                      <p>Designed for low-bandwidth connections, progressive multilingual support, and low-spec device classrooms.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4 — LEARNING FEATURES
        ========================================================================= */}
        <section className="crafto-features-sec" id="features">
          <div className="crafto-container">
            <div className="crafto-sec-header text-center">
              <div className="crafto-badge">
                <span className="crafto-badge-dot"></span>
                <span>PLATFORM CAPABILITIES</span>
              </div>
              <h2 className="crafto-sec-title">
                {t("landing_features_title", "Engineered for Curious Minds.")}
              </h2>
              <p className="crafto-sec-desc">
                {t("landing_features_desc", "Everything young scientists need to understand core STEM principles through practice.")}
              </p>
            </div>

            <div className="crafto-features-grid">
              {/* Feature 1 */}
              <div className="crafto-feature-card">
                <div className="crafto-feature-icon-wrap" style={{ backgroundColor: "rgba(102, 85, 217, 0.12)", color: "#6655D9" }}>
                  <FlaskConical size={26} />
                </div>
                <h3>Interactive Virtual Laboratory</h3>
                <p>
                  Explore real-time 3D equipment — inspect beakers, graduated cylinders, funnels, and filter papers in an interactive environment.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="crafto-feature-card">
                <div className="crafto-feature-icon-wrap" style={{ backgroundColor: "rgba(239, 153, 31, 0.12)", color: "#EF991F" }}>
                  <Compass size={26} />
                </div>
                <h3>Guided Experiments</h3>
                <p>
                  Follow clear step-by-step instructions with safety pointers and helpful guidance that explains each scientific observation.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="crafto-feature-card">
                <div className="crafto-feature-icon-wrap" style={{ backgroundColor: "rgba(40, 182, 122, 0.12)", color: "#28B67A" }}>
                  <Sparkles size={26} />
                </div>
                <h3>AI Doubt Assistance</h3>
                <p>
                  Ask subject-specific questions in simple school-level language with step-by-step explanations and curriculum-aligned examples.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="crafto-feature-card">
                <div className="crafto-feature-icon-wrap" style={{ backgroundColor: "rgba(45, 127, 249, 0.12)", color: "#2D7FF9" }}>
                  <Award size={26} />
                </div>
                <h3>Interactive STEM Quizzes</h3>
                <p>
                  Test your understanding with topic quizzes, immediate feedback, and clear scientific explanations for every option.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="crafto-feature-card">
                <div className="crafto-feature-icon-wrap" style={{ backgroundColor: "rgba(213, 213, 43, 0.2)", color: "#858500" }}>
                  <Globe2 size={26} />
                </div>
                <h3>Multilingual Support</h3>
                <p>
                  Switch between English, Kannada (ಕನ್ನಡ), and Hindi (हिन्दी) for navigation and key headings. Full regional curriculum content rollout is in progress.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="crafto-feature-card">
                <div className="crafto-feature-icon-wrap" style={{ backgroundColor: "rgba(100, 116, 139, 0.15)", color: "#475569" }}>
                  <Accessibility size={26} />
                </div>
                <h3>Accessible Learning</h3>
                <p>
                  Foundational PWA app-shell architecture, full keyboard navigation, high-contrast focus outlines, and reduced-motion vestibular support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5 — SUBJECTS
        ========================================================================= */}
        <section className="crafto-subjects-sec" id="subjects">
          <div className="crafto-container">
            <div className="crafto-sec-header text-center">
              <div className="crafto-badge crafto-badge-dark">
                <span className="crafto-badge-dot"></span>
                <span>CORE CURRICULUM</span>
              </div>
              <h2 className="crafto-sec-title">
                Explore Core <span>STEM Subjects.</span>
              </h2>
              <p className="crafto-sec-desc">
                Organized for Classes 6–10 with interactive lessons, hands-on activities, and concept assessments.
              </p>
            </div>

            <div className="crafto-subjects-grid">
              {/* 1. Mathematics */}
              <div className="crafto-subject-card card-math">
                <div className="crafto-subject-header">
                  <div className="crafto-subject-icon-box" style={{ backgroundColor: "#2D7FF9" }}>
                    <Shapes size={28} color="#FFFFFF" />
                  </div>
                  <span className="crafto-subject-grade-pill">Classes 6–10</span>
                </div>
                <h3 className="crafto-subject-name">Mathematics</h3>
                <p className="crafto-subject-desc">
                  Learn numbers, algebra, geometry and problem-solving through visual demonstrations and spatial reasoning.
                </p>
                <ul className="crafto-subject-topic-list">
                  <li><CheckCircle2 size={14} color="#2D7FF9" /> 3D Polyhedrons & Euler's Formula</li>
                  <li><CheckCircle2 size={14} color="#2D7FF9" /> Fractions, Decimals & Number Lines</li>
                  <li><CheckCircle2 size={14} color="#2D7FF9" /> Coordinate Geometry & Measurement</li>
                </ul>
                <div className="crafto-subject-footer">
                  <Link to="/login" className="crafto-subject-explore-btn">
                    <span>Explore Mathematics</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              {/* 2. Physics */}
              <div className="crafto-subject-card card-physics">
                <div className="crafto-subject-header">
                  <div className="crafto-subject-icon-box" style={{ backgroundColor: "#EF991F" }}>
                    <Zap size={28} color="#FFFFFF" />
                  </div>
                  <span className="crafto-subject-grade-pill">Classes 6–10</span>
                </div>
                <h3 className="crafto-subject-name">Physics</h3>
                <p className="crafto-subject-desc">
                  Explore motion, force, energy, light and electricity through interactive virtual simulations.
                </p>
                <ul className="crafto-subject-topic-list">
                  <li><CheckCircle2 size={14} color="#EF991F" /> Electric Circuits & Knife Switches</li>
                  <li><CheckCircle2 size={14} color="#EF991F" /> Conductors vs Electrical Insulators</li>
                  <li><CheckCircle2 size={14} color="#EF991F" /> Force, Pressure & Light Reflection</li>
                </ul>
                <div className="crafto-subject-footer">
                  <Link to="/login" className="crafto-subject-explore-btn">
                    <span>Explore Physics</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              {/* 3. Chemistry */}
              <div className="crafto-subject-card card-chemistry">
                <div className="crafto-subject-header">
                  <div className="crafto-subject-icon-box" style={{ backgroundColor: "#6655D9" }}>
                    <FlaskConical size={28} color="#FFFFFF" />
                  </div>
                  <span className="crafto-subject-grade-pill">Classes 6–10</span>
                </div>
                <h3 className="crafto-subject-name">Chemistry</h3>
                <p className="crafto-subject-desc">
                  Discover matter, reactions, mixtures and laboratory experiments in our safe virtual 3D room.
                </p>
                <ul className="crafto-subject-topic-list">
                  <li><CheckCircle2 size={14} color="#6655D9" /> 3D Filtration & Separation of Mixtures</li>
                  <li><CheckCircle2 size={14} color="#6655D9" /> Acids, Bases & Litmus Indicators</li>
                  <li><CheckCircle2 size={14} color="#6655D9" /> Atoms, Molecules & Chemical Changes</li>
                </ul>
                <div className="crafto-subject-footer">
                  <Link to="/login" className="crafto-subject-explore-btn">
                    <span>Explore Chemistry</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              {/* 4. Biology */}
              <div className="crafto-subject-card card-biology">
                <div className="crafto-subject-header">
                  <div className="crafto-subject-icon-box" style={{ backgroundColor: "#28B67A" }}>
                    <Microscope size={28} color="#FFFFFF" />
                  </div>
                  <span className="crafto-subject-grade-pill">Classes 6–10</span>
                </div>
                <h3 className="crafto-subject-name">Biology</h3>
                <p className="crafto-subject-desc">
                  Explore cells, plants, the human body and living organisms with optical microscope exploration.
                </p>
                <ul className="crafto-subject-topic-list">
                  <li><CheckCircle2 size={14} color="#28B67A" /> Onion Peel Plant Cell Microscope</li>
                  <li><CheckCircle2 size={14} color="#28B67A" /> Nucleus, Cell Wall & Chloroplasts</li>
                  <li><CheckCircle2 size={14} color="#28B67A" /> Nutrition in Plants & Human Systems</li>
                </ul>
                <div className="crafto-subject-footer">
                  <Link to="/login" className="crafto-subject-explore-btn">
                    <span>Explore Biology</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="crafto-subjects-cta-bar">
              <p>Sign in with your student account to access full chapters, interactive experiments, and quizzes.</p>
              <Link to="/login" className="crafto-btn crafto-btn-primary">
                Student Sign In <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6 — HOW EDUSPARK WORKS
        ========================================================================= */}
        <section className="crafto-how-it-works-sec" id="how-it-works">
          <div className="crafto-container">
            <div className="crafto-sec-header text-center">
              <div className="crafto-badge">
                <span className="crafto-badge-dot"></span>
                <span>LEARNING JOURNEY</span>
              </div>
              <h2 className="crafto-sec-title">
                {t("landing_how_title", "How EduSpark Works.")}
              </h2>
              <p className="crafto-sec-desc">
                {t("landing_how_desc", "A simple, guided path from registration to concept mastery.")}
              </p>
            </div>

            <div className="crafto-steps-grid">
              {/* Step 1 */}
              <div className="crafto-step-card">
                <div className="crafto-step-number">01</div>
                <h4>Create Account</h4>
                <p>Register as a student in seconds with your name, grade, and preferred language.</p>
              </div>

              {/* Step 2 */}
              <div className="crafto-step-card">
                <div className="crafto-step-number">02</div>
                <h4>Select Grade</h4>
                <p>Choose your curriculum level from Class 6 to Class 10 to see aligned chapters.</p>
              </div>

              {/* Step 3 */}
              <div className="crafto-step-card">
                <div className="crafto-step-number">03</div>
                <h4>Choose Subject</h4>
                <p>Pick from Mathematics, Physics, Chemistry, or Biology from your personalized dashboard.</p>
              </div>

              {/* Step 4 */}
              <div className="crafto-step-card">
                <div className="crafto-step-number">04</div>
                <h4>Explore Lab</h4>
                <p>Interact with 3D virtual apparatus, circuits, or microscope slides step-by-step.</p>
              </div>

              {/* Step 5 */}
              <div className="crafto-step-card">
                <div className="crafto-step-number">05</div>
                <h4>Take Quiz</h4>
                <p>Complete topic assessments with immediate explanations for every correct and wrong answer.</p>
              </div>

              {/* Step 6 */}
              <div className="crafto-step-card">
                <div className="crafto-step-number">06</div>
                <h4>Track Progress</h4>
                <p>Review completed experiments, quiz averages, and subject mastery on your dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7 — VIRTUAL LAB SHOWCASE
        ========================================================================= */}
        <section className="crafto-lab-showcase-sec" id="virtual-lab">
          <div className="crafto-container">
            <div className="crafto-lab-showcase-card">
              <div className="crafto-lab-showcase-grid">
                {/* Showcase Text */}
                <div className="crafto-lab-showcase-content">
                  <div className="crafto-badge crafto-badge-dark">
                    <span className="crafto-badge-dot"></span>
                    <span>LIVE 3D SIMULATION</span>
                  </div>

                  <h2>{t("landing_lab_title", "Interactive 3D Virtual Chemistry Lab")}</h2>

                  <p className="crafto-lab-lead">
                    {t(
                      "landing_lab_desc",
                      "Experience our implemented 3D virtual filtration experiment. Select laboratory equipment, assemble the filtration stand, and separate insoluble sand from water in real time."
                    )}
                  </p>

                  <div className="crafto-lab-workflow-list">
                    <div className="crafto-workflow-step">
                      <span className="step-bullet">1</span>
                      <div>
                        <strong>Select Apparatus:</strong>
                        <span>Pick beakers, filter funnels, and graduated cylinders from the 3D room.</span>
                      </div>
                    </div>

                    <div className="crafto-workflow-step">
                      <span className="step-bullet">2</span>
                      <div>
                        <strong>Follow Guided Instructions:</strong>
                        <span>Receive real-time instructions that guide each action safely and clearly.</span>
                      </div>
                    </div>

                    <div className="crafto-workflow-step">
                      <span className="step-bullet">3</span>
                      <div>
                        <strong>Perform Simulation:</strong>
                        <span>Pour the mixture and watch physics-based particle separation unfold.</span>
                      </div>
                    </div>

                    <div className="crafto-workflow-step">
                      <span className="step-bullet">4</span>
                      <div>
                        <strong>Scientific Observations:</strong>
                        <span>Understand how insoluble residue stays on filter paper while clear filtrate collects below.</span>
                      </div>
                    </div>
                  </div>

                  <div className="crafto-lab-actions">
                    <Link to="/chemistry-lab" className="crafto-btn crafto-btn-primary">
                      Launch 3D Chemistry Lab <ArrowRight size={16} />
                    </Link>
                  </div>

                  <small className="crafto-lab-disclaimer">
                    * Chemistry filtration is fully live in 3D. Physics circuits, Biology cells, and Math polyhedrons feature interactive modules.
                  </small>
                </div>

                {/* Showcase Visual */}
                <div className="crafto-lab-showcase-visual">
                  <div className="crafto-lab-mockup-frame">
                    <img
                      src="/crafto/demo-elearning-08-600x430.jpg"
                      alt="3D Chemistry Laboratory Simulation"
                      className="crafto-lab-preview-img"
                      loading="lazy"
                    />
                    <div className="crafto-lab-live-badge">
                      <span className="live-dot"></span> 3D WebGL Engine Active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8 — LEARNING ACCESSIBILITY & OFFLINE
        ========================================================================= */}
        <section className="crafto-accessibility-sec" id="accessibility">
          <div className="crafto-container">
            <div className="crafto-sec-header text-center">
              <div className="crafto-badge crafto-badge-dark">
                <span className="crafto-badge-dot"></span>
                <span>INCLUSIVE ACCESS</span>
              </div>
              <h2 className="crafto-sec-title">
                STEM Learning for <span>Every Student, Anywhere.</span>
              </h2>
              <p className="crafto-sec-desc">
                EduSpark is engineered to work reliably in classrooms with intermittent internet or low-spec computers.
              </p>
            </div>

            <div className="crafto-access-grid">
              <div className="crafto-access-card">
                <div className="crafto-access-icon">
                  <Laptop size={24} color="#D5D52B" />
                </div>
                <h4>Optimized for Modest Devices</h4>
                <p>
                  High-performance 3D graphics with intelligent device-pixel-ratio scaling run smoothly on rural school computers and budget tablets.
                </p>
              </div>

              <div className="crafto-access-card">
                <div className="crafto-access-icon">
                  <Globe2 size={24} color="#D5D52B" />
                </div>
                <h4>Progressive Offline Foundation</h4>
                <p>
                  PWA app-shell and local state caching are established. An initial internet connection is currently required to fetch dynamic 3D WebGL laboratory chunks.
                </p>
              </div>

              <div className="crafto-access-card">
                <div className="crafto-access-icon">
                  <Accessibility size={24} color="#D5D52B" />
                </div>
                <h4>Accessibility-First Standards</h4>
                <p>
                  Built with skip-to-content keyboard shortcuts, high-contrast focus rings, and vestibular-safe reduced motion options.
                </p>
              </div>
            </div>

            <div className="crafto-access-transparency-box">
              <HelpCircle size={20} color="#D5D52B" />
              <span>
                <strong>Accurate Capabilities:</strong> Static pages, 2D lessons, and cached concepts run locally once loaded. Initial access to 3D WebGL experiments, live AI Doubt Assistance, and Supabase cloud synchronization require an active internet connection. Complete offline 3D laboratory precaching is scheduled for Phase 7.
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9 — FINAL CALL TO ACTION
        ========================================================================= */}
        <section className="crafto-final-cta-sec">
          <div className="crafto-container">
            <div className="crafto-final-cta-inner">
              <div className="crafto-final-cta-content">
                <div className="crafto-badge">
                  <span className="crafto-badge-dot"></span>
                  <span>GET STARTED TODAY</span>
                </div>
                <h2>{t("landing_cta_title", "Your Journey Into STEM Starts Here.")}</h2>
                <p>
                  {t(
                    "landing_cta_desc",
                    "Join school students discovering the wonders of Mathematics, Physics, Chemistry, and Biology through interactive digital exploration."
                  )}
                </p>
              </div>

              <div className="crafto-final-cta-actions">
                <Link to="/register" className="crafto-btn crafto-btn-primary">
                  Register Now <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="crafto-btn crafto-btn-outline-white">
                  Student Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          SECTION 10 — FOOTER
      ========================================================================= */}
      <footer className="crafto-footer">
        <div className="crafto-container">
          <div className="crafto-footer-grid">
            {/* Col 1: Platform Overview */}
            <div className="crafto-footer-col">
              <Link to="/" className="crafto-brand-logo footer-brand" aria-label="EduSpark Home">
                <div className="crafto-brand-icon">
                  <Atom size={22} />
                </div>
                <div className="crafto-brand-text">
                  <span className="crafto-brand-title light">
                    Edu<strong>Spark</strong>
                  </span>
                  <span className="crafto-brand-subtitle">STEM LABORATORY</span>
                </div>
              </Link>

              <p className="crafto-footer-desc">
                EduSpark is an interactive STEM education platform for school students in Classes 6–10,
                bridging the gap to quality practical science through virtual laboratories and guided simulations.
              </p>

              <div className="crafto-footer-badges">
                <span className="footer-mini-badge">Classes 6–10</span>
                <span className="footer-mini-badge">Free Education</span>
                <span className="footer-mini-badge">Interactive 3D</span>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="crafto-footer-col">
              <h4>Navigation</h4>
              <ul className="crafto-footer-links">
                <li><button type="button" onClick={() => scrollToSection("home")} className="crafto-footer-btn-link">Home</button></li>
                <li><button type="button" onClick={() => scrollToSection("about")} className="crafto-footer-btn-link">About EduSpark</button></li>
                <li><button type="button" onClick={() => scrollToSection("features")} className="crafto-footer-btn-link">Learning Features</button></li>
                <li><button type="button" onClick={() => scrollToSection("subjects")} className="crafto-footer-btn-link">STEM Subjects</button></li>
                <li><button type="button" onClick={() => scrollToSection("how-it-works")} className="crafto-footer-btn-link">How It Works</button></li>
                <li><button type="button" onClick={() => scrollToSection("virtual-lab")} className="crafto-footer-btn-link">Virtual 3D Lab</button></li>
              </ul>
            </div>

            {/* Col 3: Core Subjects */}
            <div className="crafto-footer-col">
              <h4>STEM Subjects</h4>
              <ul className="crafto-footer-links">
                <li><Link to="/login" className="crafto-footer-link">Mathematics (Classes 6–10)</Link></li>
                <li><Link to="/login" className="crafto-footer-link">Physics (Classes 6–10)</Link></li>
                <li><Link to="/login" className="crafto-footer-link">Chemistry (Classes 6–10)</Link></li>
                <li><Link to="/login" className="crafto-footer-link">Biology (Classes 6–10)</Link></li>
                <li><Link to="/chemistry-lab" className="crafto-footer-link highlight">⚡ 3D Chemistry Lab</Link></li>
              </ul>
            </div>

            {/* Col 4: Student Portal */}
            <div className="crafto-footer-col">
              <h4>Student Portal</h4>
              <ul className="crafto-footer-links">
                <li><Link to="/login" className="crafto-footer-link">Student Login</Link></li>
                <li><Link to="/register" className="crafto-footer-link">Create Account</Link></li>
                <li><Link to="/dashboard" className="crafto-footer-link">Student Dashboard</Link></li>
                <li><Link to="/quiz" className="crafto-footer-link">STEM Quizzes</Link></li>
              </ul>

              <div className="crafto-footer-lang-wrap">
                <span className="lang-prompt">Language:</span>
                <LanguageSwitcher compact />
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="crafto-footer-bottom">
            <p>© 2026 EduSpark. Explore. Experiment. Experience Science. Built for curious young scientists.</p>
            <div className="crafto-footer-bottom-links">
              <span>Classes 6–10 Interactive STEM Platform</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          className="crafto-scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}

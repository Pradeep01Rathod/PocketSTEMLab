// =============================================================================
// EDUSPARK MULTILINGUAL TRANSLATION REGISTRY
// Supports: English (en), Kannada (kn), Hindi (hi)
// Designed for Classes 6-10 students with accurate scientific terminology
// =============================================================================

export const AVAILABLE_LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "kn", label: "Kannada", native: "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1" }, // ಕನ್ನಡ
  { code: "hi", label: "Hindi", native: "\u0939\u093F\u0928\u094D\u0926\u0940" }, // हिन्दी
];

export const translations = {
  en: {
    // Navigation & Global Header
    nav_home: "Home",
    nav_dashboard: "Dashboard",
    nav_subjects: "Subjects",
    nav_lab: "3D Chemistry Lab",
    nav_progress: "My Progress",
    nav_doubts: "AI Doubts",
    nav_login: "Student Login",
    nav_register: "Register",
    nav_logout: "Logout",
    nav_back: "Back",
    nav_back_dashboard: "Back to Dashboard",
    nav_back_subjects: "Back to all subjects",

    // General App Branding & Metadata
    brand_name: "EduSpark",
    brand_tagline: "Interactive STEM Education for Curious Minds",
    student_dashboard: "STUDENT DASHBOARD",
    active_learner: "Active Learner",
    enrolled_class: "Enrolled",
    medium_lang: "Language",

    // Dashboard Sections
    dash_welcome: "Welcome back",
    dash_welcome_sub:
      "Explore interactive 3D laboratories, build simulated electrical circuits, discover plant cell structures, and master spatial mathematics at your own pace.",
    dash_cta_launch_lab: "Launch 3D Lab",
    dash_cta_choose_subject: "Choose Subject",
    dash_stat_experiments: "Experiments Completed",
    dash_stat_quizzes: "Quizzes Completed",
    dash_stat_average_score: "Average Quiz Score",
    dash_stat_subjects: "Core STEM Subjects",
    dash_continue_title: "Continue Learning",
    dash_recent_activity: "Recent Learning Activity",
    dash_recommended: "Recommended For You",
    dash_empty_recent: "No activity recorded yet.",
    dash_empty_recent_sub: "Choose a subject above to complete your first experiment!",
    dash_subject_mastery: "Subject Mastery",
    dash_select_grade: "Select Grade",

    // Core Subjects
    subj_math: "Mathematics",
    subj_math_desc: "Numbers, geometry, spatial polyhedrons, and measurement.",
    subj_physics: "Physics",
    subj_physics_desc: "Circuits, forces, energy, light, and motion.",
    subj_chemistry: "Chemistry",
    subj_chemistry_desc: "Matter, acids and bases, molecular bonding, and separation techniques.",
    subj_biology: "Biology",
    subj_biology_desc: "Cells, organisms, plant anatomy, and ecosystems.",
    subj_explore_btn: "Explore Subject",

    // Common Actions
    btn_start_activity: "Start Activity",
    btn_enter_lab: "Enter 3D Lab",
    btn_take_quiz: "Take Quiz",
    btn_review: "Review Activity",
    btn_submit: "Submit",
    btn_submitting: "Submitting...",
    btn_try_again: "Try Again",
    btn_next_question: "Next Question",
    btn_finish_quiz: "Finish Quiz",
    btn_reset: "Reset",
    btn_close: "Close",
    btn_ask_ai: "Ask Question",

    // Offline & Connectivity
    offline_status_online: "Online & Synced",
    offline_status_offline: "Offline Mode",
    offline_banner_title: "You are currently offline",
    offline_banner_desc:
      "Interactive 3D laboratories, physics simulations, and cached quizzes work without internet. Progress will be safely stored and synced automatically when you reconnect.",
    offline_ai_notice: "Note: AI Doubt Assistant and live cloud backup require an active internet connection.",
    offline_sync_pending: "Offline activities queued for synchronization",
    offline_syncing: "Syncing offline progress with EduSpark Cloud...",
    offline_sync_success: "Offline activities successfully synchronized!",

    // Quiz Experience
    quiz_title: "STEM Concept Quiz",
    quiz_progress: "Question",
    quiz_of: "of",
    quiz_explanation: "Scientific Explanation",
    quiz_summary_title: "Quiz Completed!",
    quiz_score: "Your Score",
    quiz_review_title: "Answer Review",
    quiz_saved_online: "Progress saved to your EduSpark profile!",
    quiz_saved_offline: "Saved to offline storage! Will sync when reconnected.",

    // Laboratory Controls
    lab_instructions: "Step Instructions",
    lab_step: "Step",
    lab_materials: "Required Equipment",
    lab_safety: "Safety First",
    lab_completed_title: "Experiment Completed!",
    lab_science_concept: "Scientific Concept",
    lab_observations: "Observations",
    lab_congratulations: "Great job! You have successfully performed this scientific experiment.",

    // Landing Page Sections
    landing_nav_about: "About",
    landing_nav_features: "Features",
    landing_nav_how_it_works: "How It Works",
    landing_nav_virtual_lab: "Virtual Lab",
    landing_nav_accessibility: "Accessibility",
    landing_hero_badge: "Explore. Experiment. Experience Science.",
    landing_hero_title: "Discover STEM Through Interactive Learning.",
    landing_hero_desc: "Explore Mathematics, Physics, Chemistry and Biology through engaging lessons, interactive activities and virtual science experiments.",
    landing_btn_start: "Start Learning",
    landing_btn_explore_subjects: "Explore Subjects",
    landing_btn_try_lab: "Try 3D Filtration Lab",
    landing_about_title: "Learning Beyond the Classroom.",
    landing_about_desc: "EduSpark bridges the gap between textbook theory and practical scientific understanding for school students in Classes 6–10, especially in rural and underserved communities where physical laboratory apparatus may be limited.",
    landing_features_title: "Engineered for Curious Minds.",
    landing_features_desc: "Everything young scientists need to understand core STEM principles through practice.",
    landing_how_title: "How EduSpark Works.",
    landing_how_desc: "A simple, guided path from registration to concept mastery.",
    landing_lab_title: "Interactive 3D Virtual Chemistry Lab",
    landing_lab_desc: "Experience our implemented 3D virtual filtration experiment. Select laboratory equipment, assemble the filtration stand, and separate insoluble sand from water in real time.",
    landing_cta_title: "Your Journey Into STEM Starts Here.",
    landing_cta_desc: "Join school students discovering the wonders of Mathematics, Physics, Chemistry, and Biology through interactive digital exploration."
  },

  kn: {
    // Navigation & Global Header
    nav_home: "ಮುಖಪುಟ",
    nav_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    nav_subjects: "ವಿಷಯಗಳು",
    nav_lab: "3D ರಸಾಯನಶಾಸ್ತ್ರ ಲ್ಯಾಬ್",
    nav_progress: "ನನ್ನ ಪ್ರಗತಿ",
    nav_doubts: "AI ಸಂಶಯ ಪರಿಹಾರ",
    nav_login: "ವಿದ್ಯಾರ್ಥಿ ಲಾಗಿನ್",
    nav_register: "ನೋಂದಣಿ",
    nav_logout: "ಲಾಗ್ ಔಟ್",
    nav_back: "ಹಿಂದಕ್ಕೆ",
    nav_back_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    nav_back_subjects: "ಎಲ್ಲಾ ವಿಷಯಗಳಿಗೆ ಹಿಂತಿರುಗಿ",

    // General App Branding & Metadata
    brand_name: "EduSpark",
    brand_tagline: "ಕಲಿಕಾರ್ಥಿಗಳಿಗಾಗಿ ಸಂವಾದಾತ್ಮಕ ವಿಜ್ಞಾನ ಮತ್ತು ಗಣಿತ ವೇದಿಕೆ",
    student_dashboard: "ವಿದ್ಯಾರ್ಥಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    active_learner: "ಸಕ್ರಿಯ ಕಲಿಯುವವರು",
    enrolled_class: "ತರಗತಿ",
    medium_lang: "ಭಾಷೆ",

    // Dashboard Sections
    dash_welcome: "ಮರಳಿ ಸ್ವಾಗತ",
    dash_welcome_sub:
      "ಸಂವಾದಾತ್ಮಕ 3D ಪ್ರಯೋಗಾಲಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ, ವಿದ್ಯುತ್ ಮಂಡಲಗಳನ್ನು ನಿರ್ಮಿಸಿ, ಸಸ್ಯ ಜೀವಕೋಶ ರಚನೆಯನ್ನು ತಿಳಿಯಿರಿ ಮತ್ತು ಗಣಿತ ಪರಿಕಲ್ಪನೆಗಳನ್ನು ಸುಲಭವಾಗಿ ಕಲಿಯಿರಿ.",
    dash_cta_launch_lab: "3D ಲ್ಯಾಬ್ ಪ್ರಾರಂಭಿಸಿ",
    dash_cta_choose_subject: "ವಿಷಯ ಆಯ್ಕೆಮಾಡಿ",
    dash_stat_experiments: "ಪೂರ್ಣಗೊಂಡ ಪ್ರಯೋಗಗಳು",
    dash_stat_quizzes: "ಪೂರ್ಣಗೊಂಡ ರಸಪ್ರಶ್ನೆಗಳು",
    dash_stat_average_score: "ಸರಾಸರಿ ಅಂಕ",
    dash_stat_subjects: "ಮುಖ್ಯ STEM ವಿಷಯಗಳು",
    dash_continue_title: "ಕಲಿಕೆ ಮುಂದುವರಿಸಿ",
    dash_recent_activity: "ಇತ್ತೀಚಿನ ಕಲಿಕಾ ಚಟುವಟಿಕೆ",
    dash_recommended: "ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
    dash_empty_recent: "ಇನ್ನೂ ಯಾವುದೇ ಚಟುವಟಿಕೆ ದಾಖಲಾಗಿಲ್ಲ.",
    dash_empty_recent_sub: "ನಿಮ್ಮ ಮೊದಲ ಪ್ರಯೋಗವನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ಮೇಲಿನ ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ!",
    dash_subject_mastery: "ವಿಷಯ ಪ್ರಾವೀಣ್ಯತೆ",
    dash_select_grade: "ತರಗತಿ ಆಯ್ಕೆಮಾಡಿ",

    // Core Subjects
    subj_math: "ಗಣಿತಶಾಸ್ತ್ರ",
    subj_math_desc: "ಸಂಖ್ಯಾ ವ್ಯವಸ್ಥೆ, ಜ್ಯಾಮಿತಿ, 3D ಆಕಾರಗಳು ಮತ್ತು ಮಾಪನಗಳು.",
    subj_physics: "ಭೌತಶಾಸ್ತ್ರ",
    subj_physics_desc: "ವಿದ್ಯುತ್ ಮಂಡಲಗಳು, ಬಲ, ಚಲನೆ, ಶಕ್ತಿ ಮತ್ತು ಬೆಳಕು.",
    subj_chemistry: "ರಸಾಯನಶಾಸ್ತ್ರ",
    subj_chemistry_desc: "ದ್ರವ್ಯ, ಆಮ್ಲಗಳು ಮತ್ತು ಪ್ರತ್ಯಾಮ್ಲಗಳು, ಶೋಧನೆ ಮತ್ತು ಮಿಶ್ರಣಗಳ ಪ್ರತ್ಯೇಕತೆ.",
    subj_biology: "ಜೀವಶಾಸ್ತ್ರ",
    subj_biology_desc: "ಜೀವಕೋಶಗಳು, ಸಸ್ಯ ರಚನೆ, ಜೀವಿಗಳು ಮತ್ತು ಪರಿಸರ ವ್ಯವಸ್ಥೆ.",
    subj_explore_btn: "ವಿಷಯ ಅನ್ವೇಷಿಸಿ",

    // Common Actions
    btn_start_activity: "ಚಟುವಟಿಕೆ ಪ್ರಾರಂಭಿಸಿ",
    btn_enter_lab: "3D ಲ್ಯಾಬ್ ಪ್ರವೇಶಿಸಿ",
    btn_take_quiz: "ರಸಪ್ರಶ್ನೆ ತೆಗೆದುಕೊಳ್ಳಿ",
    btn_review: "ಚಟುವಟಿಕೆ ಪರಿಶೀಲಿಸಿ",
    btn_submit: "ಸಲ್ಲಿಸಿ",
    btn_submitting: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
    btn_try_again: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    btn_next_question: "ಮುಂದಿನ ಪ್ರಶ್ನೆ",
    btn_finish_quiz: "ರಸಪ್ರಶ್ನೆ ಮುಗಿಸಿ",
    btn_reset: "ಮರುಹೊಂದಿಸಿ",
    btn_close: "ಮುಚ್ಚಿ",
    btn_ask_ai: "ಪ್ರಶ್ನೆ ಕೇಳಿ",

    // Offline & Connectivity
    offline_status_online: "ಆನ್‌ಲೈನ್ & ಸಿಂಕ್ ಆಗಿದೆ",
    offline_status_offline: "ಆಫ್‌ಲೈನ್ ಮೋಡ್",
    offline_banner_title: "ನೀವು ಪ್ರಸ್ತುತ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ",
    offline_banner_desc:
      "ಸಂವಾದಾತ್ಮಕ 3D ಪ್ರಯೋಗಾಲಯಗಳು ಮತ್ತು ರಸಪ್ರಶ್ನೆಗಳು ಇಂಟರ್ನೆಟ್ ಇಲ್ಲದೆಯೂ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ. ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಬಂದಾಗ ನಿಮ್ಮ ಪ್ರಗತಿ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಕ್ಲೌಡ್‌ಗೆ ಸಿಂಕ್ ಆಗುತ್ತದೆ.",
    offline_ai_notice: "ಗಮನಿಸಿ: AI ಸಂಶಯ ಪರಿಹಾರ ಮತ್ತು ಕ್ಲೌಡ್ ಬ್ಯಾಕಪ್‌ಗಾಗಿ ಇಂಟರ್ನೆಟ್ ಅಗತ್ಯವಿದೆ.",
    offline_sync_pending: "ಸಿಂಕ್ ಮಾಡಲು ಕಾಯುತ್ತಿರುವ ಆಫ್‌ಲೈನ್ ಚಟುವಟಿಕೆಗಳು",
    offline_syncing: "EduSpark ಕ್ಲೌಡ್‌ನೊಂದಿಗೆ ಸಿಂಕ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    offline_sync_success: "ಆಫ್‌ಲೈನ್ ಚಟುವಟಿಕೆಗಳು ಯಶಸ್ವಿಯಾಗಿ ಸಿಂಕ್ ಆಗಿವೆ!",

    // Quiz Experience
    quiz_title: "STEM ಪರಿಕಲ್ಪನೆ ರಸಪ್ರಶ್ನೆ",
    quiz_progress: "ಪ್ರಶ್ನೆ",
    quiz_of: "/",
    quiz_explanation: "ವೈಜ್ಞಾನಿಕ ವಿವರಣೆ",
    quiz_summary_title: "ರಸಪ್ರಶ್ನೆ ಪೂರ್ಣಗೊಂಡಿದೆ!",
    quiz_score: "ನಿಮ್ಮ ಅಂಕ",
    quiz_review_title: "ಉತ್ತರಗಳ ವಿಮರ್ಶೆ",
    quiz_saved_online: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ಗೆ ಪ್ರಗತಿ ಉಳಿಸಲಾಗಿದೆ!",
    quiz_saved_offline: "ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ! ಇಂಟರ್ನೆಟ್ ಬಂದಾಗ ಸಿಂಕ್ ಆಗುತ್ತದೆ.",

    // Laboratory Controls
    lab_instructions: "ಹಂತದ ಸೂಚನೆಗಳು",
    lab_step: "ಹಂತ",
    lab_materials: "ಅಗತ್ಯವಿರುವ ಸಲಕರಣೆಗಳು",
    lab_safety: "ಸುರಕ್ಷತಾ ಮಾಹಿತಿ",
    lab_completed_title: "ಪ್ರಯೋಗ ಯಶಸ್ವಿಯಾಗಿ ಮುಗಿದಿದೆ!",
    lab_science_concept: "ವೈಜ್ಞಾನಿಕ ಪರಿಕಲ್ಪನೆ",
    lab_observations: "ವೀಕ್ಷಣೆಗಳು",
    lab_congratulations: "ಅಭಿನಂದನೆಗಳು! ನೀವು ಈ ಪ್ರಯೋಗವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ.",

    // Landing Page Sections
    landing_nav_about: "ಕುರಿತು",
    landing_nav_features: "ವೈಶಿಷ್ಟ್ಯಗಳು",
    landing_nav_how_it_works: "ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    landing_nav_virtual_lab: "ವರ್ಚುವಲ್ ಲ್ಯಾಬ್",
    landing_nav_accessibility: "ಪ್ರವೇಶಸಾಧ್ಯತೆ",
    landing_hero_badge: "ಅನ್ವೇಷಿಸಿ. ಪ್ರಯೋಗಿಸಿ. ವಿಜ್ಞಾನ ಅನುಭವಿಸಿ.",
    landing_hero_title: "ಸಂವಾದಾತ್ಮಕ ಕಲಿಕೆಯೊಂದಿಗೆ STEM ಅನ್ವೇಷಿಸಿ.",
    landing_hero_desc: "ಗಣಿತ, ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ ಮತ್ತು ಜೀವಶಾಸ್ತ್ರವನ್ನು ಸಂವಾದಾತ್ಮಕ ಪಾಠಗಳು ಮತ್ತು ವರ್ಚುವಲ್ ಪ್ರಯೋಗಗಳ ಮೂಲಕ ಅನ್ವೇಷಿಸಿ.",
    landing_btn_start: "ಕಲಿಕೆ ಪ್ರಾರಂಭಿಸಿ",
    landing_btn_explore_subjects: "ವಿಷಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    landing_btn_try_lab: "3D ಶೋಧನೆ ಲ್ಯಾಬ್ ಪ್ರಯತ್ನಿಸಿ",
    landing_about_title: "ತರಗತಿಯ ಆಚೆಗಿನ ಕಲಿಕೆ.",
    landing_about_desc: "ಭೌತಿಕ ಪ್ರಯೋಗಾಲಯ ಸಲಕರಣೆಗಳು ಸೀಮಿತವಾಗಿರುವ ಗ್ರಾಮೀಣ ಮತ್ತು ಹಿಂದುಳಿದ ಸಮುದಾಯಗಳ 6-10 ನೇ ತರಗತಿ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಪ್ರಾಯೋಗಿಕ ವಿಜ್ಞಾನ ಕಲಿಕೆಯನ್ನು EduSpark ಸುಲಭಗೊಳಿಸುತ್ತದೆ.",
    landing_features_title: "ಕುತೂಹಲಕಾರಿ ಮನಸ್ಸುಗಳಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ.",
    landing_features_desc: "ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಪ್ರಾಯೋಗಿಕವಾಗಿ STEM ಪರಿಕಲ್ಪನೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಅಗತ್ಯವಿರುವ ಎಲ್ಲವೂ ಇಲ್ಲಿದೆ.",
    landing_how_title: "EduSpark ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.",
    landing_how_desc: "ನೋಂದಣಿಯಿಂದ ಪರಿಕಲ್ಪನೆಯ ಪಾಂಡಿತ್ಯದವರೆಗೆ ಸರಳ ಮತ್ತು ಮಾರ್ಗದರ್ಶಿತ ಹಂತಗಳು.",
    landing_lab_title: "ಸಂವಾದಾತ್ಮಕ 3D ವರ್ಚುವಲ್ ರಸಾಯನಶಾಸ್ತ್ರ ಪ್ರಯೋಗಾಲಯ",
    landing_lab_desc: "ನಮ್ಮ 3D ವರ್ಚುವಲ್ ಶೋಧನೆ ಪ್ರಯೋಗವನ್ನು ಅನುಭವಿಸಿ. ಸಲಕರಣೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ನೀರಿನಿಂದ ಮರಳನ್ನು ಬೇರ್ಪಡಿಸಿ.",
    landing_cta_title: "ನಿಮ್ಮ STEM ಕಲಿಕೆಯ ಪಯಣ ಇಲ್ಲಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ.",
    landing_cta_desc: "ಸಂವಾದಾತ್ಮಕ ಡಿಜಿಟಲ್ ಅನ್ವೇಷಣೆಯ ಮೂಲಕ ವಿಜ್ಞಾನ ಮತ್ತು ಗಣಿತದ ಅದ್ಭುತಗಳನ್ನು ಕಲಿಯಲು ನಮ್ಮೊಂದಿಗೆ ಸೇರಿ."
  },

  hi: {
    // Navigation & Global Header
    nav_home: "होम",
    nav_dashboard: "डैशबोर्ड",
    nav_subjects: "विषय",
    nav_lab: "3D रसायन विज्ञान लैब",
    nav_progress: "मेरी प्रगति",
    nav_doubts: "AI शंका समाधान",
    nav_login: "विद्यार्थी लॉगिन",
    nav_register: "रजिस्टर करें",
    nav_logout: "लॉगआउट",
    nav_back: "वापस",
    nav_back_dashboard: "डैशबोर्ड पर वापस",
    nav_back_subjects: "सभी विषयों पर वापस",

    // General App Branding & Metadata
    brand_name: "EduSpark",
    brand_tagline: "जिज्ञासु विद्यार्थियों के लिए इंटरैक्टिव विज्ञान एवं गणित",
    student_dashboard: "विद्यार्थी डैशबोर्ड",
    active_learner: "सक्रिय शिक्षार्थी",
    enrolled_class: "कक्षा",
    medium_lang: "भाषा",

    // Dashboard Sections
    dash_welcome: "पुनः स्वागत है",
    dash_welcome_sub:
      "इंटरैक्टिव 3D प्रयोगशालाओं का अन्वेषण करें, विद्युत परिपथ बनाएं, पादप कोशिका संरचना समझें और अपनी गति से गणित में महारत हासिल करें।",
    dash_cta_launch_lab: "3D लैब शुरू करें",
    dash_cta_choose_subject: "विषय चुनें",
    dash_stat_experiments: "पूर्ण किए गए प्रयोग",
    dash_stat_quizzes: "पूर्ण की गई प्रश्नोत्तरी",
    dash_stat_average_score: "औसत स्कोर",
    dash_stat_subjects: "प्रमुख STEM विषय",
    dash_continue_title: "सीखना जारी रखें",
    dash_recent_activity: "हाल की शिक्षण गतिविधि",
    dash_recommended: "आपके लिए अनुशंसित",
    dash_empty_recent: "अभी तक कोई गतिविधि दर्ज नहीं है।",
    dash_empty_recent_sub: "अपना पहला प्रयोग पूरा करने के लिए ऊपर दिए गए विषय को चुनें!",
    dash_subject_mastery: "विषय प्रवीणता",
    dash_select_grade: "कक्षा चुनें",

    // Core Subjects
    subj_math: "गणित",
    subj_math_desc: "संख्या पद्धति, ज्यामिति, 3D आकृतियाँ और मापन।",
    subj_physics: "भौतिक विज्ञान",
    subj_physics_desc: "विद्युत परिपथ, बल, गति, ऊर्जा और प्रकाश।",
    subj_chemistry: "रसायन विज्ञान",
    subj_chemistry_desc: "पदार्थ, अम्ल एवं क्षार, निस्यंदन (Filtration) एवं पृथक्करण।",
    subj_biology: "जीव विज्ञान",
    subj_biology_desc: "कोशिका, पादप संरचना, सजीव और पारिस्थितिकी तंत्र।",
    subj_explore_btn: "विषय देखें",

    // Common Actions
    btn_start_activity: "गतिविधि शुरू करें",
    btn_enter_lab: "3D लैब में प्रवेश करें",
    btn_take_quiz: "प्रश्नोत्तरी लें",
    btn_review: "समीक्षा करें",
    btn_submit: "जमा करें",
    btn_submitting: "जमा हो रहा है...",
    btn_try_again: "पुनः प्रयास करें",
    btn_next_question: "अगला प्रश्न",
    btn_finish_quiz: "प्रश्नोत्तरी समाप्त करें",
    btn_reset: "रीसेट करें",
    btn_close: "बंद करें",
    btn_ask_ai: "प्रश्न पूछें",

    // Offline & Connectivity
    offline_status_online: "ऑनलाइन और सिंक",
    offline_status_offline: "ऑफ़लाइन मोड",
    offline_banner_title: "आप वर्तमान में ऑफ़लाइन हैं",
    offline_banner_desc:
      "इंटरैक्टिव 3D प्रयोगशालाएं और प्रश्नोत्तरी बिना इंटरनेट के भी काम करती हैं। इंटरनेट जुड़ने पर आपकी प्रगति स्वतः सिंक हो जाएगी।",
    offline_ai_notice: "सूचना: AI शंका समाधान और क्लाउड बैकअप के लिए इंटरनेट आवश्यक है।",
    offline_sync_pending: "सिंक के लिए प्रतीक्षारत ऑफ़लाइन गतिविधियाँ",
    offline_syncing: "EduSpark क्लाउड के साथ सिंक हो रहा है...",
    offline_sync_success: "ऑफ़लाइन गतिविधियाँ सफलतापूर्वक सिंक हो गईं!",

    // Quiz Experience
    quiz_title: "STEM अवधारणा प्रश्नोत्तरी",
    quiz_progress: "प्रश्न",
    quiz_of: "में से",
    quiz_explanation: "वैज्ञानिक व्याख्या",
    quiz_summary_title: "प्रश्नोत्तरी पूर्ण हुई!",
    quiz_score: "आपका स्कोर",
    quiz_review_title: "उत्तर समीक्षा",
    quiz_saved_online: "आपकी प्रोफ़ाइल में प्रगति सहेज ली गई है!",
    quiz_saved_offline: "ऑफ़लाइन सहेजा गया! इंटरनेट आने पर सिंक होगा।",

    // Laboratory Controls
    lab_instructions: "चरण निर्देश",
    lab_step: "चरण",
    lab_materials: "आवश्यक उपकरण",
    lab_safety: "सुरक्षा निर्देश",
    lab_completed_title: "प्रयोग सफलतापूर्वक संपन्न!",
    lab_science_concept: "वैज्ञानिक अवधारणा",
    lab_observations: "अवलोकन",
    lab_congratulations: "बधाई हो! आपने इस वैज्ञानिक प्रयोग को सफलतापूर्वक पूरा किया।",

    // Landing Page Sections
    landing_nav_about: "परिचय",
    landing_nav_features: "विशेषताएं",
    landing_nav_how_it_works: "यह कैसे काम करता है",
    landing_nav_virtual_lab: "वर्चुअल लैब",
    landing_nav_accessibility: "सुगमता",
    landing_hero_badge: "खोजें। प्रयोग करें। विज्ञान अनुभव करें।",
    landing_hero_title: "इंटरैक्टिव शिक्षण के साथ STEM को जानें।",
    landing_hero_desc: "गणित, भौतिकी, रसायन और जीव विज्ञान को इंटरैक्टिव गतिविधियों और वर्चुअल प्रयोगों के माध्यम से सीखें।",
    landing_btn_start: "सीखना शुरू करें",
    landing_btn_explore_subjects: "विषय देखें",
    landing_btn_try_lab: "3D निस्यंदन लैब देखें",
    landing_about_title: "कक्षा से परे शिक्षण।",
    landing_about_desc: "EduSpark कक्षा 6–10 के विद्यार्थियों के लिए पाठ्यपुस्तक सिद्धांत और व्यावहारिक वैज्ञानिक समझ के बीच की दूरी को मिटाता है।",
    landing_features_title: "जिज्ञासु विद्यार्थियों के लिए निर्मित।",
    landing_features_desc: "अभ्यास के माध्यम से विज्ञान और गणित के सिद्धांतों को समझने के लिए सब कुछ।",
    landing_how_title: "EduSpark कैसे काम करता है।",
    landing_how_desc: "पंजीकरण से लेकर विषय में महारत हासिल करने तक का सरल मार्गदर्शन।",
    landing_lab_title: "इंटरैक्टिव 3D वर्चुअल रसायन विज्ञान लैब",
    landing_lab_desc: "हमारे 3D वर्चुअल निस्यंदन प्रयोग का अनुभव करें। प्रयोगशाला उपकरण चुनें और पानी से रेत को अलग करें।",
    landing_cta_title: "आपकी STEM यात्रा यहीं से शुरू होती है।",
    landing_cta_desc: "डिजिटल अन्वेषण के माध्यम से विज्ञान और गणित के चमत्कारों को जानने के लिए जुड़ें।"
  }
};

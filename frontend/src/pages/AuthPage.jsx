
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Atom,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  GraduationCap,
  Globe2,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Zap,
  Shapes,
  Microscope,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "../supabaseClient";
import "./Auth.css";

// Unicode escape for Kannada: ಕನ್ನಡ
const KANNADA = "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1";

/* =========================================================
   HELPER: SAVE OR UPDATE STUDENT PROFILE

   Existing database fields:
   id
   display_name
   student_class
   preferred_language

   Important:
   - Uses async/await correctly.
   - Does not use .catch() directly after upsert().
   - Preserves existing profile details.
   - Checks and reports database errors.
========================================================= */

async function saveStudentProfile({
  user,
  displayName = "",
  studentClass = "",
  preferredLanguage = "",
}) {
  if (!user?.id) {
    throw new Error("Authenticated student ID is missing.");
  }

  // First check whether the student already has a profile.
  const {
    data: existingProfile,
    error: fetchError,
  } = await supabase
    .from("student_profiles")
    .select("id, display_name, student_class, preferred_language")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  const metadata = user.user_metadata || {};

  // Prefer submitted registration details.
  // Otherwise preserve the existing profile.
  // Finally use the original signup metadata.
  const resolvedName =
    displayName.trim() ||
    existingProfile?.display_name ||
    metadata.display_name ||
    "";

  const resolvedClass = String(
    studentClass ||
    existingProfile?.student_class ||
    metadata.student_class ||
    ""
  );

  const resolvedLanguage =
    preferredLanguage ||
    existingProfile?.preferred_language ||
    metadata.preferred_language ||
    "en";

  if (!resolvedName) {
    throw new Error(
      "Student name is missing. Please complete your student profile."
    );
  }

  if (!resolvedClass) {
    throw new Error(
      "Student class is missing. Please complete your student profile."
    );
  }

  const profileData = {
    id: user.id,
    display_name: resolvedName,
    student_class: resolvedClass,
    preferred_language: resolvedLanguage,
  };

  // Correct Supabase upsert implementation.
  const { error: profileError } = await supabase
    .from("student_profiles")
    .upsert(profileData, {
      onConflict: "id",
    });

  if (profileError) {
    throw profileError;
  }

  return profileData;
}

/* =========================================================
   AUTH PAGE
========================================================= */

export default function AuthPage({ mode = "login" }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();

  // Form fields
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [studentClass, setStudentClass] = useState("6");
  const [preferredLanguage, setPreferredLanguage] = useState("en");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isResetMode, setIsResetMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* =======================================================
     RESTORE EXISTING SESSION
  ======================================================= */

  useEffect(() => {
    let isMounted = true;

    const checkExistingSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (isMounted && data?.session?.user) {
          navigate("/dashboard", {
            replace: true,
          });
        }
      } catch (error) {
        console.error("Session restoration notice:", {
          code: error?.code,
          message: error?.message,
        });
      }
    };

    checkExistingSession();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  /* =======================================================
     SAFE ERROR MESSAGE HANDLER
  ======================================================= */

  const handleAuthError = (error) => {
    console.error("Authentication failure:", {
      code: error?.code,
      status: error?.status,
      message: error?.message,
    });

    const message = error?.message?.toLowerCase() || "";
    const code = error?.code || "";

    if (
      message.includes("invalid login credentials") ||
      code === "invalid_credentials"
    ) {
      setErrorMessage(
        "Invalid email or password. Please check your credentials and make sure your email is verified if confirmation is required."
      );
    } else if (
      message.includes("email not confirmed") ||
      code === "email_not_confirmed"
    ) {
      setErrorMessage(
        "Your email address has not been confirmed. Please check your inbox."
      );
    } else if (
      code === "over_email_send_rate_limit" ||
      code === "over_request_rate_limit" ||
      error?.status === 429 ||
      message.includes("rate limit")
    ) {
      setErrorMessage(
        "Too many attempts. Please wait a few minutes before trying again."
      );
    } else if (
      code === "user_already_exists" ||
      message.includes("user already registered")
    ) {
      setErrorMessage(
        "An account with this email already exists. Please sign in or use Forgot Password."
      );
    } else if (
      code === "email_address_invalid" ||
      message.includes("email address is invalid")
    ) {
      setErrorMessage("Please enter a valid email address.");
    } else if (code === "23505") {
      setErrorMessage(
        "A profile record already exists. Please try signing in."
      );
    } else if (
      code === "42501" ||
      message.includes("row-level security")
    ) {
      setErrorMessage(
        "Your account was authenticated, but Supabase blocked the student profile save. Please check the student_profiles Row Level Security policies."
      );
    } else {
      setErrorMessage(
        error?.message ||
        "Something went wrong. Please try again."
      );
    }
  };

  /* =======================================================
     MAIN FORM SUBMISSION
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    /* -----------------------------------------------
       EMAIL VALIDATION
    ----------------------------------------------- */

    if (!normalizedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    /* =================================================
       1. PASSWORD RECOVERY
    ================================================= */

    if (isResetMode) {
      setLoading(true);

      try {
        const { error } =
          await supabase.auth.resetPasswordForEmail(
            normalizedEmail,
            {
              redirectTo: `${window.location.origin}/login`,
            }
          );

        if (error) {
          throw error;
        }

        setSuccessMessage(
          "Password reset instructions have been sent. Please check your email inbox."
        );
      } catch (error) {
        handleAuthError(error);
      } finally {
        setLoading(false);
      }

      return;
    }

    /* =================================================
       2. REGISTRATION VALIDATION
    ================================================= */

    if (isRegister) {
      if (!displayName.trim()) {
        setErrorMessage("Please enter your full name.");
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage(
          "The passwords do not match. Please try again."
        );
        return;
      }
    }

    if (!password || password.length < 6) {
      setErrorMessage(
        "Password must contain at least 6 characters."
      );
      return;
    }

    setLoading(true);

    /* =================================================
       3. REGISTRATION
    ================================================= */

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,

          // Never trim or modify the password.
          password,

          options: {
            data: {
              display_name: displayName.trim(),
              student_class: studentClass,
              preferred_language: preferredLanguage,
            },

            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

        if (error) {
          throw error;
        }

        /* -------------------------------------------
           CASE A: SUPABASE RETURNS AN ACTIVE SESSION
           (Confirm email disabled)
        ------------------------------------------- */

        if (data?.session?.user) {
          try {
            await saveStudentProfile({
              user: data.session.user,
              displayName,
              studentClass,
              preferredLanguage,
            });
          } catch (profileError) {
            console.error("Student profile save failure:", {
              code: profileError?.code,
              message: profileError?.message,
              status: profileError?.status,
            });

            setErrorMessage(
              `Your authentication account was created, but your student profile could not be saved. ${profileError.message || "Please check your Supabase permissions."} Do not register again.`
            );

            return;
          }

          setSuccessMessage(
            "Your EduSpark account was created successfully!"
          );

          navigate("/dashboard", {
            replace: true,
          });

          return;
        }

        /* -------------------------------------------
           CASE B: USER EXISTS BUT NO ACTIVE SESSION
           (Email confirmation required)
        ------------------------------------------- */

        if (data?.user && !data?.session) {
          setSuccessMessage(
            "Your account registration was accepted, but no active session was issued. If email confirmation is enabled, check your inbox and verify your address before signing in."
          );

          return;
        }

        throw new Error(
          "Registration did not return a student account. Please try again."
        );
      }

      /* =================================================
         4. LOGIN
      ================================================= */

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,

          // Password is passed exactly as entered.
          password,
        });

      if (error) {
        throw error;
      }

      const authenticatedUser =
        data?.user || data?.session?.user;

      if (!authenticatedUser) {
        throw new Error(
          "Supabase did not return an authenticated student account."
        );
      }

      /* -----------------------------------------------
         5. SYNCHRONIZE STUDENT PROFILE

         Existing profile details are preserved.

         If a profile does not exist, original signup
         metadata is used to create it.
      ----------------------------------------------- */

      try {
        await saveStudentProfile({
          user: authenticatedUser,
        });
      } catch (profileError) {
        console.error("Student profile synchronization failure:", {
          code: profileError?.code,
          message: profileError?.message,
          status: profileError?.status,
        });

        setErrorMessage(
          `Login succeeded, but your student profile could not be saved. ${profileError.message || "Please check your student_profiles table permissions."}`
        );

        return;
      }

      /* -----------------------------------------------
         6. SUCCESSFUL LOGIN
      ----------------------------------------------- */

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="auth-split-wrapper">

      {/* =====================================================
          LEFT PANEL — BLUE/INDIGO STEM COMPOSITION
      ===================================================== */}

      <aside
        className="auth-split-left"
        aria-label="EduSpark Portal Overview"
      >
        <div
          className="auth-geo-glow glow-1"
          aria-hidden="true"
        />

        <div
          className="auth-geo-glow glow-2"
          aria-hidden="true"
        />

        <div
          className="auth-geo-pattern"
          aria-hidden="true"
        />

        <div className="auth-left-content">

          {/* Brand and Home Link */}

          <div className="auth-left-top">

            <Link
              to="/"
              className="auth-brand"
              aria-label="EduSpark Home"
            >
              <div className="auth-brand-badge">
                <Atom size={24} />
              </div>

              <div className="auth-brand-text">
                <span className="auth-brand-title">
                  Edu<strong>Spark</strong>
                </span>

                <span className="auth-brand-subtitle">
                  STEM LABORATORY
                </span>
              </div>
            </Link>

            <Link
              to="/"
              className="auth-back-link"
              title="Return to home page"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>

          </div>

          {/* Main Heading */}

          <div className="auth-hero-block">

            <div className="auth-eyebrow-pill">
              <Sparkles size={13} color="#D5D52B" />
              <span>STUDENT LEARNING PORTAL</span>
            </div>

            <h1 className="auth-left-heading">
              Learn, Grow, <br />
              and <span>Succeed.</span>
            </h1>

            <p className="auth-left-intro">
              Step into your interactive STEM learning space.
              Discover hands-on 3D science laboratories, build
              simulated circuits, explore plant cells, and track
              your progress across Classes 6–10.
            </p>

          </div>

          {/* STEM Feature Cards */}

          <div className="auth-stem-cards-grid">

            <div className="auth-stem-card">
              <div className="auth-stem-icon icon-chem">
                <FlaskConical size={18} />
              </div>

              <div className="auth-stem-info">
                <strong>3D Chemistry Lab</strong>
                <span>
                  Interactive filtration & safe reactions
                </span>
              </div>
            </div>

            <div className="auth-stem-card">
              <div className="auth-stem-icon icon-phys">
                <Zap size={18} />
              </div>

              <div className="auth-stem-info">
                <strong>Physics Simulations</strong>
                <span>
                  Electric circuits, light & force
                </span>
              </div>
            </div>

            <div className="auth-stem-card">
              <div className="auth-stem-icon icon-math">
                <Shapes size={18} />
              </div>

              <div className="auth-stem-info">
                <strong>Spatial Mathematics</strong>
                <span>
                  3D Polyhedrons, geometry & numbers
                </span>
              </div>
            </div>

            <div className="auth-stem-card">
              <div className="auth-stem-icon icon-bio">
                <Microscope size={18} />
              </div>

              <div className="auth-stem-info">
                <strong>Biology Explorer</strong>
                <span>
                  Plant cells & microscope anatomy
                </span>
              </div>
            </div>

          </div>

          {/* Footer */}

          <div className="auth-left-footer">
            <div className="auth-trust-badge">
              <ShieldCheck size={16} color="#D5D52B" />
              <span>
                Free & Safe Learning for School Students · Classes 6–10
              </span>
            </div>
          </div>

        </div>
      </aside>

      {/* =====================================================
          RIGHT PANEL — AUTHENTICATION FORM
      ===================================================== */}

      <main className="auth-split-right">

        <div className="auth-form-container">

          {/* Mobile Logo */}

          <div className="auth-mobile-header">
            <Link
              to="/"
              className="auth-brand mobile"
              aria-label="EduSpark Home"
            >
              <div className="auth-brand-badge">
                <Atom size={22} />
              </div>

              <div className="auth-brand-text">
                <span className="auth-brand-title">
                  Edu<strong>Spark</strong>
                </span>

                <span className="auth-brand-subtitle">
                  STEM LABORATORY
                </span>
              </div>
            </Link>
          </div>

          <div className="auth-card-inner">

            {/* Form Heading */}

            <div className="auth-form-header">

              <h2>
                {isResetMode
                  ? "Reset Password"
                  : isRegister
                  ? "Create Student Account"
                  : "Welcome Back, Learner!"}
              </h2>

              <p>
                {isResetMode
                  ? "Enter your registered email and we'll send you a password recovery link."
                  : isRegister
                  ? "Register free to unlock 3D laboratories, science simulations, and quizzes."
                  : "Log in with your student credentials to continue your learning journey."}
              </p>

            </div>

            {/* Error Message */}

            {errorMessage && (
              <div
                className="auth-alert error"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle
                  size={18}
                  className="alert-icon"
                />

                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}

            {successMessage && (
              <div
                className="auth-alert success"
                role="status"
                aria-live="polite"
              >
                <CheckCircle2
                  size={18}
                  className="alert-icon"
                />

                <span>{successMessage}</span>
              </div>
            )}

            {/* Authentication Form */}

            <form
              className="auth-form-fields"
              onSubmit={handleSubmit}
              noValidate
            >

              {/* Full Name */}

              {isRegister && !isResetMode && (
                <div className="auth-input-group">

                  <label htmlFor="auth-name">
                    Full Name <span className="req">*</span>
                  </label>

                  <div className="input-wrap">
                    <User
                      size={18}
                      className="input-icon"
                    />

                    <input
                      id="auth-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={displayName}
                      onChange={(e) =>
                        setDisplayName(e.target.value)
                      }
                      required
                      maxLength={60}
                      autoComplete="name"
                    />
                  </div>

                </div>
              )}

              {/* Class and Language */}

              {isRegister && !isResetMode && (
                <div className="auth-input-row">

                  <div className="auth-input-group">

                    <label htmlFor="auth-class">
                      Enrolled Class <span className="req">*</span>
                    </label>

                    <div className="input-wrap select-wrap">

                      <GraduationCap
                        size={18}
                        className="input-icon"
                      />

                      <select
                        id="auth-class"
                        value={studentClass}
                        onChange={(e) =>
                          setStudentClass(e.target.value)
                        }
                        required
                      >
                        <option value="6">Class 6</option>
                        <option value="7">Class 7</option>
                        <option value="8">Class 8</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                      </select>

                    </div>
                  </div>

                  <div className="auth-input-group">

                    <label htmlFor="auth-lang">
                      Medium of Study <span className="req">*</span>
                    </label>

                    <div className="input-wrap select-wrap">

                      <Globe2
                        size={18}
                        className="input-icon"
                      />

                      <select
                        id="auth-lang"
                        value={preferredLanguage}
                        onChange={(e) =>
                          setPreferredLanguage(e.target.value)
                        }
                        required
                      >
                        <option value="en">English</option>
                        <option value="kn">{KANNADA}</option>
                        <option value="hi">हिन्दी</option>
                        <option value="ta">தமிழ்</option>
                      </select>

                    </div>
                  </div>

                </div>
              )}

              {/* Email */}

              <div className="auth-input-group">

                <label htmlFor="auth-email">
                  Email Address <span className="req">*</span>
                </label>

                <div className="input-wrap">

                  <Mail
                    size={18}
                    className="input-icon"
                  />

                  <input
                    id="auth-email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />

                </div>
              </div>

              {/* Password */}

              {!isResetMode && (
                <div className="auth-input-group">

                  <div className="label-with-link">

                    <label htmlFor="auth-password">
                      Password <span className="req">*</span>
                    </label>

                    {!isRegister && (
                      <button
                        type="button"
                        className="forgot-password-link"
                        onClick={() => {
                          setIsResetMode(true);
                          setErrorMessage("");
                          setSuccessMessage("");
                        }}
                      >
                        Forgot password?
                      </button>
                    )}

                  </div>

                  <div className="input-wrap">

                    <Lock
                      size={18}
                      className="input-icon"
                    />

                    <input
                      id="auth-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                      minLength={6}
                      autoComplete={
                        isRegister
                          ? "new-password"
                          : "current-password"
                      }
                    />

                    <button
                      type="button"
                      className="pwd-toggle-btn"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword
                        ? <EyeOff size={18} />
                        : <Eye size={18} />}
                    </button>

                  </div>
                </div>
              )}

              {/* Confirm Password */}

              {isRegister && !isResetMode && (
                <div className="auth-input-group">

                  <label htmlFor="auth-confirm-password">
                    Confirm Password <span className="req">*</span>
                  </label>

                  <div className="input-wrap">

                    <Lock
                      size={18}
                      className="input-icon"
                    />

                    <input
                      id="auth-confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      className="pwd-toggle-btn"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword
                        ? <EyeOff size={18} />
                        : <Eye size={18} />}
                    </button>

                  </div>
                </div>
              )}

              {/* Submit Button */}

              <button
                type="submit"
                className="auth-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading-state">
                    <span className="spinner" />
                    Processing...
                  </span>
                ) : isResetMode ? (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight size={17} />
                  </>
                ) : isRegister ? (
                  <>
                    <span>Create Student Account</span>
                    <ArrowRight size={17} />
                  </>
                ) : (
                  <>
                    <span>Sign In to EduSpark</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

            </form>

            {/* Return to Login from Reset Mode */}

            {isResetMode && (
              <div className="auth-switch-box">
                <span>Remember your password? </span>

                <button
                  type="button"
                  className="inline-switch-btn"
                  onClick={() => {
                    setIsResetMode(false);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                >
                  Back to Sign In
                </button>
              </div>
            )}

            {/* Login / Registration Switch */}

            {!isResetMode && (
              <div className="auth-switch-box">

                {isRegister ? (
                  <span>
                    Already have a student account?{" "}

                    <Link
                      to="/login"
                      className="auth-switch-link"
                    >
                      Sign In
                    </Link>
                  </span>
                ) : (
                  <span>
                    New to EduSpark?{" "}

                    <Link
                      to="/register"
                      className="auth-switch-link"
                    >
                      Create an account free
                    </Link>
                  </span>
                )}

              </div>
            )}

            {/* Security Notice */}

            <div className="auth-privacy-notice">
              <span>
                Protected by secure Supabase authentication.
                We never share student information.
              </span>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Auth.css";

function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [studentClass, setStudentClass] = useState("6");
  const [preferredLanguage, setPreferredLanguage] = useState("en");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (isRegister && password !== confirmPassword) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              display_name: displayName.trim(),
              student_class: studentClass,
              preferred_language: preferredLanguage,
            },
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          navigate("/dashboard", { replace: true });
        } else {
          setSuccessMessage(
            "Your account has been created. Please check your email and confirm your account before logging in."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          throw error;
        }

        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-back">
          â† Back to Home
        </Link>

        <div className="auth-heading">
          <div className="auth-logo">âš›</div>

          <p className="auth-eyebrow">EduSpark</p>

          <h1>
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>

          <p>
            {isRegister
              ? "Join the learning and discovery journey."
              : "Log in to continue your learning journey."}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label>
                Display name
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  required
                  maxLength={60}
                />
              </label>

              <div className="auth-form-row">
                <label>
                  Class
                  <select
                    value={studentClass}
                    onChange={(event) => setStudentClass(event.target.value)}
                    required
                  >
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                  </select>
                </label>

                <label>
                  Language
                  <select
                    value={preferredLanguage}
                    onChange={(event) =>
                      setPreferredLanguage(event.target.value)
                    }
                    required
                  >
                    <option value="en">English</option>
                    <option value="kn">à²•à²¨à³à²¨à²¡</option>
                    <option value="hi">à¤¹à¤¿à¤¨à¥à¤¦à¥€</option>
                    <option value="ta">à®¤à®®à®¿à®´à¯</option>
                  </select>
                </label>
              </div>
            </>
          )}

          <label>
            Email address
            <input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </label>

          {isRegister && (
            <label>
              Confirm password
              <input
                type="password"
                placeholder="Enter your password again"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </label>
          )}

          {errorMessage && (
            <p className="auth-message auth-error" role="alert">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="auth-message auth-success" role="status">
              {successMessage}
            </p>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Student Account"
                : "Login"}
          </button>
        </form>

        <div className="auth-switch">
          {isRegister ? (
            <>
              Already have an account? <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              New to EduSpark? <Link to="/register">Create account</Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default AuthPage;




import React, { useState } from "react";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const mode = import.meta.env.VITE_APP_MODE || "dev";

  function validate() {
    if (!email) return "Email is required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Invalid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErr(v);
    if (!v) {
      // demo behaviour: show toast / console log
      console.log("Logging in", { email, password });
      // Replace with your auth call
      alert("(Demo) Logged in as " + email);
    }
  }

  return (
    <div className="login-root">
      <div className="hero">
        <div className="card">
          <div className="brand">
            <div className="logo">QD</div>
            <div className="title">QuestDo</div>
          </div>

          {mode === "demo" && <div className="mode-banner">Demo mode</div>}

          <h2 className="heading">Welcome back</h2>
          <p className="sub">Sign in to continue to your workspace</p>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <label className={`field ${email ? "filled" : ""}`}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setErr("")}
                required
              />
              <span className="label-text">Email</span>
            </label>

            <label className={`field ${password ? "filled" : ""}`}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setErr("")}
                required
              />
              <span className="label-text">Password</span>
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </label>

            {err && <div className="error">{err}</div>}

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
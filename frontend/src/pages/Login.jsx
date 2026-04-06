// ============================================================
// pages/Login.jsx
// ============================================================
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../App";

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      navigate(res.data.user.role === "admin" ? "/admin" : "/employee");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoRow}>
          <span style={s.logoIcon}>⚡</span>
          <span style={s.logoText}>TaskFlow</span>
        </div>

        <h2 style={s.title}>Sign in to your account</h2>
        <p style={s.subtitle}>Welcome back — enter your credentials below</p>

        {error && <div style={s.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
              style={s.input}
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={s.input}
            />
          </div>
          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={s.footer}>
          Don't have an account?{" "}
          <Link to="/register" style={s.link}>Register here</Link>
        </p>

        {/* Admin hint */}
        <div style={s.hint}>
          <strong style={{ color: "#94a3b8" }}>Default Admin Login</strong>
          <br />
          admin@taskmanager.com &nbsp;/&nbsp; admin123
        </div>
      </div>
    </div>
  );
};

const s = {
  page: {
    minHeight: "100vh", background: "#0f172a",
    display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
  },
  card: {
    background: "#1e293b", borderRadius: "16px", padding: "40px",
    width: "100%", maxWidth: "420px", border: "1px solid #334155",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
  },
  logoRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" },
  logoIcon: { fontSize: "28px" },
  logoText: { fontSize: "22px", fontWeight: "800", color: "#f8fafc", letterSpacing: "-0.5px" },
  title:    { color: "#f8fafc", fontSize: "22px", fontWeight: "700", marginBottom: "6px" },
  subtitle: { color: "#64748b", fontSize: "13px", marginBottom: "28px" },
  errorBox: {
    background: "#450a0a", border: "1px solid #7f1d1d", color: "#fca5a5",
    padding: "12px 16px", borderRadius: "8px", fontSize: "13px", marginBottom: "20px",
  },
  form:  { display: "flex", flexDirection: "column", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { color: "#94a3b8", fontSize: "13px", fontWeight: "500" },
  input: {
    padding: "10px 14px", background: "#0f172a", border: "1px solid #334155",
    borderRadius: "8px", color: "#f8fafc", fontSize: "14px", outline: "none",
    transition: "border 0.2s",
  },
  btn: {
    padding: "12px", marginTop: "4px", border: "none", borderRadius: "8px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", fontWeight: "700", fontSize: "15px", cursor: "pointer",
  },
  footer: { textAlign: "center", marginTop: "24px", color: "#64748b", fontSize: "13px" },
  link:   { color: "#818cf8", textDecoration: "none", fontWeight: "600" },
  hint: {
    marginTop: "16px", padding: "12px 14px", background: "#0f172a",
    borderRadius: "8px", color: "#64748b", fontSize: "12px",
    textAlign: "center", border: "1px dashed #334155", lineHeight: "1.7",
  },
};

export default Login;

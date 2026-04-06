// ============================================================
// pages/Register.jsx
// ============================================================
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ name: "", email: "", password: "" });
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const res = await registerUser(form);
      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoRow}>
          <span style={s.logoIcon}>⚡</span>
          <span style={s.logoText}>TaskFlow</span>
        </div>
        <h2 style={s.title}>Create an account</h2>
        <p style={s.subtitle}>
          Register as an employee. Admin approval required before you can log in.
        </p>

        {error   && <div style={s.errorBox}>{error}</div>}
        {success && (
          <div style={s.successBox}>
            ✅ {success}
            <br /><small>Redirecting to login in 3 seconds...</small>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input
                name="name" type="text" value={form.name}
                onChange={handleChange} placeholder="Jane Smith"
                required style={s.input}
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Email address</label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="you@company.com"
                required style={s.input}
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input
                name="password" type="password" value={form.password}
                onChange={handleChange} placeholder="Minimum 6 characters"
                required minLength={6} style={s.input}
              />
            </div>
            <button type="submit" disabled={loading} style={s.btn}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
        )}

        <p style={s.footer}>
          Already registered?{" "}
          <Link to="/login" style={s.link}>Sign in</Link>
        </p>
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
  subtitle: { color: "#64748b", fontSize: "13px", marginBottom: "28px", lineHeight: "1.5" },
  errorBox: {
    background: "#450a0a", border: "1px solid #7f1d1d", color: "#fca5a5",
    padding: "12px 16px", borderRadius: "8px", fontSize: "13px", marginBottom: "20px",
  },
  successBox: {
    background: "#052e16", border: "1px solid #166534", color: "#86efac",
    padding: "14px 16px", borderRadius: "8px", fontSize: "13px",
    marginBottom: "20px", lineHeight: "1.7",
  },
  form:  { display: "flex", flexDirection: "column", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { color: "#94a3b8", fontSize: "13px", fontWeight: "500" },
  input: {
    padding: "10px 14px", background: "#0f172a", border: "1px solid #334155",
    borderRadius: "8px", color: "#f8fafc", fontSize: "14px", outline: "none",
  },
  btn: {
    padding: "12px", marginTop: "4px", border: "none", borderRadius: "8px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff", fontWeight: "700", fontSize: "15px", cursor: "pointer",
  },
  footer: { textAlign: "center", marginTop: "24px", color: "#64748b", fontSize: "13px" },
  link:   { color: "#818cf8", textDecoration: "none", fontWeight: "600" },
};

export default Register;


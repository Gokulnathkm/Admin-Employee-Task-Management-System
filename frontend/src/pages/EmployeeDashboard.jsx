// ============================================================
// pages/EmployeeDashboard.jsx
// ============================================================
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { fetchMyTasks, updateTaskStatus } from "../services/api";

const STATUS_OPTIONS = ["pending", "in-progress", "completed"];
const statusMeta = {
  pending:       { bg: "#422006", color: "#fbbf24", label: "Pending",     dot: "#f59e0b" },
  "in-progress": { bg: "#172554", color: "#60a5fa", label: "In Progress", dot: "#3b82f6" },
  completed:     { bg: "#052e16", color: "#34d399", label: "Completed",   dot: "#10b981" },
};

/* ── Task Card ───────────────────────────────────────────── */
const TaskCard = ({ task, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [flash,    setFlash]    = useState("");
  const sm = statusMeta[task.status] || statusMeta.pending;

  const handleChange = async (e) => {
    setUpdating(true); setFlash("");
    try {
      await onUpdate(task._id, e.target.value);
      setFlash("Updated ✓");
      setTimeout(() => setFlash(""), 2000);
    } catch {
      setFlash("Failed ✗");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={S.card}>
      <div style={S.cardHead}>
        <span style={{ ...S.dot, background: sm.dot }} />
        <h3 style={S.cardTitle}>{task.title}</h3>
        <span style={{ ...S.pill, background: sm.bg, color: sm.color }}>{sm.label}</span>
      </div>
      <p style={S.cardDesc}>{task.description}</p>
      <div style={S.cardFoot}>
        <div style={S.field}>
          <label style={S.label}>Update Status</label>
          <select value={task.status} onChange={handleChange} disabled={updating} style={S.select}>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{statusMeta[opt].label}</option>
            ))}
          </select>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"4px" }}>
          {flash && (
            <span style={{ background:"#052e16", color:"#34d399",
              padding:"2px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:"600" }}>
              {flash}
            </span>
          )}
          <span style={{ color:"#475569", fontSize:"12px" }}>
            {new Date(task.createdAt).toLocaleDateString("en-US",
              { day:"numeric", month:"short", year:"numeric" })}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── Page ────────────────────────────────────────────────── */
const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks,   setTasks]   = useState([]);
  const [filter,  setFilter]  = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTasks()
      .then((r) => setTasks(r.data))
      .catch((e) => console.error("Failed to load tasks", e))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (id, status) => {
    const res = await updateTaskStatus(id, status);
    setTasks((prev) => prev.map((t) => t._id === id ? { ...t, status: res.data.status } : t));
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const counts = {
    all:          tasks.length,
    pending:      tasks.filter((t) => t.status === "pending").length,
    "in-progress":tasks.filter((t) => t.status === "in-progress").length,
    completed:    tasks.filter((t) => t.status === "completed").length,
  };
  const visible = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div style={S.page}>
      {/* ── Navbar ── */}
      <nav style={S.nav}>
        <span style={S.brand}>⚡ TaskFlow</span>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={S.navUser}>
            <span style={{ ...S.badge, background: "#10b981" }}>EMPLOYEE</span>
            {user?.name}
          </span>
          <button onClick={handleLogout} style={S.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={S.container}>
        <div style={S.pageHead}>
          <h1 style={S.heading}>My Tasks</h1>
          <p style={S.sub}>Welcome back, {user?.name} 👋</p>
        </div>

        {/* ── Filter stats ── */}
        <div style={S.statsRow}>
          {[
            { key:"all",          label:"Total",       color:"#818cf8" },
            { key:"pending",      label:"Pending",     color:"#f59e0b" },
            { key:"in-progress",  label:"In Progress", color:"#60a5fa" },
            { key:"completed",    label:"Completed",   color:"#34d399" },
          ].map(({ key, label, color }) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              ...S.statBtn,
              borderColor: filter === key ? color : "#334155",
              background:  filter === key ? color + "18" : "#1e293b",
            }}>
              <span style={{ ...S.statNum, color }}>{counts[key]}</span>
              <span style={S.statLabel}>{label}</span>
            </button>
          ))}
        </div>

        {/* ── Tasks ── */}
        {loading ? (
          <p style={S.empty}>Loading your tasks...</p>
        ) : visible.length === 0 ? (
          <div style={S.emptyState}>
            <div style={{ fontSize: "40px" }}>📭</div>
            <p style={{ color: "#64748b", marginTop: "12px" }}>
              {filter === "all" ? "No tasks assigned yet." : `No ${filter} tasks.`}
            </p>
          </div>
        ) : (
          <div style={S.grid}>
            {visible.map((task) => (
              <TaskCard key={task._id} task={task} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── styles ──────────────────────────────────────────────── */
const S = {
  page: { minHeight: "100vh", background: "#0f172a" },
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "0 24px", height: "60px", background: "#0f172a",
    borderBottom: "1px solid #1e293b", position: "sticky", top: 0, zIndex: 100,
  },
  brand: { color: "#f8fafc", fontWeight: "800", fontSize: "20px", letterSpacing: "-0.5px" },
  navUser: { color: "#94a3b8", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" },
  badge: { padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "700", color: "#fff" },
  logoutBtn: {
    padding: "6px 16px", background: "transparent", border: "1px solid #334155",
    borderRadius: "6px", color: "#94a3b8", cursor: "pointer", fontSize: "13px",
  },
  container: { maxWidth: "860px", margin: "0 auto", padding: "32px 24px" },
  pageHead:  { marginBottom: "28px" },
  heading:   { color: "#f8fafc", fontSize: "26px", fontWeight: "800", margin: 0 },
  sub:       { color: "#64748b", fontSize: "14px", marginTop: "4px" },
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
    gap: "12px", marginBottom: "28px",
  },
  statBtn: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "16px", borderRadius: "12px", border: "1px solid",
    cursor: "pointer", transition: "all 0.2s",
  },
  statNum:   { fontSize: "28px", fontWeight: "800", lineHeight: 1 },
  statLabel: { color: "#64748b", fontSize: "12px", fontWeight: "600", marginTop: "4px" },
  grid:  { display: "flex", flexDirection: "column", gap: "16px" },
  card: {
    background: "#1e293b", border: "1px solid #334155",
    borderRadius: "12px", padding: "20px 24px",
  },
  cardHead: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" },
  dot:  { width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0 },
  cardTitle: { color: "#f1f5f9", fontWeight: "700", fontSize: "16px", margin: 0, flex: 1 },
  pill: { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", flexShrink: 0 },
  cardDesc: { color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", margin: "0 0 16px" },
  cardFoot: {
    display: "flex", alignItems: "flex-end",
    justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
  },
  field:  { display: "flex", flexDirection: "column", gap: "4px" },
  label:  { color: "#64748b", fontSize: "12px", fontWeight: "500" },
  select: {
    padding: "7px 12px", background: "#0f172a", border: "1px solid #334155",
    borderRadius: "7px", color: "#f8fafc", fontSize: "13px",
    cursor: "pointer", outline: "none", fontFamily: "inherit",
  },
  empty: { color: "#64748b", textAlign: "center", padding: "40px" },
  emptyState: {
    textAlign: "center", padding: "60px 24px",
    background: "#1e293b", borderRadius: "12px", border: "1px solid #334155",
  },
};

export default EmployeeDashboard;


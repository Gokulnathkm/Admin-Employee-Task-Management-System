// ============================================================
// pages/AdminDashboard.jsx
// ============================================================
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import {
  fetchEmployees, approveEmployee, declineEmployee,
  assignTask,     fetchAllTasks,
} from "../services/api";

/* ── helpers ─────────────────────────────────────────────── */
const StatusPill = ({ status }) => {
  const map = {
    pending:      { bg: "#422006", color: "#fbbf24", label: "Pending" },
    "in-progress":{ bg: "#172554", color: "#60a5fa", label: "In Progress" },
    completed:    { bg: "#052e16", color: "#34d399", label: "Completed" },
  };
  const st = map[status] || map.pending;
  return (
    <span style={{ background: st.bg, color: st.color,
      padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
      {st.label}
    </span>
  );
};

const TabBtn = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    padding: "8px 20px", border: "none", borderRadius: "8px", cursor: "pointer",
    fontWeight: "600", fontSize: "14px", transition: "all 0.2s",
    background: active ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
    color: active ? "#fff" : "#64748b",
  }}>
    {children}
  </button>
);

/* ── component ───────────────────────────────────────────── */
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("employees");

  const [employees, setEmployees] = useState([]);
  const [tasks,     setTasks]     = useState([]);
  const [busy,      setBusy]      = useState({});          // approve-button loading
  const [pageLoad,  setPageLoad]  = useState(true);

  const [taskForm, setTaskForm] = useState({ title: "", description: "", assignedTo: "" });
  const [taskMsg,  setTaskMsg]  = useState({ text: "", type: "" });

  /* load data */
  useEffect(() => {
    (async () => {
      try {
        const [eRes, tRes] = await Promise.all([fetchEmployees(), fetchAllTasks()]);
        setEmployees(eRes.data);
        setTasks(tRes.data);
      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setPageLoad(false);
      }
    })();
  }, []);

  /* approve */
  const handleApprove = async (id) => {
    setBusy((p) => ({ ...p, [id]: true }));
    try {
      await approveEmployee(id);
      setEmployees((p) => p.map((e) => e._id === id ? { ...e, isApproved: true } : e));
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    } finally {
      setBusy((p) => ({ ...p, [id]: false }));
    }
  };

  /* decline */
  const handleDecline = async (id) => {
    if (!window.confirm("Are you sure you want to decline and remove this user?")) return;
    setBusy((p) => ({ ...p, [id]: true }));
    try {
      await declineEmployee(id);
      setEmployees((p) => p.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Decline failed");
    } finally {
      setBusy((p) => ({ ...p, [id]: false }));
    }
  };

  /* assign task */
  const handleAssign = async (e) => {
    e.preventDefault();
    setTaskMsg({ text: "", type: "" });
    try {
      const res = await assignTask(taskForm);
      setTasks((p) => [res.data, ...p]);
      setTaskMsg({ text: "Task assigned successfully! ✅", type: "success" });
      setTaskForm({ title: "", description: "", assignedTo: "" });
    } catch (err) {
      setTaskMsg({ text: err.response?.data?.message || "Failed to assign task", type: "error" });
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const approved = employees.filter((e) => e.isApproved);
  const pending  = employees.filter((e) => !e.isApproved);

  if (pageLoad) return (
    <div style={{ ...S.page, justifyContent: "center", alignItems: "center" }}>
      <p style={{ color: "#64748b" }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div style={S.page}>
      {/* ── Navbar ── */}
      <nav style={S.nav}>
        <span style={S.brand}>⚡ TaskFlow</span>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={S.navUser}>
            <span style={{ ...S.badge, background: "#6366f1" }}>ADMIN</span>
            {user?.name}
          </span>
          <button onClick={handleLogout} style={S.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={S.container}>
        {/* ── Stats ── */}
        <div style={S.statsRow}>
          {[
            { label: "Total Employees", value: employees.length, color: "#818cf8" },
            { label: "Pending Approval", value: pending.length,  color: "#f59e0b" },
            { label: "Active Employees", value: approved.length, color: "#34d399" },
            { label: "Total Tasks",      value: tasks.length,    color: "#60a5fa" },
          ].map(({ label, value, color }) => (
            <div key={label} style={S.statCard}>
              <div style={{ ...S.statNum, color }}>{value}</div>
              <div style={S.statLabel}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={S.tabBar}>
          <TabBtn active={tab === "employees"} onClick={() => setTab("employees")}>👥 Employees</TabBtn>
          <TabBtn active={tab === "assign"}    onClick={() => setTab("assign")}>➕ Assign Task</TabBtn>
          <TabBtn active={tab === "tasks"}     onClick={() => setTab("tasks")}>📋 All Tasks</TabBtn>
        </div>

        {/* ── EMPLOYEES TAB ── */}
        {tab === "employees" && (
          <>
            {pending.length > 0 && (
              <div style={S.section}>
                <h3 style={S.sTitle}>⏳ Pending Approval ({pending.length})</h3>
                <div style={S.tableWrap}>
                  <table style={S.table}>
                    <thead><tr>
                      {["Name","Email","Registered","Action"].map(h => <th key={h} style={S.th}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {pending.map((emp) => (
                        <tr key={emp._id} style={S.tr}>
                          <td style={S.td}>{emp.name}</td>
                          <td style={S.td}>{emp.email}</td>
                          <td style={S.td}>{new Date(emp.createdAt).toLocaleDateString()}</td>
                          <td style={S.td}>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                onClick={() => handleApprove(emp._id)}
                                disabled={busy[emp._id]}
                                style={S.approveBtn}
                              >
                                {busy[emp._id] ? "Wait..." : "Approve ✓"}
                              </button>
                              <button
                                onClick={() => handleDecline(emp._id)}
                                disabled={busy[emp._id]}
                                style={S.declineBtn}
                              >
                                Decline ✗
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div style={S.section}>
              <h3 style={S.sTitle}>✅ Approved Employees ({approved.length})</h3>
              {approved.length === 0
                ? <p style={S.empty}>No approved employees yet.</p>
                : (
                  <div style={S.tableWrap}>
                    <table style={S.table}>
                      <thead><tr>
                        {["Name","Email","Joined","Status"].map(h => <th key={h} style={S.th}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {approved.map((emp) => (
                          <tr key={emp._id} style={S.tr}>
                            <td style={S.td}>{emp.name}</td>
                            <td style={S.td}>{emp.email}</td>
                            <td style={S.td}>{new Date(emp.createdAt).toLocaleDateString()}</td>
                            <td style={S.td}>
                              <span style={{ color: "#34d399", fontWeight: "600", fontSize: "13px" }}>● Active</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </div>
          </>
        )}

        {/* ── ASSIGN TASK TAB ── */}
        {tab === "assign" && (
          <div style={S.section}>
            <h3 style={S.sTitle}>➕ Assign New Task</h3>
            {taskMsg.text && (
              <div style={taskMsg.type === "success" ? S.successBox : S.errorBox}>
                {taskMsg.text}
              </div>
            )}
            {approved.length === 0
              ? <p style={S.empty}>No approved employees available. Approve employees first.</p>
              : (
                <form onSubmit={handleAssign} style={S.taskForm}>
                  <div style={S.field}>
                    <label style={S.label}>Task Title</label>
                    <input
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      placeholder="e.g. Design the landing page"
                      required style={S.input}
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Description</label>
                    <textarea
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                      placeholder="Describe the task in detail..."
                      required rows={4}
                      style={{ ...S.input, resize: "vertical", fontFamily: "inherit" }}
                    />
                  </div>
                  <div style={S.field}>
                    <label style={S.label}>Assign To</label>
                    <select
                      value={taskForm.assignedTo}
                      onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                      required style={S.input}
                    >
                      <option value="">— Select an employee —</option>
                      {approved.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" style={S.submitBtn}>Assign Task →</button>
                </form>
              )
            }
          </div>
        )}

        {/* ── ALL TASKS TAB ── */}
        {tab === "tasks" && (
          <div style={S.section}>
            <h3 style={S.sTitle}>📋 All Tasks ({tasks.length})</h3>
            {tasks.length === 0
              ? <p style={S.empty}>No tasks assigned yet.</p>
              : (
                <div style={S.tableWrap}>
                  <table style={S.table}>
                    <thead><tr>
                      {["Title","Assigned To","Status","Created"].map(h => <th key={h} style={S.th}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {tasks.map((t) => (
                        <tr key={t._id} style={S.tr}>
                          <td style={S.td}>
                            <div style={{ fontWeight: "600", color: "#f1f5f9" }}>{t.title}</div>
                            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                              {t.description.length > 55 ? t.description.slice(0,55)+"…" : t.description}
                            </div>
                          </td>
                          <td style={S.td}>
                            <div>{t.assignedTo?.name || "—"}</div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>{t.assignedTo?.email}</div>
                          </td>
                          <td style={S.td}><StatusPill status={t.status} /></td>
                          <td style={S.td}>{new Date(t.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
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
  container: { maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" },
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: "16px", marginBottom: "28px",
  },
  statCard: {
    background: "#1e293b", border: "1px solid #334155",
    borderRadius: "12px", padding: "20px 24px",
  },
  statNum:   { fontSize: "32px", fontWeight: "800", lineHeight: 1 },
  statLabel: { color: "#64748b", fontSize: "13px", marginTop: "6px", fontWeight: "500" },
  tabBar: {
    display: "flex", gap: "6px", background: "#1e293b", border: "1px solid #334155",
    borderRadius: "10px", padding: "6px", marginBottom: "24px", width: "fit-content",
  },
  section: {
    background: "#1e293b", border: "1px solid #334155",
    borderRadius: "12px", padding: "24px", marginBottom: "20px",
  },
  sTitle: { color: "#f8fafc", fontSize: "16px", fontWeight: "700", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left", padding: "10px 14px", color: "#64748b",
    fontSize: "12px", fontWeight: "700", textTransform: "uppercase",
    letterSpacing: "0.5px", borderBottom: "1px solid #334155",
  },
  tr: { borderBottom: "1px solid #0f172a" },
  td: { padding: "12px 14px", color: "#cbd5e1", fontSize: "14px", verticalAlign: "top" },
  approveBtn: {
    padding: "6px 14px", background: "linear-gradient(135deg,#10b981,#059669)",
    border: "none", borderRadius: "6px", color: "#fff",
    fontWeight: "600", fontSize: "13px", cursor: "pointer",
  },
  declineBtn: {
    padding: "6px 14px", background: "linear-gradient(135deg,#ef4444,#dc2626)",
    border: "none", borderRadius: "6px", color: "#fff",
    fontWeight: "600", fontSize: "13px", cursor: "pointer",
  },
  empty: { color: "#475569", fontSize: "14px", textAlign: "center", padding: "24px" },
  taskForm: { display: "flex", flexDirection: "column", gap: "18px", maxWidth: "560px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { color: "#94a3b8", fontSize: "13px", fontWeight: "500" },
  input: {
    padding: "10px 14px", background: "#0f172a", border: "1px solid #334155",
    borderRadius: "8px", color: "#f8fafc", fontSize: "14px", outline: "none",
  },
  submitBtn: {
    padding: "11px 28px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    border: "none", borderRadius: "8px", color: "#fff",
    fontWeight: "700", fontSize: "15px", cursor: "pointer", width: "fit-content",
  },
  successBox: {
    background: "#052e16", border: "1px solid #166534", color: "#86efac",
    padding: "12px 16px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px",
  },
  errorBox: {
    background: "#450a0a", border: "1px solid #7f1d1d", color: "#fca5a5",
    padding: "12px 16px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px",
  },
};

export default AdminDashboard;

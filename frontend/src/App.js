// ============================================================
// App.js - Root component with React Router + Auth context
// ============================================================
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import AdminDashboard   from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

// ── Auth Context ────────────────────────────────────────────
export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser  = localStorage.getItem("user");
      if (savedToken && savedUser && savedUser !== "undefined") {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Protected Route ─────────────────────────────────────────
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={loadingStyle}>Loading...</div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/employee"} replace />;
  }
  return children;
};

// ── Smart root redirect ─────────────────────────────────────
const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user)   return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/employee"} replace />;
};

const loadingStyle = {
  display: "flex", justifyContent: "center", alignItems: "center",
  minHeight: "100vh", color: "#64748b", background: "#0f172a",
  fontSize: "16px",
};

// ── App ──────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
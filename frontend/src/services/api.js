import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5005/api",
  withCredentials: false, // ✅ IMPORTANT
});

// Attach JWT token (ONLY for protected routes)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ❌ Do NOT send token for auth routes
  if (token && !config.url.includes("/auth")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---- Auth ----
export const registerUser  = (data) => API.post("/auth/register", data);
export const loginUser     = (data) => API.post("/auth/login", data);

// ---- Admin ----
export const fetchEmployees  = ()     => API.get("/admin/employees");
export const approveEmployee = (id)   => API.put(`/admin/approve/${id}`);
export const declineEmployee = (id)   => API.delete(`/admin/decline/${id}`);
export const assignTask      = (data) => API.post("/admin/assign-task", data);
export const fetchAllTasks   = ()     => API.get("/admin/tasks");

// ---- Employee ----
export const fetchMyTasks     = ()            => API.get("/employee/tasks");
export const updateTaskStatus = (id, status) => 
  API.put(`/employee/update-task/${id}`, { status });

export default API;


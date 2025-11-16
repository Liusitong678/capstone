import axios from "axios";
import { getAuth } from "firebase/auth";

// Create Axios instance
const api = axios.create({
  baseURL: "/api", // proxy from Vite → backend
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add Firebase Token
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const message =
          error.response?.data?.message ||
          error.message ||
          "API Request Failed";

      return Promise.reject(new Error(message));
    }
);

// ======================
// Helpers
// ======================
const fmtDate = (iso) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

function normalizeJob(j, idx = 0) {
  const href = j.url || j.applyUrl || "";
  if (!j || typeof j !== "object") return null;

  return {
    _uid: j._id || j.id || String(idx),
    title: j.title || "Untitled",
    company: j.company || "Unknown company",
    description: j.description || "",
    skills: Array.isArray(j.skills) ? j.skills : [],
    location: j.location || "",
    applyUrl: href,
    url: href,
    source: j.source || "",
    date: fmtDate(j.postedAt || j.date),
    postedAt: j.postedAt || null,
    raw: j,
  };
}

// ======================
// AI Scoring
// ======================
export const callScore = async (payload) => {
  return await api.post("/ai/score", payload);
};

export const createCoverLetter = async (payload) => {
  return await api.post("/ai/cover-letter", payload);
};

// ======================
// Jobs
// ======================
export const fetchJobs = async () => {
  const data = await api.get("/jobs");
  const list = Array.isArray(data) ? data : data?.jobs || [];
  return list.map((j, idx) => normalizeJob(j, idx)).filter(Boolean);
};

export const fetchJobById = async (id) => {
  const obj = await api.get(`/jobs/${id}`);
  return normalizeJob(obj);
};

export const fetchLatestResume = async () => {
  return await api.get("/resume/latest");
};

// ======================
// Saved Jobs
// ======================
export const fetchSavedJobs = async () => {
  const data = await api.get("/saved-jobs");
  return new Set(data || []);
};

export const saveJob = async (jobId) => {
  await api.post("/saved", { jobId });
};

export const unsaveJob = async (jobId) => {
  await api.delete(`/saved/${jobId}`);
};

export default api;

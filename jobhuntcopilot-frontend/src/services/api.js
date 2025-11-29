import axios from "axios";
import { getAuth } from "firebase/auth";

// Axios Instance
const api = axios.create({
  baseURL: "/api",     // Vite proxy → backend
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// Request Interceptor – Attach Firebase ID Token
api.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor – Normalize errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "API request failed";
    return Promise.reject(new Error(message));
  }
);

// Helpers
const fmtDate = (iso) => {
  if (!iso) return "";
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

// ------ AI ------
export const callScore = async (payload) => {
  // Payload should be: { job, resumeUrl }
  return await api.post("/ai/score", payload);
};

export const createCoverLetter = async (payload) => {
  // Payload should be: { jobTitle, jobDescription }
  return await api.post("/ai/coverLetter", payload); 
};

export const chatWithCareerCoach = async (payload) => {
  // Payload should be: { messages, jobDescription, resumeText }
  return await api.post("/ai/chat", payload);
}

// ------ Jobs ------
export const fetchJobs = async () => {
  const data = await api.get("/jobs");
  const list = Array.isArray(data) ? data : data?.jobs || [];
  return list.map((j, idx) => normalizeJob(j, idx)).filter(Boolean);
};

export const fetchJobById = async (id) => {
  const obj = await api.get(`/jobs/${id}`);
  return normalizeJob(obj);
};

export const parseJobs = async (url) => {
  console.log(url);
  return await api.post("/jobs/parse-jobs", { url });
};

export const fetchJobDescription = async (url) => {
  return await api.post("/jobs/fetch-job-detail", { url });
};

// ------ Resume ------
export const fetchLatestResume = async () => {
  return await api.get("/resume/latest");
};

// ------ Saved Jobs ------
export const fetchSavedJobs = async () => {
  const data = await api.get("/saved-jobs");
  return new Set(data || []);
};

export const saveJob = async (jobId) => {
  return await api.post("/saved-jobs", { jobId });
};

export const unsaveJob = async (jobId) => {
  return await api.delete(`/saved-jobs/${jobId}`);
};
 //  ------- CURD jobs ----------

export const createJob = async (payload) => {
  return await api.post("/jobs", payload);
};


export const updateJob = async (id, payload) => {
  return await api.put(`/jobs/${id}`, payload);
};
export const deleteJob = async (id) => {
  return await api.delete(`/jobs/${id}`);
};

// --- USER & ADMIN MANAGEMENT ---

export const fetchAllUsers = async () => {
  const res = await api.get("/users/all");
  return res.users || [];
};

export const createUserAsAdmin = async (userData) => {
  // userData: { email, password, firstName, lastName, role }
  return await api.post("/users/admin-create", userData);
};

export const deleteUser = async (uid) => {
  return await api.delete(`/users/${uid}`);
};

export const updateUserRole = async (uid, role) => {
  return await api.post("/users/set-role", { uid, role });
};

// ------ User Profile ------
export const fetchMyProfile = async () => {
  const res = await api.get("/users/me");
  return res.user;
};

export const updateUserProfile = async (payload) => {
  return await api.patch("/users/update", payload);
};

// ------ Payments ------
export const createCheckoutSession = async () => {
  return await api.post("/payment/create-checkout-session");
};


export default api;

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (email, password) =>
  api.post("/auth/register", { email, password });

export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const getMe = () => api.get("/me");

export const getGallery = () => api.get("/gallery");

export const processImage = (file, opts) => {
  const form = new FormData();
  form.append("file", file);
  Object.entries(opts).forEach(([k, v]) => form.append(k, v));
  return api.post("/process", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const processBatch = (files, opts) => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  Object.entries(opts).forEach(([k, v]) => form.append(k, v));
  return api.post("/process/batch", form, {
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "blob",
  });
};

export const fileUrl = (path) => `${API_URL}/uploads/${path}`;

import axios from "axios";

export const api = axios.create({
  baseURL: "https://agrosense-backend-0eqo.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
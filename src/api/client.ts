import axios from "axios";
import { API_URL, TOKEN_KEY } from "@/config";
import { useAuthStore } from "@/store/authStore";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (err: unknown, fallback = "Произошла ошибка"): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e = err as any;
  return (
    e?.response?.data?.detail ||
    e?.response?.data?.message ||
    e?.message ||
    fallback
  );
};

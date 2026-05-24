// client.ts — shared axios instance for the backend API.
// Base URL comes from VITE_API_BASE_URL; falls back to the dev backend port.

import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

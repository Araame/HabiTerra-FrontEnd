import axios from "axios";
import { getToken } from "./sessionStorage";
import { ApiError, isSessionInvalid, normalizeApiError } from "./apiErrors";

const publicPaths = new Set([
  "/api/v1/auth/login", "/api/v1/auth/request-otp", "/api/v1/auth/resend-otp",
  "/api/v1/auth/verify-otp", "/api/v1/auth/complete-registration",
]);
let onSessionInvalid = null;
export function setSessionInvalidHandler(handler) {
  onSessionInvalid = handler;
  return () => { if (onSessionInvalid === handler) onSessionInvalid = null; };
}

console.log(
    "EXPO_PUBLIC_API_URL =",
    process.env.EXPO_PUBLIC_API_URL
);


const httpClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, ""),
  timeout: 30000,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

httpClient.interceptors.request.use(async (config) => {
  if (!config.baseURL) throw new ApiError("configuration", "Configurez EXPO_PUBLIC_API_URL pour joindre le serveur.");
  const path = config.url?.split("?")[0].replace(/\/+$/, "");
  config.requiresAuth = config.requiresAuth !== false && !publicPaths.has(path);
  // Always remove inherited headers, including on public auth endpoints.
  config.headers.delete("Authorization");
  if (config.requiresAuth) {
    const token = await getToken();
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const normalized = normalizeApiError(error);
    if (error.config?.requiresAuth && isSessionInvalid(normalized)) {
      // Only invalidate the session that actually sent this request.
      const authorization = error.config.headers?.get("Authorization");
      if (authorization && onSessionInvalid) await onSessionInvalid(authorization);
    }
    throw normalized;
  },
);

export default httpClient;

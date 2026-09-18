import httpClient from "./httpClient";
import { ApiError } from "./apiErrors";

function requireUser(user) {
  if (!user || typeof user.role !== "string") {
    throw new ApiError("unexpected", "La réponse du serveur ne contient pas de profil valide.");
  }
  return user;
}

export async function login(identifier, password) {
  const { data } = await httpClient.post("/api/v1/auth/login", { identifier, password }, { requiresAuth: false });
  return requireSession(data);
}

function requireSession(data) {
  if (typeof data?.accessToken !== "string" || !data.accessToken.trim()) {
    throw new ApiError("unexpected", "La réponse de connexion est invalide.");
  }
  return { accessToken: data.accessToken, user: requireUser(data.user) };
}

async function sendOtp(path, identifier, signal) {
  const { data } = await httpClient.post(path, { identifier }, { requiresAuth: false, signal });
  if (!Number.isFinite(data?.expiresIn) || data.expiresIn <= 0 ||
      !Number.isFinite(data?.resendAfter) || data.resendAfter < 0) {
    throw new ApiError("unexpected", "La réponse d’envoi du code est invalide. Réessayez.");
  }
  return { expiresIn: data.expiresIn, resendAfter: data.resendAfter };
}

export const requestOtp = (identifier, signal) => sendOtp("/api/v1/auth/request-otp", identifier, signal);
export const resendOtp = (identifier, signal) => sendOtp("/api/v1/auth/resend-otp", identifier, signal);

export async function verifyOtp(identifier, otp, signal) {
  const { data } = await httpClient.post("/api/v1/auth/verify-otp", { identifier, otp }, { requiresAuth: false, signal });
  if (data?.verified !== true || typeof data.registrationToken !== "string" || !data.registrationToken.trim()) {
    throw new ApiError("unexpected", "La vérification n’a pas pu être confirmée. Demandez un nouveau code.");
  }
  return data.registrationToken;
}

export async function completeRegistration(payload, signal) {
  const { data } = await httpClient.post("/api/v1/auth/complete-registration", payload, { requiresAuth: false, signal });
  return requireSession(data);
}

export async function me() {
  const { data } = await httpClient.get("/api/v1/auth/me");
  return requireUser(data);
}

export async function logout() {
  await httpClient.post("/api/v1/auth/logout");
}

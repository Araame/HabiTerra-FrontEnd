import httpClient from "./httpClient";
import { ApiError } from "./apiErrors";
import { paginationParams } from "./apiPagination";

const base = "/api/v1/applications";

export async function createApplication(propertyId) {
  const response = await httpClient.post(base, { propertyId }, { requiresAuth: true });
  if (response.status !== 201) {
    throw new ApiError("unexpected", "Le serveur n’a pas confirmé la création de la candidature.");
  }
  return response.data;
}

export async function getMyApplications(pagination = {}, signal) {
  const { data } = await httpClient.get(`${base}/mine`, {
    params: paginationParams(pagination), requiresAuth: true, signal,
  });
  return data;
}

export async function getPropertyApplications(propertyId, pagination = {}, signal) {
  const { data } = await httpClient.get(`/api/v1/properties/${propertyId}/applications`, {
    params: paginationParams(pagination), requiresAuth: true, signal,
  });
  return data;
}

export async function getApplication(id, signal) {
  const { data } = await httpClient.get(`${base}/${id}`, { requiresAuth: true, signal });
  return data;
}

async function transition(id, action) {
  const { data } = await httpClient.post(`${base}/${id}/${action}`, undefined, { requiresAuth: true });
  return data;
}

export const reviewApplication = (id) => transition(id, "review");
export const acceptApplication = (id) => transition(id, "accept");
export const rejectApplication = (id) => transition(id, "reject");
export const cancelApplication = (id) => transition(id, "cancel");

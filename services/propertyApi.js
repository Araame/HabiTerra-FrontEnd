import httpClient from "./httpClient";
import { paginationParams } from "./apiPagination";

const base = "/api/v1/properties";
const filterFields = [
  "country", "city", "municipality", "neighborhood", "typeId", "minRent", "maxRent",
  "rooms", "bedrooms", "bathrooms", "minArea", "maxArea", "furnished",
  "sharedHousingAllowed", "minSharedHousingCapacity", "availableBefore",
];

export async function getProperties(filters = {}, pagination = {}, signal) {
  const params = paginationParams(pagination);
  for (const field of filterFields) {
    if (filters[field] !== undefined && filters[field] !== null && filters[field] !== "") {
      params[field] = filters[field];
    }
  }
  const { data } = await httpClient.get(base, { params, requiresAuth: false, signal });
  return data;
}

export async function getMyProperties(pagination = {}, signal) {
  const { data } = await httpClient.get(`${base}/mine`, {
    params: paginationParams(pagination), requiresAuth: true, signal,
  });
  return data;
}

// Public by default. Management screens must explicitly request authentication.
export async function getProperty(id, { requiresAuth = false, signal } = {}) {
  const { data } = await httpClient.get(`${base}/${id}`, { requiresAuth, signal });
  return data;
}

export async function createProperty(payload) {
  const { data } = await httpClient.post(base, payload, { requiresAuth: true });
  return data;
}

// Complete UpdatePropertyRequest, including rooms, must be supplied by the form.
export async function updateProperty(id, payload) {
  const { data } = await httpClient.put(`${base}/${id}`, payload, { requiresAuth: true });
  return data;
}

export async function publishProperty(id) {
  const { data } = await httpClient.post(`${base}/${id}/publish`, undefined, { requiresAuth: true });
  return data;
}

export async function unpublishProperty(id) {
  const { data } = await httpClient.post(`${base}/${id}/unpublish`, undefined, { requiresAuth: true });
  return data;
}

export async function getPropertyTypes(signal) {
  const { data } = await httpClient.get("/api/v1/property-types", { requiresAuth: false, signal });
  return data;
}

export async function getPropertyType(id, signal) {
  const { data } = await httpClient.get(`/api/v1/property-types/${id}`, { requiresAuth: false, signal });
  return data;
}

// Native file: { uri, name, type }; on web, supply a File/Blob.
export async function uploadPropertyPhoto(id, file, description) {
  const form = new FormData();
  form.append("file", file);
  if (description) form.append("description", description);
  const { data } = await httpClient.post(`${base}/${id}/photos`, form, {
    requiresAuth: true,
    // Override the shared JSON default. The adapter supplies the multipart boundary.
    headers: { "Content-Type": undefined },
  });
  return data;
}

export async function deletePropertyPhoto(id, photoId) {
  await httpClient.delete(`${base}/${id}/photos/${photoId}`, { requiresAuth: true });
}

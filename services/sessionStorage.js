import * as SecureStore from "expo-secure-store";
import { ApiError } from "./apiErrors";

const TOKEN_KEY = "habiterra.accessToken";

async function storageOperation(operation) {
  if (!(await SecureStore.isAvailableAsync())) {
    throw new ApiError("storage", "Le stockage sécurisé est indisponible. Utilisez l’application Android ou iOS.");
  }
  try {
    return await operation();
  } catch {
    throw new ApiError("storage", "Impossible d’accéder à la session sécurisée. Réessayez.");
  }
}

export const getToken = () => storageOperation(() => SecureStore.getItemAsync(TOKEN_KEY));
export const saveToken = (token) => storageOperation(() => SecureStore.setItemAsync(TOKEN_KEY, token));
export const removeToken = () => storageOperation(() => SecureStore.deleteItemAsync(TOKEN_KEY));

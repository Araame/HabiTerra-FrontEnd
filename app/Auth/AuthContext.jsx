import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import * as authApi from "../../services/authApi";
import { getToken, removeToken, saveToken } from "../../services/sessionStorage";
import { isSessionInvalid, normalizeApiError } from "../../services/apiErrors";
import { setSessionInvalidHandler } from "../../services/httpClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [restoreError, setRestoreError] = useState(null);
  const busy = useRef(false);
  const invalidation = useRef(null);

  const clearSession = useCallback(async () => {
    setUser(null);
    try {
      await removeToken();
      setRestoreError(null);
    } catch (error) {
      setRestoreError(normalizeApiError(error));
      throw error;
    }
  }, []);

  const restoreSession = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setIsRestoring(true);
    setRestoreError(null);
    try {
      if (await getToken()) setUser(await authApi.me());
      else setUser(null);
    } catch (error) {
      const normalized = normalizeApiError(error);
      if (isSessionInvalid(normalized)) {
        try { await clearSession(); } catch { /* clearSession exposes storage failures. */ }
      } else setRestoreError(normalized);
    } finally {
      busy.current = false;
      setIsRestoring(false);
    }
  }, [clearSession]);

  useEffect(() => {
    const unsubscribe = setSessionInvalidHandler(async (authorization) => {
      if (invalidation.current) return invalidation.current;
      invalidation.current = (async () => {
        if (authorization === `Bearer ${await getToken()}`) await clearSession();
      })();
      try { await invalidation.current; }
      finally { invalidation.current = null; }
    });
    restoreSession();
    return unsubscribe;
  }, [clearSession, restoreSession]);

  // Login and registration use exactly the same session installation.
  const establishSession = useCallback(async (session) => {
    await saveToken(session.accessToken);
    setRestoreError(null);
    setUser(session.user);
  }, []);

  const login = useCallback(async (identifier, password) => {
    if (busy.current) return;
    busy.current = true;
    try {
      const session = await authApi.login(identifier.trim(), password);
      await establishSession(session);
    } catch (error) {
      throw normalizeApiError(error);
    } finally { busy.current = false; }
  }, [establishSession]);

  const logout = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      try { await authApi.logout(); } catch { /* Explicit logout always clears locally. */ }
      await clearSession();
    } finally { busy.current = false; }
  }, [clearSession]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isRestoring, login, logout, restoreError, restoreSession, establishSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider.");
  return context;
}

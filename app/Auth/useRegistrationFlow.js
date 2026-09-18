import { useCallback, useEffect, useRef, useState } from "react";
import * as authApi from "../../services/authApi";
import { ApiError, normalizeApiError } from "../../services/apiErrors";
import { registrationPayload, registrationRoles, validateIdentifier, validateRegistration } from "./registrationForm";

const emptyRegistration = { role: null, identifier: "", registrationToken: null, expiresIn: null, resendAfter: null };
const unusableOtp = ["OTP_NOT_FOUND", "OTP_INVALIDATED", "OTP_ALREADY_USED", "OTP_EXPIRED", "OTP_MAX_ATTEMPTS"];

export default function useRegistrationFlow(establishSession) {
  const [registration, setRegistration] = useState(emptyRegistration);
  const [timing, setTiming] = useState(null);
  const [phase, setPhase] = useState(null);
  const [error, setError] = useState(null);
  const request = useRef(null);
  // A successful final response may be retried locally if SecureStore fails.
  const completedSession = useRef(null);
  const [accountCreated, setAccountCreated] = useState(false);

  const cancelPending = useCallback(() => {
    request.current?.abort();
    request.current = null;
    setPhase(null);
    setError(null);
  }, []);
  const reset = useCallback(() => {
    cancelPending();
    completedSession.current = null;
    setAccountCreated(false);
    setRegistration(emptyRegistration);
    setTiming(null);
  }, [cancelPending]);
  useEffect(() => reset, [reset]);

  function selectRole(role) {
    if (!registrationRoles.includes(role)) return;
    if (role !== registration.role) {
      reset();
      setRegistration({ ...emptyRegistration, role });
    }
  }

  async function run(name, operation) {
    if (request.current) return false;
    const controller = new AbortController();
    request.current = controller;
    setPhase(name);
    setError(null);
    try {
      await operation(controller.signal);
      return !controller.signal.aborted;
    } catch (failure) {
      if (!controller.signal.aborted) {
        const normalized = normalizeApiError(failure);
        setError(normalized.message);
        if (unusableOtp.includes(normalized.code)) setTiming(value => value && { ...value, expiresAt: 0 });
        if (["REGISTRATION_TOKEN_EXPIRED", "REGISTRATION_TOKEN_INVALID"].includes(normalized.code)) {
          setRegistration(value => ({ ...value, registrationToken: null }));
          setTiming(value => value && { ...value, expiresAt: 0 });
        }
      }
      return false;
    } finally {
      if (request.current === controller) {
        request.current = null;
        setPhase(null);
      }
    }
  }

  function acceptOtpResponse(identifier, response) {
    setRegistration(value => ({ ...value, identifier, registrationToken: null, ...response }));
    const now = Date.now();
    setTiming({ expiresAt: now + response.expiresIn * 1000, resendAt: now + response.resendAfter * 1000 });
  }

  async function start(identifier) {
    const validation = validateIdentifier(identifier);
    if (validation) { setError(validation); return false; }
    if (!registrationRoles.includes(registration.role) || accountCreated) return false;
    const value = identifier.trim();
    // Returning to an existing verification never sends another code implicitly.
    if (value === registration.identifier && timing) return true;
    return run("request", async signal => {
      setRegistration(current => ({ ...emptyRegistration, role: current.role }));
      setTiming(null);
      const response = await authApi.requestOtp(value, signal);
      if (!signal.aborted) acceptOtpResponse(value, response);
    });
  }

  async function resend() {
    if (!registration.identifier || !timing || Date.now() < timing.resendAt || accountCreated) return false;
    return run("resend", async signal => {
      setRegistration(value => ({ ...value, registrationToken: null }));
      setTiming(value => ({ ...value, expiresAt: 0 }));
      const response = await authApi.resendOtp(registration.identifier, signal);
      if (!signal.aborted) acceptOtpResponse(registration.identifier, response);
    });
  }

  async function verify(otp) {
    if (registration.registrationToken) return true;
    return run("verify", async signal => {
      if (!/^[0-9]{6}$/.test(otp)) throw new ApiError("validation", "Saisissez les 6 chiffres du code.");
      if (!timing || Date.now() >= timing.expiresAt) throw new ApiError("validation", "Le code a expiré. Demandez un nouveau code.");
      const token = await authApi.verifyOtp(registration.identifier, otp, signal);
      if (!signal.aborted) setRegistration(value => ({ ...value, registrationToken: token }));
    });
  }

  async function finish(values) {
    if (!completedSession.current) {
      if (!registration.registrationToken) { setError("Vérifiez votre identifiant avant de créer le compte."); return false; }
      const validation = validateRegistration({ ...values, ...registration });
      if (validation) { setError(validation); return false; }
    }
    return run("complete", async signal => {
      if (!completedSession.current) {
        const session = await authApi.completeRegistration(
          registrationPayload({ ...values, ...registration }, registration.registrationToken), signal,
        );
        if (signal.aborted) return;
        completedSession.current = session;
        setAccountCreated(true);
        setRegistration(emptyRegistration);
        setTiming(null);
      }
      await establishSession(completedSession.current);
      reset();
    });
  }

  return { registration, timing, phase, error, accountCreated, selectRole, start, resend, verify, finish, reset, cancelPending };
}

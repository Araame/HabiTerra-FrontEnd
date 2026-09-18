// Error class personnalized
export class ApiError extends Error {
  constructor(kind, message, { status = null, code = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.code = code;
  }
}

const messages = {
  BAD_CREDENTIALS: "Identifiant ou mot de passe incorrect.",
  ACCOUNT_SUSPENDED: "Votre compte est suspendu.",
  ACCOUNT_DISABLED: "Votre compte est désactivé.",
  ACCOUNT_PENDING: "Votre compte n’est pas encore actif.",
  IDENTIFIER_NOT_VERIFIED: "Cet email ou ce téléphone n’est pas encore vérifié.",
  INVALID_REQUEST: "Vérifiez les informations saisies.",
  INVALID_IDENTIFIER: "Renseignez un email valide ou un téléphone avec indicatif international.",
  EMAIL_ALREADY_USED: "Cette adresse email est déjà utilisée.",
  PHONE_ALREADY_USED: "Ce numéro de téléphone est déjà utilisé.",
  OTP_COOLDOWN: "Veuillez patienter avant de demander un nouveau code.",
  OTP_RATE_LIMIT: "Trop de codes demandés. Réessayez plus tard.",
  AUTH_RATE_LIMIT: "Trop de requêtes. Veuillez patienter avant de réessayer.",
  OTP_DELIVERY_UNAVAILABLE: "Impossible d’envoyer le code pour le moment. Réessayez plus tard.",
  INVALID_OTP: "Le code est incorrect. Vérifiez les 6 chiffres reçus.",
  OTP_NOT_FOUND: "Aucun code disponible. Demandez un nouveau code.",
  OTP_INVALIDATED: "Ce code n’est plus valide. Demandez un nouveau code.",
  OTP_ALREADY_USED: "Ce code a déjà été utilisé. Demandez un nouveau code.",
  OTP_EXPIRED: "Le code a expiré. Demandez un nouveau code.",
  OTP_MAX_ATTEMPTS: "Trop de tentatives. Demandez un nouveau code.",
  REGISTRATION_TOKEN_EXPIRED: "La vérification a expiré. Demandez un nouveau code.",
  REGISTRATION_TOKEN_INVALID: "La vérification n’est plus valide. Si le compte a déjà été créé, connectez-vous ; sinon, demandez un nouveau code.",
  IDENTIFIER_MISMATCH: "L’identifiant doit correspondre à celui vérifié. Recommencez l’inscription.",
  PASSWORD_MISMATCH: "Les mots de passe ne correspondent pas.",
  WEAK_PASSWORD: "Utilisez au moins 12 caractères, une lettre et un chiffre, sans dépasser 72 octets.",
  FIRST_NAME_REQUIRED: "Renseignez votre prénom.",
  LAST_NAME_REQUIRED: "Renseignez votre nom.",
  PROFESSION_REQUIRED: "Renseignez votre profession.",
  POSTE_REQUIRED: "Renseignez votre poste.",
  POSTE_NOT_ALLOWED: "Le poste est réservé au profil Agence.",
  PROFESSION_NOT_ALLOWED: "Renseignez le poste pour le profil Agence.",
  ADMIN_FORBIDDEN: "Ce profil ne peut pas être créé depuis l’application.",
  INVALID_ROLE: "Choisissez un profil autorisé pour l’inscription.",
};

// Handles API error
export function normalizeApiError(error) {
  if (error instanceof ApiError) return error;
  if (error?.response) {
    const data = error.response.data;
    const code = data?.code || data?.error || null;
    return new ApiError("http", messages[code] || "Une erreur est survenue. Veuillez réessayer.",
    { status: error.response.status, code });
  }
  if (["ECONNABORTED", "ETIMEDOUT"].includes(error?.code)) {
    return new ApiError("timeout", "Le serveur met trop de temps à répondre. Réessayez.");
  }
  if (error?.request || error?.code === "ERR_NETWORK") {
    return new ApiError("network", "Serveur inaccessible. Vérifiez votre connexion et réessayez.");
  }
  return new ApiError("unexpected", "Une erreur inattendue est survenue. Réessayez.");
}

// Invalid session error
export function isSessionInvalid(error) {
  return error.kind === "http" && error.status === 401 &&
    ["JWT_EXPIRED", "JWT_INVALID", "UNAUTHORIZED", "USER_NOT_FOUND"].includes(error.code);
}

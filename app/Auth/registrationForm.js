export const registrationRoles = ["LOCATAIRE", "PROPRIETAIRE", "GERANT_AGENCE"];

// Count Unicode code points and UTF-8 bytes, as in AuthService.validatePassword.
export function passwordError(password, confirmation) {
  const characters = Array.from(password);
  if (characters.length < 12 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Utilisez au moins 12 caractères, avec une lettre (a-z) et un chiffre.";
  }
  const bytes = characters.reduce((total, character) => {
    const point = character.codePointAt(0);
    return total + (point <= 0x7f ? 1 : point <= 0x7ff ? 2 : point <= 0xffff ? 3 : 4);
  }, 0);
  if (bytes > 72) return "Mot de passe trop long : 72 octets maximum (les accents et emojis occupent plusieurs octets).";
  if (password !== confirmation) return "Les mots de passe ne correspondent pas.";
  return null;
}

export function validateRegistration(values) {
  if (!registrationRoles.includes(values.role)) return "Choisissez un profil autorisé pour l’inscription.";
  if (!values.prenom.trim() || !values.nom.trim()) return "Renseignez votre prénom et votre nom.";
  if (values.prenom.trim().length > 100 || values.nom.trim().length > 100) return "Le prénom et le nom sont limités à 100 caractères chacun.";
  const identifierError = validateIdentifier(values.identifier);
  if (identifierError) return identifierError;
  const field = values.role === "GERANT_AGENCE" ? "poste" : "profession";
  if (!values[field]?.trim() || values[field].trim().length > 255) return `Renseignez votre ${field} (255 caractères maximum).`;
  return passwordError(values.password, values.confirmPassword);
}

export function validateIdentifier(value) {
  const identifier = value.trim();
  if (!identifier) return "Renseignez votre email ou votre téléphone.";
  if (identifier.includes("@")) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier) || identifier.length > 100) return "Renseignez une adresse email valide (100 caractères maximum).";
  } else if (!/^(\+|00)[0-9 ()-]+$/.test(identifier) || identifier.length > 40) {
    return "Renseignez votre téléphone avec son indicatif international, par exemple +221771234567.";
  }
  return null;
}

export function registrationPayload(draft, registrationToken) {
  const identifier = draft.identifier.trim();
  const email = identifier.includes("@");
  return {
    registrationToken, prenom: draft.prenom.trim(), nom: draft.nom.trim(),
    email: email ? identifier : null, telephone: email ? null : identifier,
    password: draft.password, confirmPassword: draft.confirmPassword, role: draft.role,
    profession: draft.role === "GERANT_AGENCE" ? null : draft.profession.trim(),
    poste: draft.role === "GERANT_AGENCE" ? draft.poste.trim() : null,
  };
}

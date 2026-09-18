export const PROPERTY_STATUS_LABELS = Object.freeze({
  DRAFT: "Brouillon",
  AVAILABLE: "Disponible",
  RENTED: "Loué",
  UNAVAILABLE: "Indisponible",
});

export const APPLICATION_STATUS_LABELS = Object.freeze({
  EN_ATTENTE: "En attente",
  EN_ETUDE: "À l'étude",
  ACCEPTEE: "Acceptée",
  REJETEE: "Refusée",
  ANNULEE: "Annulée",
});

export const propertyStatusLabel = (status) => PROPERTY_STATUS_LABELS[status] || "Statut inconnu";
export const applicationStatusLabel = (status) => APPLICATION_STATUS_LABELS[status] || "Statut inconnu";

// FCFA is a product presentation convention, not a field in PropertyResponse.
export function formatRent(amount) {
  return typeof amount === "number" && Number.isFinite(amount)
    ? `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA / mois`
    : "Loyer non renseigné";
}

export function formatLocation(address) {
  return [address?.street, address?.neighborhood, address?.municipality, address?.city, address?.country]
    .filter((part) => typeof part === "string" && part.trim())
    .map((part) => part.trim()).join(", ");
}

export function getFirstPhoto(property) {
  const photos = property?.gallery?.photos;
  return Array.isArray(photos)
    ? photos.find((photo) => typeof photo?.url === "string" && photo.url.trim()) || null
    : null;
}

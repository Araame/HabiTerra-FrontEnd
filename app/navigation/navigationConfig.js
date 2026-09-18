// Bottom bar according to connected user role
export const navigationConfig = {
  LOCATAIRE: [
    { name: "Home", label: "Accueil", icon: "home-outline" },
    { name: "Search", label: "Recherche", icon: "search-outline" },
    { name: "Lease", label: "Mon bail", icon: "document-text-outline" },
    { name: "Profile", label: "Profil", icon: "person-outline" },
  ],
  GERANT_AGENCE: [
    { name: "AgencyHome", label: "Accueil", icon: "home-outline" },
    { name: "AgencyProperties", label: "Biens", icon: "business-outline" },
    { name: "AgencyFinance", label: "Finance", icon: "wallet-outline" },
    { name: "AgencyProfile", label: "Profil", icon: "settings-outline" },
  ],
};

// Avalaible role
export const roleOptions = [
  { value: "LOCATAIRE", label: "Locataire", icon: "person-outline" },
  { value: "PROPRIETAIRE", label: "Propriétaire", icon: "home-outline" },
  { value: "GERANT_AGENCE", label: "Agence", icon: "business-outline" },
];

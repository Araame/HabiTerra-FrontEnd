// Données de démonstration uniquement. Aucun service réseau ni utilisateur connecté.
export const properties = [
  {
    id: "almadies",
    title: "Appartement lumineux aux Almadies",
    location: "Almadies, Dakar",
    price: "520 000 FCFA/mois",
    bedrooms: 2,
    area: 78,
    views: 142,
    type: "Appartement",
    status: "Disponible",
    shared: true,
    image: {
      uri: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&q=85",
    },
    description:
      "Bel appartement de 78 m² situé dans le quartier résidentiel des Almadies. Très lumineux avec une belle vue dégagée. Idéal pour une colocation ou une famille.",
  },
  {
    id: "mermoz",
    title: "Studio moderne à Mermoz",
    location: "Mermoz, Dakar",
    price: "275 000 FCFA/mois",
    bedrooms: 1,
    area: 32,
    views: 89,
    type: "Studio",
    status: "Loué",
    shared: false,
    image: {
      uri: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&q=85",
    },
    description:
      "Studio meublé et lumineux à Mermoz, proche des commerces et des transports.",
  },
  {
    id: "ngor",
    title: "Villa 4 chambres à Ngor",
    location: "Ngor, Dakar",
    price: "950 000 FCFA/mois",
    bedrooms: 4,
    area: 185,
    views: 214,
    type: "Villa",
    status: "Disponible",
    shared: true,
    image: {
      uri: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1000&q=85",
    },
    description:
      "Villa spacieuse à Ngor avec quatre chambres, un jardin et une piscine.",
  },
];

export const nearbyPlaces = [
  { name: "Plage des Almadies", distance: "300 m", icon: "water-outline" },
  { name: "Supermarché Casino", distance: "500 m", icon: "cart-outline" },
  { name: "École française", distance: "1,2 km", icon: "school-outline" },
  { name: "Hôpital Principal", distance: "3 km", icon: "medkit-outline" },
];
export const demoProfile = {
  name: "aze",
  email: "aze@gmail.com",
  phone: "+221 77 123 45 67",
};
export const searchSummary = [
  { label: "Type", value: "Appartement" },
  { label: "Zone", value: "Almadies" },
  { label: "Budget", value: "500 000 fcfa" },
  { label: "Chambres", value: "2" },
  { label: "Colocation", value: "Autorisée" },
];
export const demoAssistantMessage =
  "J'ai bien compris votre recherche !\nVoici ce que j'ai retenu :\n\nZone : Almadies\nBudget : 500 000 fcfa\nChambres : 2\nType : Appartement\nColocation : Autorisée\n\nJ'ai trouvé plusieurs logements correspondant à vos critères !";
export function getProperty(id) {
  return properties.find((property) => property.id === id) ?? properties[0];
}

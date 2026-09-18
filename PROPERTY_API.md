# Phase 2 — groupe 1 : services

Contrats vérifiés en lecture seule dans les contrôleurs et DTO du backend voisin.
Tous les appels utilisent `services/httpClient.js`, sans modification de ses intercepteurs.

- `getProperties(filters, pagination, signal)` : catalogue public, filtres backend uniquement.
- `getMyProperties(pagination, signal)` : portefeuille authentifié, sans recherche ni filtre de statut.
- `getProperty(id)` : détail public sans Bearer. Pour la gestion, appeler explicitement
  `getProperty(id, { requiresAuth: true, signal })`.
- Types : `getPropertyTypes(signal)` et `getPropertyType(id, signal)`, sans Bearer.
- Création, PUT complet, publication, dépublication, ajout et suppression de photos : JWT.
- Candidatures : création, listes personnelles/par bien, détail, review/accept/reject/cancel : JWT.
- Listes paginées : réponse Spring Page conservée, avec `content`, `number`, `totalPages`, `last`.
  Paramètres par défaut : page 0, size 20 ; size borné entre 1 et 100. Les types sont une liste simple.
- `createApplication(propertyId)` envoie uniquement `{ propertyId }` et exige HTTP 201.

Les services de création et modification attendent des DTO construits par le futur formulaire.
Le PUT doit inclure les pièces ; il ne doit pas recevoir ownerId, status, agency ou creationDate.
Le propriétaire doit omettre ownerId en création. La création agence reste bloquée tant que
la sélection d'un propriétaire réel n'est pas disponible. Aucune opération saveDraft distincte.

## Photos

`uploadPropertyPhoto(id, file, description)` envoie une opération indépendante par photo,
avec le champ multipart `file`. En natif, fournir `{ uri, name, type }` ; en web, un File/Blob.
Le Content-Type JSON par défaut est retiré pour laisser l'adaptateur générer la boundary.
Aucun retry automatique ne recrée le bien. La sélection JPEG/PNG et les retries par photo
seront intégrés au groupe photos.

L'affichage protégé n'est pas encore implémenté. Le futur `PropertyPhoto` centralisera
le chargement authentifié via le client partagé, avec vérification de l'origine de l'URL
avant envoi du JWT. Aucun token dans l'URL ou les logs. Le mécanisme de conversion en
source Image sera validé sur les plateformes Expo au groupe photos ; ne pas utiliser
directement une URL privée dans Image en supposant que les intercepteurs s'appliquent.

## Validation

`node scripts/check-property-api.cjs` vérifie les routes, verbes, auth publique/privée,
pagination, filtres false/0, multipart, conservation des pièces, création HTTP 201,
erreurs et présentation. Le transport est simulé : ce ne sont pas des tests serveur.
Les scripts existants check-auth et check-registration couvrent la non-régression auth.
Pas de script lint configuré. Export Expo : `npx expo export --platform all`.

Les écrans et mocks restent inchangés à ce point de contrôle. Prochaine étape :
PortfolioScreen avec pagination, refresh, états et suppression des filtres trompeurs.

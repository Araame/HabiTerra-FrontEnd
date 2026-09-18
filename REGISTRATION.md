# Inscription Habiterra

## Ordre des étapes

Login / Account → **Créer un compte** → ProfileChoice → Identifier →
Verification → CompleteProfile → session créée → espace selon `response.user.role`.

- `AccountScreen` conserve le login existant. Son bouton Créer un compte ouvre le
  choix du profil ; il ne contient plus de formulaire d’inscription.
- `ProfileChoiceScreen` propose LOCATAIRE, PROPRIETAIRE et GERANT_AGENCE.
- `IdentifierScreen` demande uniquement email ou téléphone, puis request-otp.
- `VerificationScreen` vérifie une chaîne de six chiffres, puis ouvre le profil.
  **verify-otp ne déclenche jamais complete-registration.**
- `CompleteProfileScreen` demande prénom, nom, profession (locataire/propriétaire)
  ou poste (agence), mot de passe et confirmation. Son bouton Créer mon compte
  appelle complete-registration.
- `ActivationScreen` reste hors navigation. Aucune reconnexion imposée.

## Données temporaires et session

`useRegistrationFlow`, au niveau d’AuthNavigator, conserve exclusivement ces
données d’inscription : `{ role, identifier, registrationToken, expiresIn,
resendAfter }`. Les dates absolues des compteurs et les états de chargement/erreur
sont séparés. Aucun état d’inscription n’est persisté.

Les informations personnelles et mots de passe restent locaux à CompleteProfile.
L’OTP reste local à Verification. Aucun secret ne passe dans les params de navigation.
Le registrationToken est envoyé uniquement dans le corps de complete-registration.
Tous les endpoints d’inscription restent publics, sans Bearer.

La réponse finale utilise `AuthContext.establishSession` déjà partagé avec le
login : accessToken dans SecureStore, puis user dans le contexte. AuthContext,
authApi et la navigation racine ne sont pas modifiés par cette réorganisation.
Si SecureStore échoue après la création serveur, la réponse finale est gardée
temporairement en mémoire pour réessayer uniquement le stockage. Le formulaire
et les cinq données d’inscription sont alors effacés.

## Retour et renvoi

CompleteProfile → Verification → Identifier → ProfileChoice → Login.
Les retours ne font aucun appel API. Retourner au formulaire personnel après une
vérification réussie ne revérifie pas l’OTP déjà consommé. Les champs personnels
sont effacés lorsque leur écran est retiré de la pile.

Si l’identifiant déjà utilisé est inchangé, Identifier propose de continuer la
vérification existante sans nouvel envoi. Pour recevoir un autre code, utiliser
Renvoyer sur Verification, après le délai `resendAfter`. Un changement de profil
réinitialise les données de vérification ; un nouvel identifiant soumis invalide
la vérification locale précédente.

Le renvoi efface l’ancien code et le registrationToken. Les compteurs utilisent
`expiresIn`/`resendAfter` retournés par le serveur, avec des dates absolues pour
tenir compte du temps passé en arrière-plan. Le backend reste autoritaire.

Un retour au login ou démontage du parcours efface l’état temporaire. Quitter un
écran annule sa requête en cours ; une réponse tardive ne rétablit pas cet état.
Une annulation réseau ne peut pas annuler une opération déjà validée côté serveur.

## Validation et erreurs

Identifiant : contrôles UX simples, normalisation laissée à Spring Boot.
Mot de passe : 12 caractères Unicode minimum, lettre ASCII, chiffre,
confirmation identique, maximum 72 octets UTF-8 conformément au backend.
Prénom/nom : 100 caractères ; profession/poste : 255. Aucun champ agence.

Les erreurs réutilisent `normalizeApiError`. Un registrationToken expiré/invalide
désactive la finalisation et propose le retour à Verification pour recevoir un
nouveau code. Une erreur réseau conserve les saisies pour réessayer.
Si la réponse de création est perdue mais que le serveur a créé le compte,
la connexion existante permet de récupérer l’accès.

## Recette manuelle

1. Ouvrir l’app déconnectée : écran Connexion. Tester un login existant.
2. Créer un compte → Locataire → Continuer : seul le champ email/téléphone apparaît.
3. Saisir un email neuf → Recevoir mon code : chargement puis écran OTP.
4. Vérifier cooldown, expiration, code incorrect et renvoi. Saisir le code reçu.
5. Vérifier que le formulaire personnel apparaît, sans session créée à ce stade.
6. Tester retour au code puis Continuer : pas de nouvel appel verify-otp.
7. Saisir prénom/nom/profession/mot de passe/confirmation → Créer mon compte.
8. Vérifier l’arrivée dans l’espace locataire puis la restauration après relance.
9. Refaire avec Propriétaire et Agence (poste uniquement), et vérifier les retours
   successifs jusqu’au login : aucun appel automatique ni données conservées.
10. Tester erreurs réseau et jeton expiré. Le téléphone reste dépendant du service
    SMS backend ; aucun envoi simulé n’est ajouté.

Contrôles : `node scripts/check-registration.cjs`, `node scripts/check-auth.cjs`,
`node scripts/check-navigation.cjs`, export Expo Android. Aucun linter configuré.
Les tests simulés et l’export ne remplacent pas la recette sur appareil avec email réel.

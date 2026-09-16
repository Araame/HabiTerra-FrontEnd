# HabiTerra

Application React Native initialisée avec Expo et JavaScript.

## Démarrage

```sh
npm install
npm start
```

`npm run android` ouvre l'application sur un émulateur Android disponible.
Le serveur Expo affiche également les options de connexion d'un appareil.
Le simulateur iOS nécessite macOS.

## Vérification du bundle Android

```sh
npx expo export --platform android
```

L'espace locataire est initialisé dans `App.js`, le point d'entrée dans `index.js`
et la configuration Expo dans `app.json`.
Les actions importantes sont consignées localement dans `docs/journal.md`.
Le dossier `docs/` est volontairement ignoré par Git.

## Navigation locataire

- `app/navigation/TenantNavigator.jsx` : unique navigateur Bottom Tabs, liste des
  quatre routes et labels. Le retour Android suit l'historique des onglets.
- `components/navigation/TenantBottomBar.jsx` : capsule blanche, icônes Ionicons
  outline, état actif issu de React Navigation et événements de navigation.
- `app/screens/TenantPlaceholderScreen.jsx` : écran provisoire partagé.
- `shared/theme.js` : palette provisoire centralisée, utilisée par NativeWind et
  React Navigation. Remplacer `primary` et `primarySoft` par les couleurs de marque
  lorsqu'elles seront définies.

La capsule mesure 72 px, avec 20 px de marge latérale en plus des safe areas et
16 px sous la barre en plus de l'inset inférieur. Le pied de page réserve sa
hauteur dans la mise en page : les écrans et leurs ScrollViews ne passent pas
derrière la barre et n'ont pas besoin de padding inférieur compensatoire.

Pour ajouter un onglet, ajouter `{ name, label, icon }` dans `tabs` avec un nom
d'icône Ionicons. Pour brancher les vrais écrans, associer un `component` à chaque
entrée et utiliser `component={component}` sur `Tab.Screen` à la place de son
enfant de rendu provisoire.

NativeWind 4 utilise `tailwind.config.js`, `babel.config.js`, `metro.config.js` et
`global.css`, conformément à sa [documentation d'installation](https://www.nativewind.dev/docs/getting-started/installation).
La barre utilise l'API [custom tabBar de React Navigation](https://reactnavigation.org/docs/bottom-tab-navigator/).

```sh
npm start -- --clear
npm run android
# Sur macOS avec un simulateur iOS :
npm run ios
# Vérifier la génération des deux bundles :
npx expo export --platform android --platform ios
```

Vérification sur appareil : toucher chaque onglet, contrôler son label et sa
pastille active, puis utiliser Retour sur Android. Vérifier les marges avec
navigation Android par gestes/boutons et avec l'indicateur d'accueil iOS.

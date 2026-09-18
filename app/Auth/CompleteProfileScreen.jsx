import { useEffect, useState } from "react";
import { Text } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import FormField from "../../components/common/FormField";
import PrimaryButton from "../../components/common/PrimaryButton";

const emptyValues = { prenom: "", nom: "", profession: "", poste: "", password: "", confirmPassword: "" };

export default function CompleteProfileScreen({ navigation, flow }) {
  const [values, setValues] = useState(emptyValues);
  const { registration, accountCreated, phase, error } = flow;
  const busy = !!phase;
  const verified = !!registration.registrationToken;
  useEffect(() => { if (accountCreated) setValues(emptyValues); }, [accountCreated]);
  const fields = [
    { key: "prenom", label: "Prénom", autoComplete: "given-name", maxLength: 100 },
    { key: "nom", label: "Nom", autoComplete: "family-name", maxLength: 100 },
    { key: registration.role === "GERANT_AGENCE" ? "poste" : "profession", label: registration.role === "GERANT_AGENCE" ? "Poste" : "Profession", maxLength: 255 },
    { key: "password", label: "Mot de passe", secureTextEntry: true, autoComplete: "new-password", autoCapitalize: "none" },
    { key: "confirmPassword", label: "Confirmer le mot de passe", secureTextEntry: true, autoComplete: "new-password", autoCapitalize: "none" },
  ];
  return (
    <ScreenLayout primaryHeader={false} header={<ScreenHeader title="Votre profil" variant="light" onBack={busy ? undefined : () => navigation.goBack()} />}>
      <Text className="mt-5 font-bold text-2xl text-text">Finalisons votre profil</Text>
      {verified && !accountCreated && <>
        <Text className="font-sans text-sm leading-6 text-muted">Identifiant vérifié : {registration.identifier}</Text>
        {fields.map(({ key, ...field }) => <FormField key={key} {...field} value={values[key]} disabled={busy}
          onChangeText={value => setValues(current => ({ ...current, [key]: value }))} />)}
        <Text className="font-sans text-xs leading-5 text-muted">
          Au moins 12 caractères, une lettre (a-z) et un chiffre. Maximum 72 octets ; les accents et emojis comptent davantage.
        </Text>
      </>}
      {accountCreated && <Text className="font-sans text-sm text-muted">Votre compte est créé. Finalisons votre connexion sécurisée.</Text>}
      {!verified && !accountCreated && <Text className="font-sans text-sm text-muted">Vérifiez à nouveau votre identifiant pour continuer.</Text>}
      {error && <Text accessibilityRole="alert" className="font-sans text-sm text-danger">{error}</Text>}
      {verified || accountCreated ? <PrimaryButton title={busy ? "Création du compte…" : accountCreated ? "Finaliser ma connexion" : "Créer mon compte"}
        loading={busy} onPress={() => flow.finish(values)} />
        : <PrimaryButton title="Retour à la vérification" onPress={() => navigation.goBack()} />}
    </ScreenLayout>
  );
}

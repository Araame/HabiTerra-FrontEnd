import { useState } from "react";
import { Text } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import FormField from "../../components/common/FormField";
import PrimaryButton from "../../components/common/PrimaryButton";
import InfoCard from "../../components/common/InfoCard";
import { roleOptions } from "../navigation/navigationConfig";

export default function AccountScreen({
  navigation,
  mode = "register",
  role,
  returnTo,
}) {
  const login = mode === "login";
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const label = roleOptions.find((option) => option.value === role)?.label;
  const fields = [
    { key: "name", label: "Nom complet", autoComplete: "name" },
    {
      key: "phone",
      label: "Téléphone",
      keyboardType: "phone-pad",
      autoComplete: "tel",
    },
    {
      key: "email",
      label: "Email",
      keyboardType: "email-address",
      autoCapitalize: "none",
      autoComplete: "email",
    },
    {
      key: "password",
      label: "Mot de passe",
      secureTextEntry: true,
      autoCapitalize: "none",
      autoComplete: login ? "current-password" : "new-password",
    },
  ].filter(({ key }) => !login || ["email", "password"].includes(key));
  return (
    <ScreenLayout
      header={
        <ScreenHeader
          title={login ? "Connexion" : `Inscription ${label}`}
          onBack={() => navigation.goBack()}
        />
      }
    >
      {returnTo?.propertyId && (
        <Text className="font-sans text-sm text-muted">
          Le logement sélectionné est conservé pendant ce parcours. La reprise
          après connexion sera branchée avec le service d’authentification.
        </Text>
      )}
      <InfoCard
        variant="neutral"
        icon="information-circle-outline"
        description={
          login
            ? "La connexion au service d’authentification n’est pas encore disponible."
            : "Formulaire préparatoire : l’inscription et les informations spécifiques à votre profil seront complétées lors de l’intégration du service."
        }
      />
      {fields.map(({ key, ...field }) => (
        <FormField
          key={key}
          {...field}
          value={values[key]}
          onChangeText={(value) => setValues({ ...values, [key]: value })}
        />
      ))}
      <PrimaryButton
        title={login ? "Se connecter" : "Créer mon compte"}
        disabled
      />
      {__DEV__ && !login && (
        <PrimaryButton
          title="Prévisualiser la vérification"
          variant="outline"
          onPress={() => navigation.navigate("Verification")}
        />
      )}
      {__DEV__ && returnTo?.propertyId && (
        <PrimaryButton
          title="Prévisualiser la candidature sans connexion"
          variant="neutral"
          onPress={() =>
            navigation.navigate("Preview", {
              role: "LOCATAIRE",
              screen: "TenantProfile",
              initial: false,
              params: {
                propertyId: returnTo.propertyId,
                applicationFlow: true,
              },
            })
          }
        />
      )}
    </ScreenLayout>
  );
}

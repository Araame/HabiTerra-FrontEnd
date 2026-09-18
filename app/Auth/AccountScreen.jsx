import { useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { Text } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import FormField from "../../components/common/FormField";
import PrimaryButton from "../../components/common/PrimaryButton";
import InfoCard from "../../components/common/InfoCard";

export default function AccountScreen({
  navigation,
  returnTo,
}) {
  const { login: signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const submitting = useRef(false);
  const [values, setValues] = useState({
    password: "",
    identifier: "",
  });
  async function submit() {
    if (submitting.current || !values.identifier.trim() || !values.password) return;
    submitting.current = true;
    setLoading(true);
    setError(null);
    try {
      await signIn(values.identifier, values.password);
    }
    catch (failure) { setError(failure.message); }
    finally { submitting.current = false; setLoading(false); }
  }
  const fields = [
    { key: "identifier", label: "Email ou téléphone", autoCapitalize: "none", autoComplete: "username", autoCorrect: false },
    {
      key: "password",
      label: "Mot de passe",
      secureTextEntry: true,
      autoCapitalize: "none",
      autoComplete: "current-password",
    },
  ];
  return (
    <ScreenLayout
      header={
        <ScreenHeader
          title="Connexion"
          onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
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
        description="Connectez-vous avec votre email ou votre numéro de téléphone."
      />
      {fields.map(({ key, ...field }) => (
        <FormField
          key={key}
          {...field}
          disabled={loading}
          value={values[key]}
          onChangeText={(value) => setValues({ ...values, [key]: value })}
        />
      ))}
      {error && <Text accessibilityRole="alert" className="font-sans text-sm text-danger">{error}</Text>}
      <PrimaryButton
        title="Se connecter"
        disabled={!values.identifier.trim() || !values.password}
        loading={loading}
        onPress={submit}
      />
      <PrimaryButton title="Créer un compte" variant="outline" disabled={loading}
        onPress={() => navigation.navigate("ProfileChoice")} />
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

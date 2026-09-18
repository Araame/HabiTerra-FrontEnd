import { useState } from "react";
import { Text } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import FormField from "../../components/common/FormField";
import PrimaryButton from "../../components/common/PrimaryButton";

export default function IdentifierScreen({ navigation, flow }) {
  const [identifier, setIdentifier] = useState(flow.registration.identifier);
  const busy = !!flow.phase;
  const alreadySent = identifier.trim() === flow.registration.identifier && !!flow.timing;
  async function submit() {
    if (await flow.start(identifier)) navigation.navigate("Verification");
  }
  return (
    <ScreenLayout primaryHeader={false} header={<ScreenHeader title="Créer un compte" variant="light" onBack={() => navigation.goBack()} />}>
      <Text className="mt-5 font-bold text-2xl text-text">Créons votre compte</Text>
      <Text className="font-sans text-sm leading-6 text-muted">
        Saisissez votre email ou votre numéro de téléphone pour recevoir votre code de vérification.
      </Text>
      <FormField label="Email ou numéro de téléphone" value={identifier} onChangeText={setIdentifier}
        autoCapitalize="none" autoCorrect={false} disabled={busy} />
      {flow.error && <Text accessibilityRole="alert" className="font-sans text-sm text-danger">{flow.error}</Text>}
      <PrimaryButton title={busy ? "Envoi du code…" : alreadySent ? "Continuer la vérification" : "Recevoir mon code"}
        loading={busy} disabled={!identifier.trim()} onPress={submit} />
    </ScreenLayout>
  );
}

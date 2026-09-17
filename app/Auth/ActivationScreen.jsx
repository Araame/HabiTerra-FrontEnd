import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import FormField from "../../components/common/FormField";
import PrimaryButton from "../../components/common/PrimaryButton";
import { colors } from "../../shared/theme";

export default function ActivationScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [accepted, setAccepted] = useState(false);
  return (
    <ScreenLayout
      primaryHeader={false}
      header={
        <ScreenHeader
          title="Activation"
          variant="light"
          onBack={() => navigation.goBack()}
        />
      }
    >
      <Text className="mt-5 text-center font-bold text-3xl text-primary">
        HabiTerra
      </Text>
      <Text className="font-bold text-2xl text-text">
        Créez votre mot de passe
      </Text>
      <Text className="font-sans text-sm leading-6 text-muted">
        Choisissez un mot de passe sécurisé pour votre compte.
      </Text>
      <FormField
        label="Nouveau mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        autoCapitalize="none"
      />
      <FormField
        label="Confirmer le mot de passe"
        value={confirmation}
        onChangeText={setConfirmation}
        secureTextEntry
        autoCapitalize="none"
        error={
          confirmation && password !== confirmation
            ? "Les mots de passe ne correspondent pas."
            : undefined
        }
      />
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: accepted }}
        onPress={() => setAccepted(!accepted)}
        className="flex-row items-start gap-3 py-3"
      >
        <Ionicons
          name={accepted ? "checkbox-outline" : "square-outline"}
          size={24}
          color={colors.primary}
        />
        <Text className="flex-1 font-sans text-sm leading-6 text-muted">
          J’accepte les conditions d’utilisation et la politique de
          confidentialité de HabiTerra.
        </Text>
      </Pressable>
      <View className="gap-2">
        <PrimaryButton title="Activer mon compte" disabled />
        <Text className="font-sans text-xs leading-5 text-muted">
          Activation indisponible : le service et les documents légaux ne sont
          pas encore connectés. Aucun consentement n’est transmis.
        </Text>
      </View>
    </ScreenLayout>
  );
}

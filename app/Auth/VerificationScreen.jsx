import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import PrimaryButton from "../../components/common/PrimaryButton";

export default function VerificationScreen({ navigation }) {
  const [code, setCode] = useState("");
  return (
    <ScreenLayout
      primaryHeader={false}
      header={
        <ScreenHeader
          title="Vérification"
          variant="light"
          onBack={() => navigation.goBack()}
        />
      }
    >
      <Text className="mt-5 text-center font-bold text-3xl text-primary">
        HabiTerra
      </Text>
      <Text className="text-center font-semibold text-2xl text-text">
        Code de vérification
      </Text>
      <Text className="text-center font-sans text-sm leading-6 text-muted">
        Aperçu de l’étape de vérification. Aucun code n’a été envoyé.
      </Text>
      <View className="relative flex-row justify-center gap-2">
        {Array.from({ length: 6 }, (_, index) => (
          <View
            key={index}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className="h-12 flex-1 items-center justify-center rounded-xl border border-border bg-surface"
          >
            <Text className="font-semibold text-lg text-text">
              {code[index] ?? ""}
            </Text>
          </View>
        ))}
        <TextInput
          accessibilityLabel="Code de vérification à 6 chiffres"
          value={code}
          onChangeText={(text) => setCode(text.replace(/\D/g, ""))}
          keyboardType="number-pad"
          maxLength={6}
          autoComplete="one-time-code"
          caretHidden
          className="absolute inset-0 opacity-0"
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: true }}
        disabled
        className="items-center py-3 opacity-50"
      >
        <Text className="font-sans text-base text-primary">
          Renvoyer le code
        </Text>
      </Pressable>
      <PrimaryButton title="Confirmer" disabled />
      {__DEV__ && (
        <PrimaryButton
          title="Prévisualiser la création du mot de passe"
          variant="neutral"
          onPress={() => navigation.navigate("Activation")}
        />
      )}
    </ScreenLayout>
  );
}

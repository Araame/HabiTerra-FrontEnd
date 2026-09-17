import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenLayout from "../../components/common/ScreenLayout";
import PrimaryButton from "../../components/common/PrimaryButton";
import { colors } from "../../shared/theme";
import { roleOptions } from "../navigation/navigationConfig";

export default function ProfileChoiceScreen({
  navigation,
  selectedRole,
  onSelectRole,
}) {
  return (
    <ScreenLayout primaryHeader={false}>
      <View className="gap-3 py-8">
        <Text className="font-bold text-3xl text-primary">HabiTerra</Text>
        <Text className="font-bold text-2xl text-text">
          Quel est votre profil ?
        </Text>
        <Text className="font-sans text-sm leading-6 text-muted">
          Choisissez le profil correspondant à votre inscription.
        </Text>
      </View>
      {roleOptions.map(({ value, label, icon }) => (
        <Pressable
          key={value}
          accessibilityRole="radio"
          accessibilityState={{ checked: selectedRole === value }}
          onPress={() => onSelectRole(value)}
          className={`flex-row items-center gap-4 rounded-2xl border p-5 active:opacity-70 ${selectedRole === value ? "border-primary bg-primarySoft" : "border-border bg-surface"}`}
        >
          <Ionicons name={icon} size={26} color={colors.primary} />
          <Text className="flex-1 font-semibold text-base text-text">
            {label}
          </Text>
          <Ionicons
            name={
              selectedRole === value ? "radio-button-on" : "radio-button-off"
            }
            size={22}
            color={colors.primary}
          />
        </Pressable>
      ))}
      <PrimaryButton
        title="Créer un compte"
        onPress={() => navigation.navigate("Register")}
      />
      <PrimaryButton
        title="J’ai déjà un compte"
        variant="outline"
        onPress={() => navigation.navigate("Login")}
      />
      {__DEV__ && (
        <View className="gap-2 border-t border-border pt-5">
          <Text className="font-sans text-xs leading-5 text-muted">
            Développement : consultez les écrans avec leurs données d’exemple,
            sans vous authentifier.
          </Text>
          <PrimaryButton
            title="Ouvrir l’aperçu du profil sélectionné"
            variant="neutral"
            onPress={() =>
              navigation.navigate("Preview", { role: selectedRole })
            }
          />
        </View>
      )}
    </ScreenLayout>
  );
}

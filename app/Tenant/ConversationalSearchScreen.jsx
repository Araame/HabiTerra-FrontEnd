import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import PrimaryButton from "../../components/common/PrimaryButton";
import { colors } from "../../shared/theme";
import { demoAssistantMessage, searchSummary } from "./tenantMocks";

export default function ConversationalSearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  return (
    <ScreenLayout
      inTab
      header={
        <ScreenHeader
          title="Recherche IA"
          subtitle="Décrivez votre logement en langage naturel"
          onBack={() => navigation.navigate("Home")}
          rightAction={
            <Ionicons
              name="sparkles-outline"
              size={22}
              color={colors.surface}
            />
          }
        />
      }
      footer={
        <View className="flex-row items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2">
          <TextInput
            accessibilityLabel="Votre recherche en langage naturel"
            value={query}
            onChangeText={setQuery}
            placeholder="Ex: appartement 2 ch. Almadies…"
            placeholderTextColor={colors.muted}
            className="min-w-0 flex-1 py-2 font-sans text-sm text-text"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Envoyer la recherche"
            accessibilityState={{ disabled: !query.trim() }}
            disabled={!query.trim()}
            onPress={() =>
              Alert.alert(
                "Recherche IA",
                "Cette conversation est un exemple. Le service de recherche conversationnelle n’est pas encore connecté.",
              )
            }
            className={`h-11 w-11 items-center justify-center rounded-full bg-primary ${query.trim() ? "" : "opacity-45"}`}
          >
            <Ionicons
              name="paper-plane-outline"
              size={21}
              color={colors.surface}
            />
          </Pressable>
        </View>
      }
    >
      <Text className="font-medium text-xs text-muted">
        Exemple de conversation
      </Text>
      <View className="flex-row items-start gap-2">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-primary">
          <Ionicons name="sparkles-outline" size={18} color={colors.surface} />
        </View>
        <View className="flex-1 rounded-[20px] bg-surface p-4 shadow-sm">
          <Text className="font-sans text-sm leading-6 text-ink">
            {demoAssistantMessage}
          </Text>
        </View>
      </View>
      <View className="gap-3 rounded-[20px] border border-border bg-surface p-4">
        <Text className="font-bold text-base text-primary">
          Votre recherche
        </Text>
        {searchSummary.map(({ label, value }) => (
          <View key={label} className="flex-row justify-between gap-3">
            <Text className="font-sans text-xs text-muted">{label}</Text>
            <Text className="font-semibold text-xs text-ink">{value}</Text>
          </View>
        ))}
        <PrimaryButton
          title="Voir les logements"
          icon="arrow-forward"
          onPress={() => navigation.navigate("Home")}
        />
      </View>
    </ScreenLayout>
  );
}

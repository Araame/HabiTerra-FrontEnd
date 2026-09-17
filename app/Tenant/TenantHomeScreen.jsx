import { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenLayout from "../../components/common/ScreenLayout";
import Chip from "../../components/common/Chip";
import SectionHeader from "../../components/common/SectionHeader";
import PropertyCard from "../../components/property/PropertyCard";
import PrimaryButton from "../../components/common/PrimaryButton";
import { EmptyState } from "../../components/common/FeedbackStates";
import { colors } from "../../shared/theme";
import { properties } from "./tenantMocks";

export default function TenantHomeScreen({
  navigation,
  authenticated = false,
}) {
  const [filter, setFilter] = useState("Tous");
  const [query, setQuery] = useState("");
  const visible = properties.filter(
    (p) =>
      (filter === "Tous" ||
        (filter === "Colocation" ? p.shared : p.type === filter)) &&
      `${p.title} ${p.location}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <ScreenLayout scroll={false} inTab>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="pb-5"
        ItemSeparatorComponent={() => <View className="h-4" />}
        renderItem={({ item }) => (
          <View className="px-5">
            <PropertyCard
              property={item}
              onPress={() =>
                navigation.navigate("PropertyDetails", { propertyId: item.id })
              }
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            title="Aucun logement trouvé"
            description="Essayez un autre type de logement ou un autre quartier."
          />
        }
        ListHeaderComponent={
          <>
            <View className="gap-4 bg-primary px-5 pb-4 pt-2">
              <View className="flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-surface">
                  <Ionicons
                    name="home-outline"
                    size={21}
                    color={colors.primary}
                  />
                </View>
                <Text className="flex-1 font-semibold text-lg text-text">
                  HabiTerra
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Notifications"
                  onPress={() => navigation.navigate("Notifications")}
                  className="h-11 w-11 items-center justify-center rounded-full bg-surface active:opacity-70"
                >
                  <Ionicons
                    name="notifications-outline"
                    size={23}
                    color={colors.text}
                  />
                </Pressable>
                {!authenticated && (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      navigation.navigate("Auth", { screen: "Login" })
                    }
                    className="rounded-full bg-surface px-3 py-2 active:opacity-70"
                  >
                    <Text className="font-semibold text-xs text-text">
                      Connexion
                    </Text>
                  </Pressable>
                )}
              </View>
              <Text className="font-bold text-[25px] leading-8 text-surface">
                Trouvez votre{"\n"}logement idéal
              </Text>
              <View className="overflow-hidden rounded-[18px] bg-surface">
                <View className="min-h-[56px] flex-row items-center gap-3 px-4">
                  <Ionicons
                    name="search-outline"
                    size={20}
                    color={colors.text}
                  />
                  <TextInput
                    accessibilityLabel="Rechercher un logement"
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Que recherchez-vous ?"
                    placeholderTextColor={colors.muted}
                    className="min-w-0 flex-1 py-3 font-sans text-sm text-text"
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Recherche vocale"
                    onPress={() =>
                      Alert.alert(
                        "Recherche vocale",
                        "La saisie vocale sera disponible lors de son intégration. Vous pouvez saisir votre recherche.",
                      )
                    }
                    className="h-10 w-10 items-center justify-center rounded-full bg-primarySoft"
                  >
                    <Ionicons
                      name="mic-outline"
                      size={18}
                      color={colors.text}
                    />
                  </Pressable>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => navigation.navigate("Search")}
                  className="flex-row items-center gap-2 border-t border-secondary px-4 py-3 active:opacity-60"
                >
                  <Ionicons
                    name="sparkles-outline"
                    size={18}
                    color={colors.primary}
                  />
                  <Text className="font-medium text-xs text-text">
                    Décrivez votre logement
                  </Text>
                </Pressable>
              </View>
            </View>
            <View className="gap-4 pb-3 pt-10">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2 px-5"
              >
                {["Tous", "Appartement", "Studio", "Villa", "Colocation"].map(
                  (label) => (
                    <Chip
                      key={label}
                      label={label}
                      selected={filter === label}
                      onPress={() => setFilter(label)}
                    />
                  ),
                )}
              </ScrollView>
              <View className="px-5">
                <SectionHeader
                  title="Logements proposés"
                  actionLabel="Voir tout"
                  onActionPress={() => {
                    setFilter("Tous");
                    setQuery("");
                  }}
                />
              </View>
            </View>
          </>
        }
        ListFooterComponent={
          <View className="mt-5 px-5">
            <PrimaryButton
              title="Rechercher"
              onPress={() => navigation.navigate("Search")}
            />
          </View>
        }
      />
    </ScreenLayout>
  );
}

import { useState } from "react";
import { FlatList, ScrollView, Text, TextInput, View } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import Chip from "../../components/common/Chip";
import InfoCard from "../../components/common/InfoCard";
import { EmptyState } from "../../components/common/FeedbackStates";
import ManagedPropertyCard from "../../components/property/ManagedPropertyCard";
import { owners, properties } from "./agencyMocks";
import { colors } from "../../shared/theme";

// Property portfolio screen
export default function PortfolioScreen({ navigation, route }) {
  const [owner, setOwner] = useState(null);
  const [status, setStatus] = useState("Tous");
  const [query, setQuery] = useState("");
  const visible = properties.filter(
    (p) =>
      (!owner || p.owner === owner) &&
      (status === "Tous" || p.status === status) &&
      `${p.reference} ${p.location}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <ScreenLayout
      inTab
      scroll={false}
      header={
        <ScreenHeader
          title="Portefeuille"
          onBack={() => navigation.getParent().navigate("AgencyHome")}
        />
      }
    >
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-4 p-5"
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View className="gap-4">
            {route.params?.selectForTenant && (
              <InfoCard
                description="Choisissez un bien pour préparer l’ajout de son locataire."
                variant="neutral"
              />
            )}
            <Text className="font-bold text-sm text-text">
              FILTRER PAR BAILLEUR
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {owners.map((name) => (
                <Chip
                  variant="neutral"
                  key={name}
                  label={name}
                  count={properties.filter((p) => p.owner === name).length}
                  selected={owner === name}
                  onPress={() => setOwner(owner === name ? null : name)}
                />
              ))}
            </View>
            <TextInput
              accessibilityLabel="Rechercher par référence ou quartier"
              placeholder="Référence, quartier…"
              placeholderTextColor={colors.muted}
              value={query}
              onChangeText={setQuery}
              className="rounded-2xl bg-secondary p-4 font-sans text-sm text-ink"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2"
            >
              {[
                "Tous",
                "Brouillon",
                "Disponible",
                "Publié",
                "Candidatures",
                "Occupé",
              ].map((label) => (
                <Chip
                  variant="neutral"
                  key={label}
                  label={label}
                  selected={status === label}
                  onPress={() => setStatus(label)}
                />
              ))}
            </ScrollView>
            <Text className="font-sans text-xs text-muted">
              {visible.length} bien{visible.length > 1 ? "s" : ""}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ManagedPropertyCard
            property={item}
            onPress={() => {
              navigation.setParams({ selectForTenant: false });
              navigation.navigate("ManagedPropertyDetails", {
                propertyId: item.id,
              });
            }}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Aucun bien trouvé"
            description="Modifiez vos filtres ou votre recherche."
          />
        }
      />
    </ScreenLayout>
  );
}

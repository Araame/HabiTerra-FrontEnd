import { useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import Chip from "../../components/common/Chip";
import ApplicationCard from "../../components/property/ApplicationCard";
import { EmptyState } from "../../components/common/FeedbackStates";
import { applications } from "./agencyMocks";

const filters = [
  { label: "Toutes", status: null },
  { label: "Nouvelles", status: "Nouvelle" },
  { label: "En cours", status: "En cours" },
  { label: "Acceptées", status: "Acceptée" },
  { label: "Refusées", status: "Refusée" },
];

export default function ApplicationsScreen({ navigation, route }) {
  const [status, setStatus] = useState(null);
  const propertyId = route.params?.propertyId;
  const visible = applications.filter(
    (item) =>
      (!status || item.status === status) &&
      (!propertyId || item.propertyId === propertyId),
  );
  return (
    <ScreenLayout
      inTab
      scroll={false}
      header={
        <ScreenHeader title="Candidatures" onBack={() => navigation.goBack()} />
      }
    >
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-4 p-5"
        ListHeaderComponent={
          <View className="gap-3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2"
            >
              {filters.map((filter) => (
                <Chip
                  variant="neutral"
                  key={filter.label}
                  label={filter.label}
                  selected={status === filter.status}
                  onPress={() => setStatus(filter.status)}
                />
              ))}
            </ScrollView>
            {propertyId && (
              <Text className="font-sans text-xs text-muted">
                Candidatures du bien {propertyId.toUpperCase()}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <ApplicationCard
            application={item}
            onPress={() =>
              navigation.navigate("ApplicationDetails", {
                applicationId: item.id,
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Aucune candidature"
            description="Aucune candidature ne correspond aux filtres."
          />
        }
      />
    </ScreenLayout>
  );
}

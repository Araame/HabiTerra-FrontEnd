import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import SectionHeader from "../../components/common/SectionHeader";
import InfoCard from "../../components/common/InfoCard";
import PrimaryButton from "../../components/common/PrimaryButton";
import NearbyPlaceItem from "../../components/property/NearbyPlaceItem";
import { colors } from "../../shared/theme";
import { getProperty, nearbyPlaces } from "./tenantMocks";

export default function LocationColocationScreen({
  navigation,
  route,
  authenticated = false,
}) {
  const property = getProperty(route.params?.propertyId);
  return (
    <ScreenLayout
      primaryHeader={false}
      header={
        <ScreenHeader
          title="Localisation & Colocation"
          subtitle={property.location}
          variant="light"
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <PrimaryButton
          title="Candidater"
          icon="arrow-forward"
          onPress={() =>
            authenticated
              ? navigation.navigate("TenantProfile", {
                  propertyId: property.id,
                  applicationFlow: true,
                })
              : navigation.navigate("Auth", {
                  screen: "ProfileChoice",
                  returnTo: { name: "Application", propertyId: property.id },
                })
          }
        />
      }
    >
      {["Quartier sécurisé", "Accès facile aux axes principaux"].map(
        (label) => (
          <View
            key={label}
            className="flex-row items-center gap-3 rounded-[20px] bg-surface p-4 shadow-sm"
          >
            <View className="h-8 w-8 items-center justify-center rounded-xl bg-primarySoft">
              <Ionicons name="checkmark" size={20} color={colors.text} />
            </View>
            <Text className="flex-1 font-sans text-sm text-text">{label}</Text>
          </View>
        ),
      )}
      <SectionHeader title="À proximité" />
      <View className="overflow-hidden rounded-[20px] bg-surface">
        {nearbyPlaces.map((place) => (
          <NearbyPlaceItem key={place.name} {...place} />
        ))}
      </View>
      <SectionHeader title="Règles de colocation" />
      <InfoCard
        title={property.shared ? "Colocation autorisée" : "Logement individuel"}
        description={
          property.shared
            ? "Jusqu'à 3 personnes · Capacité totale : 4"
            : "Colocation non proposée pour ce logement."
        }
      />
    </ScreenLayout>
  );
}

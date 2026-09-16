import { useState } from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenLayout from "../../components/common/ScreenLayout";
import StatusBadge from "../../components/common/StatusBadge";
import SectionHeader from "../../components/common/SectionHeader";
import InfoCard from "../../components/common/InfoCard";
import PrimaryButton from "../../components/common/PrimaryButton";
import NearbyPlaceItem from "../../components/property/NearbyPlaceItem";
import { getProperty, nearbyPlaces } from "./tenantMocks";
import { colors } from "../../shared/theme";

export default function PropertyDetailsScreen({ navigation, route }) {
  const property = getProperty(route.params?.propertyId);
  const [favorite, setFavorite] = useState(false);
  return (
    <ScreenLayout primaryHeader={false}>
      <View className="-mx-5 -mt-5">
        <ImageBackground
          source={property.image}
          className="aspect-[1.74] flex-row items-start justify-between p-3"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retour"
            onPress={() => navigation.goBack()}
            className="h-11 w-11 items-center justify-center rounded-full bg-surface"
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Favori"
            accessibilityState={{ selected: favorite }}
            onPress={() => setFavorite(!favorite)}
            className="h-11 w-11 items-center justify-center rounded-full bg-primarySoft"
          >
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={24}
              color={colors.text}
            />
          </Pressable>
        </ImageBackground>
      </View>
      <StatusBadge label={property.status} />
      <Text className="font-bold text-[22px] leading-7 text-primary">
        {property.title}
      </Text>
      <View className="flex-row items-center gap-1">
        <Ionicons name="location-outline" size={18} color={colors.muted} />
        <Text className="font-sans text-sm text-muted">
          {property.location}
        </Text>
      </View>
      <Text className="py-2 font-bold text-2xl text-primary">
        {property.price}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {[
          `${property.bedrooms} chambres`,
          `${property.area} m²`,
          property.type,
        ].map((label) => (
          <View
            key={label}
            className="min-w-[90px] flex-1 items-center rounded-full bg-secondary px-3 py-3"
          >
            <Text className="font-medium text-xs text-text">{label}</Text>
          </View>
        ))}
      </View>
      <View className="mt-4 gap-2">
        <SectionHeader title="Description" />
        <Text className="font-sans text-sm leading-6 text-muted">
          {property.description}
        </Text>
      </View>
      <SectionHeader
        title="Avantages géographiques"
        actionLabel="Voir tout"
        onActionPress={() =>
          navigation.navigate("LocationColocation", { propertyId: property.id })
        }
      />
      <View className="overflow-hidden rounded-[20px] bg-surface shadow-sm">
        {nearbyPlaces.slice(0, 3).map((place) => (
          <NearbyPlaceItem key={place.name} {...place} compact />
        ))}
      </View>
      <View className="gap-2">
        <SectionHeader title="Colocation" />
        <InfoCard
          title={
            property.shared ? "Colocation autorisée" : "Logement individuel"
          }
          description={
            property.shared
              ? "Capacité max : 3 personnes"
              : "Colocation non proposée pour ce logement."
          }
        />
      </View>
      <PrimaryButton
        title="Candidater"
        icon="arrow-forward"
        onPress={() =>
          navigation.navigate("LocationColocation", { propertyId: property.id })
        }
      />
    </ScreenLayout>
  );
}

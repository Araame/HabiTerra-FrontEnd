import { Image, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import StatusBadge from "../common/StatusBadge";
import { colors } from "../../shared/theme";

export default function ManagedPropertyCard({ property, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${property.reference}, ${property.location}`}
      onPress={onPress}
      className="overflow-hidden rounded-[20px] bg-surface shadow-sm active:opacity-80"
    >
      {property.image ? (
        <Image source={property.image} className="aspect-[2.5] w-full" />
      ) : (
        <View className="aspect-[2.5] items-center justify-center gap-2 bg-border">
          <Ionicons name="business-outline" size={32} color={colors.muted} />
          <Text className="font-sans text-sm text-muted">Aucune photo</Text>
        </View>
      )}
      <View className="gap-2 p-4">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="font-bold text-lg text-ink">
            {property.reference}
          </Text>
          <StatusBadge label={property.status} variant={property.tone} />
        </View>
        <Text className="font-sans text-sm text-muted">
          {property.location}
        </Text>
        <Text className="font-bold text-lg text-primary">
          {property.rentLabel}
        </Text>
        <Text className="font-sans text-xs text-muted">{property.owner}</Text>
      </View>
    </Pressable>
  );
}

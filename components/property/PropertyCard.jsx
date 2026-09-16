import { ImageBackground, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import StatusBadge from "../common/StatusBadge";
import { colors } from "../../shared/theme";


// Property presentation card component
export default function PropertyCard({ property, onPress }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${property.title}, ${property.price}`} onPress={onPress} className="overflow-hidden rounded-[20px] bg-surface shadow-sm active:opacity-80">
      <ImageBackground source={property.image} resizeMode="cover" className="aspect-[1.82] justify-between p-3">
        <View className="flex-row flex-wrap justify-between gap-2">
          <StatusBadge label={property.status} />
          {property.shared && (
            <StatusBadge label="Colocation" variant="shared" />
          )}
        </View>
        <Text className="self-start rounded-lg bg-text/60 px-1 font-bold text-lg text-surface">
          {property.price}
        </Text>
      </ImageBackground>
      <View className="gap-2 p-3">
        <Text className="font-semibold text-sm text-text">
          {property.title}
        </Text>
        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={14} color={colors.muted} />
          <Text className="font-sans text-xs text-muted">
            {property.location}
          </Text>
        </View>
        <View className="flex-row gap-4">
          {[
            ["bed-outline", `${property.bedrooms} ch.`],
            ["resize-outline", `${property.area} m²`],
            ["eye-outline", property.views],
          ].map(([icon, value]) => (
            <View key={icon} className="flex-row items-center gap-1">
              <Ionicons name={icon} size={13} color={colors.muted} />
              <Text className="font-sans text-xs text-muted">{value}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

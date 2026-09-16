import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../shared/theme";

// Nearby place item component
export default function NearbyPlaceItem({
  name,
  distance,
  icon = "location-outline",
  compact = false,
}) {
  return (
    <View className="min-h-[60px] flex-row items-center gap-3 border-b border-secondary px-4 py-3">
      <View className={`h-8 w-8 items-center justify-center rounded-full ${compact ? "bg-secondary" : "bg-primarySoft"}`}>
        <Ionicons name={icon} size={17} color={colors.text} />
      </View>
      <Text className="flex-1 font-sans text-sm text-text">{name}</Text>
      <Text className={`font-medium text-xs ${compact ? "text-muted" : "rounded-full bg-primarySoft px-2 py-1 text-text"}`}>
        {distance}
      </Text>
    </View>
  );
}

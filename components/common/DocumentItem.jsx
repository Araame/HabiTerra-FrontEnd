import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../shared/theme";

export default function DocumentItem({
  title,
  metadata,
  actionIcon = "download-outline",
  actionLabel = "Télécharger",
  onAction,
}) {
  return (
    <View className="flex-row items-center gap-3 rounded-[20px] bg-surface p-4">
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-secondary">
        <Ionicons name="document-text-outline" size={25} color={colors.text} />
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-semibold text-sm text-ink">{title}</Text>
        <Text className="font-sans text-xs text-muted">{metadata}</Text>
      </View>
      {onAction && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel} ${title}`}
          onPress={onAction}
          className="h-11 w-11 items-center justify-center rounded-full active:opacity-60"
        >
          <Ionicons name={actionIcon} size={22} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

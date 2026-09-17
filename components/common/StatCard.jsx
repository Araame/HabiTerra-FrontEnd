import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../shared/theme";

export default function StatCard({
  value,
  label,
  icon,
  highlighted = false,
  compact = false,
  onPress,
}) {
  const Container = onPress ? Pressable : View;
  return (
    <Container
      onPress={onPress}
      accessibilityRole={onPress ? "button" : undefined}
      className={`gap-2 rounded-2xl border p-4 ${compact ? "flex-1 items-center" : "min-h-[110px] w-[48%]"} ${highlighted ? "border-primary bg-primary" : "border-border bg-surface"}`}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={22}
          color={highlighted ? colors.surface : colors.muted}
        />
      )}
      <Text
        className={`font-bold ${compact ? "text-base" : "text-2xl"} ${highlighted ? "text-surface" : "text-ink"}`}
      >
        {value}
      </Text>
      <Text
        className={`font-sans text-xs ${highlighted ? "text-surface" : "text-muted"}`}
      >
        {label}
      </Text>
    </Container>
  );
}

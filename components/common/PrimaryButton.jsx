import { ActivityIndicator, Pressable, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../shared/theme";

// Primary button component
export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  fullWidth = true,
  variant = "primary",
}) {
  const blocked = disabled || loading;
  const styles = {
    primary: ["border-primary bg-primary", "text-surface", colors.surface],
    outline: ["border-primary bg-surface", "text-primary", colors.primary],
    neutral: ["border-border bg-secondary", "text-ink", colors.ink],
    dark: ["border-ink bg-ink", "text-surface", colors.surface],
    darkOutline: ["border-ink bg-surface", "text-ink", colors.ink],
    danger: ["border-danger bg-danger", "text-surface", colors.surface],
  };
  const [containerClass, textClass, color] = styles[variant] ?? styles.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: blocked, busy: loading }}
      disabled={blocked}
      onPress={onPress}
      className={`min-h-[52px] flex-row items-center justify-center gap-2 rounded-2xl border px-4 py-4 active:opacity-80 ${fullWidth ? "w-full" : "self-start"} ${containerClass} ${blocked ? "opacity-50" : ""}`}
    >
      {loading && <ActivityIndicator color={color} />}
      <Text className={`shrink text-center font-bold text-base ${textClass}`}>
        {title}
      </Text>
      {icon && !loading && <Ionicons name={icon} size={20} color={color} />}
    </Pressable>
  );
}

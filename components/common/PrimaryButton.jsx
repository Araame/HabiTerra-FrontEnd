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
  const outlined = variant === "outline";
  const blocked = disabled || loading;
  const color = outlined ? colors.primary : colors.surface;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: blocked, busy: loading }} disabled={blocked} onPress={onPress} className={`min-h-[52px] flex-row items-center justify-center gap-2 rounded-2xl border px-4 py-4 active:opacity-80 ${fullWidth ? "w-full" : "self-start"} ${outlined ? "border-primary bg-surface" : "border-primary bg-primary"} ${blocked ? "opacity-45" : ""}`}>
      {loading && <ActivityIndicator color={color} />}
      <Text className={`shrink text-center font-bold text-base ${outlined ? "text-primary" : "text-surface"}`}>
        {title}
      </Text>
      {icon && !loading && <Ionicons name={icon} size={20} color={color} />}
    </Pressable>
  );
}

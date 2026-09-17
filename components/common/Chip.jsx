import { Pressable, Text } from "react-native";

// Chip component for filter
export default function Chip({
  label,
  selected = false,
  onPress,
  disabled = false,
  variant = "filter",
  count,
}) {
  const duration = variant === "duration";
  const neutral = variant === "neutral";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`items-center justify-center rounded-full border px-4 py-2.5 active:opacity-60 ${duration ? "min-h-[44px] flex-1" : ""} ${selected ? "border-primary bg-primary" : duration ? "border-beigeBorder bg-surface" : neutral ? "border-secondary bg-secondary" : "border-border bg-surface"} ${disabled ? "opacity-50" : ""}`}
    >
      <Text
        className={`font-medium ${duration ? "text-[15px]" : "text-xs"} ${selected ? "text-surface" : duration ? "text-text" : neutral ? "text-muted" : "text-primary"}`}
      >
        {label}
        {count === undefined ? "" : ` ${count}`}
      </Text>
    </Pressable>
  );
}

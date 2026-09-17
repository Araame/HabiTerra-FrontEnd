import { Text, View } from "react-native";

// StatusBadge component variants
const variants = {
  default: ["bg-text", "text-surface"],
  shared: ["bg-olive", "text-surface"],
  pending: ["bg-primarySoft", "text-primary"],
  success: ["bg-positiveSoft", "text-positive"],
  warning: ["bg-warningSoft", "text-warning"],
  danger: ["bg-dangerSoft", "text-danger"],
  info: ["bg-infoSoft", "text-info"],
  neutral: ["bg-secondary", "text-muted"],
};

// Status badge component
export default function StatusBadge({ label, variant = "default" }) {
  const [background, foreground] = variants[variant] ?? variants.default;
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${background}`}>
      <Text className={`font-medium text-xs ${foreground}`}>{label}</Text>
    </View>
  );
}

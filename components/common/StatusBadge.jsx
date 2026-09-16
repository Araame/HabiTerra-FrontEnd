import { Text, View } from "react-native";

// StatusBadge component variants
const variants = {
  default: "bg-text",
  shared: "bg-olive",
  pending: "bg-primarySoft",
};

// Status badge component
export default function StatusBadge({ label, variant = "default" }) {
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${variants[variant] ?? variants.default}`}>
      <Text className={`font-medium text-xs ${variant === "pending" ? "text-primary" : "text-surface"}`}>
        {label}
      </Text>
    </View>
  );
}

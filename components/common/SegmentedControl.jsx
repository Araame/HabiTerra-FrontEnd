import { Pressable, Text, View } from "react-native";

// Segmented control component
export default function SegmentedControl({
  options,
  selectedValue,
  onChange,
  variant = "pill",
}) {
  const underline = variant === "underline";
  return (
    <View
      className={
        underline
          ? "flex-row border-b border-border bg-surface"
          : "flex-row rounded-full bg-secondary p-1"
      }
    >
      {options.map(({ value, label }) => (
        <Pressable
          key={value}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === selectedValue }}
          onPress={() => onChange(value)}
          className={`flex-1 items-center px-1 py-4 active:opacity-70 ${underline ? `border-b-2 ${value === selectedValue ? "border-primary" : "border-transparent"}` : `rounded-full ${value === selectedValue ? "bg-surface shadow-sm" : ""}`}`}
        >
          <Text className="font-semibold text-sm text-text">{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

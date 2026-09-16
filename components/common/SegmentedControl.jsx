import { Pressable, Text, View } from "react-native";

// Segmented control component
export default function SegmentedControl({ options, selectedValue, onChange }) {
  return (
    <View className="flex-row rounded-full bg-secondary p-1">
      {options.map(({ value, label }) => (
        <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: value === selectedValue }} onPress={() => onChange(value)} className={`flex-1 items-center rounded-full px-2 py-3 active:opacity-70 ${value === selectedValue ? "bg-surface shadow-sm" : ""}`}>
          <Text className="font-semibold text-sm text-text">{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

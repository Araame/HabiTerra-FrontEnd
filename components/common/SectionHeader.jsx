import { Pressable, Text, View } from "react-native";

// Header section component
export default function SectionHeader({ title, actionLabel, onActionPress }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text accessibilityRole="header" className="flex-1 font-bold text-base text-text">
        {title}
      </Text>
      {actionLabel && onActionPress && (
        <Pressable accessibilityRole="button" onPress={onActionPress} hitSlop={10} className="py-2 active:opacity-60">
          <Text className="font-medium text-xs text-text">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

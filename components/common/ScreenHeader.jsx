import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../shared/theme";


// Header top bar component
export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightAction,
  variant = "primary",
}) {
  const primary = variant === "primary";
  return (
    <View className={`min-h-[64px] flex-row items-center gap-3 px-4 py-3 ${primary ? "bg-primary" : "border-b border-border bg-surface"}`}>
      {onBack && (
        <Pressable accessibilityRole="button" accessibilityLabel="Retour" onPress={onBack} className={`h-11 w-11 items-center justify-center rounded-full active:opacity-60 ${primary ? "bg-surface" : "bg-primarySoft"}`}>
          <Ionicons name="arrow-back" size={24} color={primary ? colors.primary : colors.text}/>
        </Pressable>
      )}
      <View className="flex-1 gap-1">
        <Text accessibilityRole="header" className={`font-bold text-[18px] ${primary ? "text-surface" : "text-text"}`}>
          {title}
        </Text>
        {subtitle && (
          <Text className={`font-sans text-[13px] leading-5 ${primary ? "text-surface" : "text-muted"}`}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightAction}
    </View>
  );
}

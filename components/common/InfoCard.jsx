import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../shared/theme";


// Card component
export default function InfoCard({
  title,
  description,
  icon,
  variant = "soft",
}) {
  const primary = variant === "primary";
  return (
    <View className={`flex-row gap-2 rounded-[20px] p-4 ${primary ? "bg-primary" : "bg-primarySoft"}`}>
      {icon && (
        <Ionicons name={icon} size={20} color={primary ? colors.surface : colors.primary}/>
      )}
      <View className="flex-1 gap-1">
        {title && (
          <Text className={`font-bold text-base ${primary ? "text-surface" : "text-primary"}`}>
            {title}
          </Text>
        )}
        <Text className={`font-sans text-[13px] leading-5 ${primary ? "text-surface" : "text-text"}`}>
          {description}
        </Text>
      </View>
    </View>
  );
}

import { Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../shared/theme";


// Form field component
export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
  error,
  disabled = false,
  required = false,
  multiline = false,
  maxLength,
  icon,
  variant = "default",
  ...inputProps
}) {
  return (
    <View className="gap-2">
      <Text className="font-semibold text-[13px] text-text">
        {label}
        {required ? " *" : ""}
      </Text>
      <View className={`flex-row items-center rounded-[18px] border bg-surface px-4 ${error ? "border-danger" : variant === "warm" ? "border-beigeBorder" : "border-border"} ${disabled ? "opacity-50" : ""}`}>
        <TextInput
          {...inputProps} accessibilityLabel={label} accessibilityState={{ disabled }} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} keyboardType={keyboardType} secureTextEntry={secureTextEntry} editable={!disabled} multiline={multiline} maxLength={maxLength} textAlignVertical={multiline ? "top" : "center"} className={`min-w-0 flex-1 font-sans text-[15px] text-text ${multiline ? "min-h-[104px] py-3" : "min-h-[48px] py-2"}`}/>
        {icon && <Ionicons name={icon} size={20} color={colors.ink} />}
      </View>
      {error && (
        <Text accessibilityRole="alert" className="font-sans text-xs text-danger">
          {error}
        </Text>
      )}
    </View>
  );
}

import { Text, View } from "react-native";
import FormField from "./FormField";

// Textarea field component
export default function TextAreaField({
  value = "",
  maxLength = 500,
  ...props
}) {
  return (
    <View className="gap-2">
      <FormField {...props} value={value} maxLength={maxLength} multiline variant="warm"/>
      <Text className="font-sans text-[13px] text-muted">
        {value.length}/{maxLength} caractères
      </Text>
    </View>
  );
}

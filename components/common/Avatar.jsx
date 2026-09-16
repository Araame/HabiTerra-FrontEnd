import { Image, Text, View } from "react-native";

// User avatar component
export default function Avatar({ image, name = "" }) {
  return (
    <View className="h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border bg-surface">
      {image ? (
        <Image
          source={image}
          accessibilityLabel={name}
          className="h-full w-full"
        />
      ) : (
        <Text className="font-bold text-2xl text-primary">
          {name.trim().charAt(0).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

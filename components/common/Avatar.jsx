import { Image, Text, View } from "react-native";

// User avatar component
export default function Avatar({
  image,
  name = "",
  initials,
  size = "large",
  variant = "light",
}) {
  const sizes = { small: "h-9 w-9", medium: "h-12 w-12", large: "h-20 w-20" };
  return (
    <View
      className={`items-center justify-center overflow-hidden rounded-full border ${sizes[size] ?? sizes.large} ${variant === "primary" ? "border-primary bg-primary" : "border-border bg-surface"}`}
    >
      {image ? (
        <Image
          source={image}
          accessibilityLabel={name}
          className="h-full w-full"
        />
      ) : (
        <Text
          className={`font-bold ${size === "large" ? "text-2xl" : "text-base"} ${variant === "primary" ? "text-surface" : "text-primary"}`}
        >
          {initials ?? name.trim().charAt(0).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

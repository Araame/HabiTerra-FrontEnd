import { Image, Pressable, Text, View } from "react-native";

// Property detail card component
export default function PropertyMiniCard({
  image,
  title,
  location,
  price,
  onPress,
  introduction,
}) {
  const Container = onPress ? Pressable : View;
  return (
    <Container onPress={onPress} accessibilityRole={onPress ? "button" : undefined} className={`flex-row items-center gap-3 rounded-[20px] p-3 shadow-sm ${introduction ? "bg-secondary" : "bg-surface"}`}>
      <Image source={image} accessibilityLabel={title} className={`${introduction ? "h-10 w-10" : "h-20 w-20"} rounded-2xl`}/>
      <View className="flex-1 gap-1">
        <Text className="font-semibold text-sm text-text">
          {introduction}
          {title}
        </Text>
        {!introduction && (
          <>
            <Text className="font-sans text-[13px] text-muted">{location}</Text>
            <Text className="font-bold text-sm text-text">{price}</Text>
          </>
        )}
      </View>
    </Container>
  );
}

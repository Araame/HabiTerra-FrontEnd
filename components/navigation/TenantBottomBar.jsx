import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../shared/theme";


// Bottom bar widget
export default function TenantBottomBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-background pt-3"
      style={{
        paddingBottom: insets.bottom + 16,
        paddingLeft: insets.left + 20,
        paddingRight: insets.right + 20,
      }}
    >
      <View className="h-[72px] flex-row items-center rounded-full bg-surface px-2 shadow-sm">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const active = state.index === index;
          const label = options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            //If active tab is pressed, don't change screen
            if (!active && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              onPress={onPress}
              onLongPress={() => navigation.emit({ type: "tabLongPress", target: route.key })}
              className="h-full flex-1 items-center justify-center rounded-full active:opacity-60">
              <View
                className={`h-8 w-12 items-center justify-center rounded-full ${active ? "bg-primarySoft" : "bg-transparent"}`}>
                <Ionicons
                  name={options.tenantIcon}
                  size={23}
                  color={active ? colors.primary : colors.muted}/>
              </View>
              <Text
                maxFontSizeMultiplier={1.2}
                numberOfLines={1}
                className={`mt-1 font-medium text-[11px] ${active ? "text-primary" : "text-muted"}`}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

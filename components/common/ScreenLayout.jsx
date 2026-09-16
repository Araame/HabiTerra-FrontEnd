import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


// Screen layout component
export default function ScreenLayout({
  children,
  header,
  footer,
  scroll = true,
  primaryHeader = true,
  inTab = false,
}) {
  const insets = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(0);
  return (
    <View className={`flex-1 ${primaryHeader ? "bg-primary" : "bg-background"}`}
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
      {header && (
        <View onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>
          {header}
        </View>
      )}
      <KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={insets.top + headerHeight}>
        {scroll ? (
          <ScrollView contentContainerClassName="grow gap-5 p-5" keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" automaticallyAdjustKeyboardInsets={false}>
            {children}
          </ScrollView>
        ) : (
          children
        )}
        {footer && (
          <View className="border-t border-border bg-surface px-5 py-3">
            {footer}
          </View>
        )}
        {!inTab && (
          <View className={footer ? "bg-surface" : "bg-background"} style={{ height: insets.bottom }}/>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

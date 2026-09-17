import { Pressable, Text, View } from "react-native";
import Avatar from "../common/Avatar";
import StatusBadge from "../common/StatusBadge";


// Application Card component
export default function ApplicationCard({ application, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-start gap-3 rounded-[20px] bg-surface p-4 shadow-sm active:opacity-80"
    >
      <Avatar
        name={application.name}
        initials={application.initials}
        size="medium"
        variant="primary"
      />
      <View className="flex-1 gap-2">
        <Text className="font-bold text-base text-ink">{application.name}</Text>
        <Text className="font-sans text-xs text-muted">{application.date}</Text>
        <Text className="font-sans text-xs text-muted">
          {application.propertyLabel}
        </Text>
      </View>
      <StatusBadge label={application.status} variant={application.tone} />
    </Pressable>
  );
}

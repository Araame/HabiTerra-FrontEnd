import { Pressable, Text, View } from "react-native";
import StatusBadge from "../common/StatusBadge";

// Payment card component
export default function PaymentCard({payment, onOpenDossier, onRemind, compact = false,}) {
  return (
    <View className="gap-3 rounded-[20px] bg-surface p-4 shadow-sm">
      <View className="flex-row justify-between gap-2">
        <Text className="flex-1 font-bold text-base text-ink">
          {payment.period}
        </Text>
        <StatusBadge label={payment.status} variant={payment.tone} />
      </View>
      {!compact && (
        <View className="gap-1">
          <Text className="font-sans text-xs text-muted">
            {payment.propertyLabel}
          </Text>
          <Text className="font-medium text-sm text-primary">
            {payment.owner}
          </Text>
          <Text className="font-sans text-sm text-muted">{payment.tenant}</Text>
        </View>
      )}
      <Text className="font-bold text-xl text-ink">{payment.amount}</Text>
      <Text className="font-sans text-xs text-muted">
        Échéance : {payment.due}
      </Text>
      {(onRemind || onOpenDossier) && (
        <View className="flex-row justify-end gap-4">
          {onRemind && (
            <Pressable
              accessibilityRole="button"
              onPress={onRemind}
              className="rounded-full bg-secondary px-3 py-2">
              <Text className="font-semibold text-sm text-primary">
                Relancer
              </Text>
            </Pressable>
          )}
          {onOpenDossier && (
            <Pressable accessibilityRole="button" onPress={onOpenDossier} className="py-2">
              <Text className="font-medium text-sm text-muted">Dossier</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

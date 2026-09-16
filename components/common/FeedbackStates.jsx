import { ActivityIndicator, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import PrimaryButton from "./PrimaryButton";
import { colors } from "../../shared/theme";

// Loading component
export function LoadingState({ message = "Chargement…" }) {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      <ActivityIndicator color={colors.primary} />
      <Text className="font-sans text-muted">{message}</Text>
    </View>
  );
}

// Empty state component
export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      <Ionicons name="file-tray-outline" size={36} color={colors.muted} />
      <Text className="text-center font-semibold text-lg text-text">
        {title}
      </Text>
      {description && (
        <Text className="text-center font-sans text-sm leading-6 text-muted">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <PrimaryButton title={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}

// Personnalized error component
export function ErrorState({ message = "Une erreur est survenue.", onRetry }) {
  return (
    <EmptyState title="Impossible de charger le contenu" description={message} actionLabel="Réessayer" onAction={onRetry}/>
  );
}

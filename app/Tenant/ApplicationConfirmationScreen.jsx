import { Image, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenLayout from "../../components/common/ScreenLayout";
import PrimaryButton from "../../components/common/PrimaryButton";
import StatusBadge from "../../components/common/StatusBadge";
import { getProperty } from "./tenantMocks";
import { colors } from "../../shared/theme";

export default function ApplicationConfirmationScreen({ navigation, route }) {
  const property = getProperty(route.params?.propertyId);
  return (
    <ScreenLayout primaryHeader={false}>
      <Text className="text-center font-medium text-xs text-muted">
        Aperçu de démonstration — aucun dossier transmis
      </Text>
      <View className="items-center gap-5 py-5">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-successSoft">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-success">
              <Ionicons name="checkmark" size={28} color={colors.surface} />
            </View>
          </View>
        </View>
        <Text className="text-center font-bold text-[25px] text-ink">
          Candidature envoyée !
        </Text>
        <Text className="text-center font-sans text-sm leading-6 text-muted">
          Votre candidature a bien été transmise au propriétaire. Vous serez
          contacté dans les 48h.
        </Text>
      </View>
      <View className="overflow-hidden rounded-[20px] bg-surface shadow-sm">
        <Image source={property.image} className="aspect-[2.65] w-full" />
        <View className="gap-3 p-4">
          <Text className="font-bold text-base text-ink">{property.title}</Text>
          <Text className="font-sans text-sm text-muted">
            {property.location}
          </Text>
          <View className="flex-row items-end justify-between gap-2 border-t border-secondary pt-4">
            <View className="flex-1 gap-1">
              <Text className="font-sans text-xs text-muted">Envoyée le</Text>
              <Text className="font-semibold text-xs text-ink">
                Mardi 8 Septembre 2026
              </Text>
            </View>
            <View className="items-end gap-1">
              <Text className="font-sans text-xs text-muted">Statut</Text>
              <StatusBadge label="En attente" variant="pending" />
            </View>
          </View>
        </View>
      </View>
      <PrimaryButton
        title="Voir mes notifications"
        onPress={() => navigation.navigate("Notifications")}
      />
      <PrimaryButton
        title="Voir d’autres logements"
        variant="outline"
        onPress={() => navigation.popTo("TenantTabs", { screen: "Home" })}
      />
    </ScreenLayout>
  );
}

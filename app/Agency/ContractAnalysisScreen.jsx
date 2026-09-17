import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import PrimaryButton from "../../components/common/PrimaryButton";
import { analysisSteps } from "./agencyMocks";
import { colors } from "../../shared/theme";

// Contract analysis screen
export default function ContractAnalysisScreen({ navigation, route }) {
  return (
    <ScreenLayout
      inTab
      header={
        <ScreenHeader
          title="Analyse du contrat"
          onBack={() => navigation.goBack()}
        />
      }
    >
      <View className="items-center gap-5 py-8">
        <View className="h-20 w-20 items-center justify-center rounded-full border-4 border-primarySoft">
          <Ionicons name="hardware-chip-outline" size={36} color={colors.ink} />
        </View>
        <Text className="font-bold text-xl text-primary">
          Analyse terminée !
        </Text>
        <Text className="text-center font-sans text-sm leading-6 text-muted">
          Aperçu de démonstration. Aucun contrat n’a été analysé.
        </Text>
      </View>
      {analysisSteps.map((label) => (
        <View key={label} className="flex-row items-center gap-3">
          <View className="h-7 w-7 items-center justify-center rounded-full bg-primary">
            <Ionicons name="checkmark" size={20} color={colors.surface} />
          </View>
          <Text className="font-medium text-sm text-ink">{label}</Text>
        </View>
      ))}
      <View className="pt-5">
        <PrimaryButton
          title="Vérifier les informations"
          onPress={() =>
            navigation.navigate("ContractReview", {
              propertyId: route.params?.propertyId,
            })
          }
        />
      </View>
    </ScreenLayout>
  );
}

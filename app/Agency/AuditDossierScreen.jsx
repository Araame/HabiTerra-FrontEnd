import { useState } from "react";
import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import PrimaryButton from "../../components/common/PrimaryButton";
import InfoCard from "../../components/common/InfoCard";
import { EmptyState } from "../../components/common/FeedbackStates";
import { dossiers, properties, auditItems } from "./agencyMocks";
import { colors } from "../../shared/theme";


// Audit directory screen
export default function AuditDossierScreen({ navigation, route }) {
  const [showReadyPreview, setShowReadyPreview] = useState(false);
  const dossier = dossiers.find((item) => item.id === route.params?.dossierId);
  if (!dossier)
    return (
      <EmptyState
        title="Dossier introuvable"
        actionLabel="Retour"
        onAction={() => navigation.goBack()}
      />
    );
  const property = properties.find((item) => item.id === dossier.propertyId);
  return (
    <ScreenLayout
      inTab
      header={
        <ScreenHeader
          title="Dossier d’audit"
          onBack={() => navigation.goBack()}
        />
      }
      footer={<PrimaryButton title="Exporter le dossier d’audit" disabled />}
    >
      <View className="gap-4 rounded-[20px] bg-surface p-4">
        <Text className="font-bold text-sm text-ink">INFORMATIONS</Text>
        {[
          ["Locataire", dossier.name],
          ["Bien", property.reference],
          ["Période", dossier.period],
        ].map(([label, value]) => (
          <View key={label} className="flex-row justify-between gap-3">
            <Text className="font-sans text-sm text-muted">{label}</Text>
            <Text className="flex-1 text-right font-semibold text-sm text-ink">
              {value}
            </Text>
          </View>
        ))}
      </View>
      <View className="gap-5 rounded-[20px] bg-surface p-4">
        <Text className="font-bold text-sm text-ink">ÉLÉMENTS INCLUS</Text>
        {auditItems.map((label) => (
          <View key={label} className="flex-row items-center gap-2">
            <Ionicons name="checkmark" size={22} color={colors.primary} />
            <Text className="font-sans text-sm text-ink">{label}</Text>
          </View>
        ))}
      </View>
      {__DEV__ && (
        <PrimaryButton
          title={
            showReadyPreview
              ? "Masquer l’aperçu du résultat"
              : "Prévisualiser le dossier prêt"
          }
          variant="outline"
          onPress={() => setShowReadyPreview(!showReadyPreview)}
        />
      )}
      {showReadyPreview && (
        <View className="items-center gap-5 rounded-[20px] border border-positive bg-positiveSoft p-5">
          <Ionicons
            name="clipboard-outline"
            size={40}
            color={colors.positive}
          />
          <Text className="text-center font-bold text-xl text-positive">
            Dossier d’audit prêt
          </Text>
          <Text className="text-center font-sans text-sm text-positive">
            Aperçu de l’état final — aucun PDF généré.
          </Text>
          <PrimaryButton title="Télécharger le PDF" disabled />
        </View>
      )}
      <InfoCard
        variant="neutral"
        description="La génération et le téléchargement seront disponibles après connexion au service de documents."
      />
    </ScreenLayout>
  );
}

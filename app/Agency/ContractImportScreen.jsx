import { useState } from "react";
import { Text, View } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import PrimaryButton from "../../components/common/PrimaryButton";
import DocumentItem from "../../components/common/DocumentItem";
import InfoCard from "../../components/common/InfoCard";

// Contract uploading process screen
const steps = [
  "Import du contrat",
  "Analyse OCR automatique",
  "Extraction IA des données",
  "Vérification par l’agence",
  "Création du dossier locataire",
];

export default function ContractImportScreen({ navigation, route }) {
  const [exampleSelected, setExampleSelected] = useState(false);
  return (
    <ScreenLayout
      inTab
      header={
        <ScreenHeader
          title="Importer un contrat"
          onBack={() => navigation.goBack()}
        />
      }
      footer={<PrimaryButton title="Analyser le contrat" disabled />}
    >
      <InfoCard
        icon="information-circle-outline"
        variant="neutral"
        description="Importez le contrat de location signé pour créer automatiquement le dossier locataire."
      />
      {exampleSelected ? (
        <DocumentItem
          title="contrat-signe.pdf"
          metadata="2.4 MB · PDF · exemple sans fichier"
          actionIcon="trash-outline"
          actionLabel="Retirer"
          onAction={() => setExampleSelected(false)}
        />
      ) : (
        <PrimaryButton
          title="Sélectionner un fichier"
          variant="outline"
          disabled
        />
      )}
      <View className="gap-3 rounded-[20px] bg-surface p-4">
        <Text className="font-bold text-base text-text">
          Comment ça fonctionne
        </Text>
        {steps.map((label, index) => (
          <View key={label} className="flex-row items-center gap-2">
            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Text className="font-bold text-xs text-surface">
                {index + 1}
              </Text>
            </View>
            <Text className="flex-1 font-sans text-sm text-muted">{label}</Text>
          </View>
        ))}
      </View>
      <InfoCard
        variant="neutral"
        description="L’import de fichiers et l’analyse OCR/IA ne sont pas encore connectés."
      />
      {__DEV__ && (
        <PrimaryButton
          title={
            exampleSelected
              ? "Prévisualiser l’analyse terminée"
              : "Charger l’exemple de présentation"
          }
          variant="neutral"
          onPress={() =>
            exampleSelected
              ? navigation.navigate("ContractAnalysis", {
                  propertyId: route.params?.propertyId,
                })
              : setExampleSelected(true)
          }
        />
      )}
    </ScreenLayout>
  );
}

import { useState } from "react";
import { Text, View } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import Avatar from "../../components/common/Avatar";
import StatusBadge from "../../components/common/StatusBadge";
import SegmentedControl from "../../components/common/SegmentedControl";
import PrimaryButton from "../../components/common/PrimaryButton";
import DocumentItem from "../../components/common/DocumentItem";
import PaymentCard from "../../components/property/PaymentCard";
import InfoCard from "../../components/common/InfoCard";
import { EmptyState } from "../../components/common/FeedbackStates";
import { dossiers, documents, payments } from "./agencyMocks";

// Segmented control tab options
const sections = [
  { value: "overview", label: "Dossier" },
  { value: "payments", label: "Paiements" },
  { value: "documents", label: "Documents" },
  { value: "history", label: "Historique" },
];

// Tenant directory screen
export default function TenantDossierScreen({ navigation, route }) {
  const [section, setSection] = useState("documents");
  const [notice, setNotice] = useState(false);
  const dossier = dossiers.find((item) => item.id === route.params?.dossierId);
  const back = () => navigation.goBack();
  if (!dossier)
    return (
      <EmptyState
        title="Dossier introuvable"
        actionLabel="Retour"
        onAction={back}
      />
    );
  return (
    <ScreenLayout
      inTab
      header={<ScreenHeader title="Dossier locataire" onBack={back} />}
    >
      <View className="-mx-5 -mt-5 flex-row items-center gap-3 bg-primary px-5 pb-5">
        <Avatar initials={dossier.initials} size="medium" variant="primary" />
        <View className="flex-1 gap-2">
          <Text className="font-bold text-xl text-surface">{dossier.name}</Text>
          <Text className="font-sans text-xs text-surface">
            {dossier.email}
          </Text>
          <View className="flex-row gap-2">
            <StatusBadge label="Actif" variant="success" />
            <StatusBadge label="Activé" variant="success" />
          </View>
        </View>
      </View>
      <View className="-mx-5 -mt-5">
        <SegmentedControl
          options={sections}
          selectedValue={section}
          onChange={(value) => {
            setSection(value);
            setNotice(false);
          }}
          variant="underline"
        />
      </View>
      {section === "documents" && (
        <>
          {documents
            .filter((item) => item.dossierId === dossier.id)
            .map((document) => (
              <DocumentItem
                key={document.id}
                {...document}
                onAction={() => setNotice(true)}
              />
            ))}
          {!documents.some((item) => item.dossierId === dossier.id) && (
            <EmptyState title="Aucun document d’exemple" />
          )}
          {notice && (
            <InfoCard
              variant="neutral"
              description="Ces documents sont des exemples de présentation. Aucun fichier personnel n’est disponible au téléchargement."
            />
          )}
        </>
      )}
      {section === "payments" &&
        payments
          .filter((item) => item.dossierId === dossier.id)
          .map((payment) => (
            <PaymentCard key={payment.id} payment={payment} compact />
          ))}
      {section === "overview" && (
        <InfoCard
          variant="neutral"
          title="Dossier"
          description="Le contenu détaillé de cette section attend sa référence visuelle et les données du dossier."
        />
      )}
      {section === "history" && (
        <InfoCard
          variant="neutral"
          title="Historique"
          description="La chronologie sera disponible après connexion au service. Aucun événement n’est inventé."
        />
      )}
      <PrimaryButton
        title="Dossier d’audit"
        variant="outline"
        onPress={() =>
          navigation.navigate("AuditDossier", { dossierId: dossier.id })
        }
      />
    </ScreenLayout>
  );
}

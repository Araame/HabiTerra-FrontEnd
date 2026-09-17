import { Text, View } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import Avatar from "../../components/common/Avatar";
import StatusBadge from "../../components/common/StatusBadge";
import PrimaryButton from "../../components/common/PrimaryButton";
import InfoCard from "../../components/common/InfoCard";
import { EmptyState } from "../../components/common/FeedbackStates";
import { applications, properties } from "./agencyMocks";

export default function ApplicationDetailsScreen({ navigation, route }) {
  const application = applications.find(
    (item) => item.id === route.params?.applicationId,
  );
  if (!application)
    return (
      <EmptyState
        title="Candidature introuvable"
        actionLabel="Retour"
        onAction={() => navigation.goBack()}
      />
    );
  const property = properties.find(
    (item) => item.id === application.propertyId,
  );
  return (
    <ScreenLayout
      inTab
      header={
        <ScreenHeader
          title="Détail candidature"
          onBack={() => navigation.goBack()}
        />
      }
    >
      <View className="gap-4 rounded-[20px] bg-surface p-4">
        <View className="flex-row items-center gap-3">
          <Avatar
            name={application.name}
            initials={application.initials}
            size="medium"
            variant="primary"
          />
          <View className="flex-1 gap-1">
            <Text className="font-bold text-lg text-ink">
              {application.name}
            </Text>
            <Text className="font-sans text-sm text-muted">
              {application.email}
            </Text>
            <Text className="font-sans text-sm text-muted">
              {application.phone}
            </Text>
          </View>
        </View>
        <StatusBadge label={application.status} variant={application.tone} />
      </View>
      <View className="gap-3 rounded-[20px] bg-surface p-4">
        <Text className="font-semibold text-sm text-ink">Bien concerné</Text>
        <Text className="font-bold text-base text-ink">
          {property.reference} - {property.type}
        </Text>
        <Text className="font-sans text-sm text-muted">
          {property.location}
        </Text>
      </View>
      <View className="gap-3 rounded-[20px] bg-surface p-4">
        <Text className="font-semibold text-sm text-ink">Date</Text>
        <Text className="font-sans text-sm text-muted">{application.date}</Text>
      </View>
      <PrimaryButton title="Accepter la candidature" disabled />
      <PrimaryButton
        title="Voir le bien"
        variant="darkOutline"
        onPress={() =>
          navigation
            .getParent()
            .navigate("AgencyProperties", {
              screen: "ManagedPropertyDetails",
              initial: false,
              params: { propertyId: property.id },
            })
        }
      />
      <PrimaryButton title="Refuser" variant="danger" disabled />
      <InfoCard
        variant="neutral"
        description="Les décisions de candidature seront disponibles après connexion au service. Aucune décision n’est simulée."
      />
    </ScreenLayout>
  );
}

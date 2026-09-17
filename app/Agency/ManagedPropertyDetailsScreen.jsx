import { Image, Text, View } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import PrimaryButton from "../../components/common/PrimaryButton";
import StatusBadge from "../../components/common/StatusBadge";
import InfoCard from "../../components/common/InfoCard";
import { EmptyState } from "../../components/common/FeedbackStates";
import { properties, dossiers } from "./agencyMocks";

// Property details screen
export default function ManagedPropertyDetailsScreen({ navigation, route }) {
  const property = properties.find(
    (item) => item.id === route.params?.propertyId,
  );
  if (!property)
    return (
      <EmptyState
        title="Bien introuvable"
        actionLabel="Retour"
        onAction={() => navigation.goBack()}
      />
    );
  const dossier = dossiers.find((item) => item.id === property.dossierId);
  return (
    <ScreenLayout
      inTab
      header={
        <ScreenHeader
          title={property.reference}
          onBack={() => navigation.goBack()}
        />
      }
    >
      {property.image && (
        <Image source={property.image} className="-mx-5 -mt-5 aspect-[1.9]" />
      )}
      <View className="gap-3 rounded-[20px] bg-surface p-4">
        <StatusBadge label={property.status} variant={property.tone} />
        <View className="flex-row justify-between gap-3">
          <Text className="font-bold text-xl text-primary">
            {property.reference}
          </Text>
          <Text className="font-bold text-xl text-primary">
            {property.rentLabel}
          </Text>
        </View>
        <Text className="font-sans text-sm leading-5 text-muted">
          {property.address}
          {"\n"}
          {property.location}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {[
            property.type,
            `${property.area} m²`,
            `${property.rooms} pièces`,
            `${property.bedrooms} chambres`,
          ].map((label) => (
            <View key={label} className="rounded-full bg-secondary px-3 py-1">
              <Text className="font-medium text-xs text-ink">{label}</Text>
            </View>
          ))}
        </View>
      </View>
      <View className="gap-3 rounded-[20px] bg-surface p-4">
        <Text className="font-bold text-xs text-ink">DESCRIPTION</Text>
        <Text className="font-sans text-sm leading-6 text-muted">
          {property.description}
        </Text>
      </View>
      <View className="gap-3 rounded-[20px] bg-surface p-4">
        <Text className="font-bold text-xs text-ink">CONDITIONS LOCATIVES</Text>
        {[
          ["Loyer", property.rentLabel],
          ["Caution", property.deposit],
          ["Disponible dès", property.availableFrom],
        ].map(([label, value]) => (
          <View key={label} className="flex-row justify-between gap-3">
            <Text className="font-sans text-sm text-muted">{label}</Text>
            <Text className="font-semibold text-sm text-ink">{value}</Text>
          </View>
        ))}
      </View>
      <View className="gap-2 rounded-[20px] bg-surface p-4">
        <Text className="font-bold text-xs text-ink">BAILLEUR</Text>
        <Text className="font-semibold text-sm text-text">
          {property.owner}
        </Text>
        <Text className="font-sans text-xs text-muted">
          {property.ownerPhone}
        </Text>
      </View>
      {dossier ? (
        <View className="gap-3 rounded-[20px] bg-surface p-4">
          <Text className="font-bold text-xs text-ink">SITUATION LOCATIVE</Text>
          <Text className="font-semibold text-base text-text">
            {dossier.name}
          </Text>
          <StatusBadge label="Activé" variant="success" />
          <PrimaryButton
            title="Voir dossier"
            variant="outline"
            onPress={() =>
              navigation.navigate("TenantDossier", { dossierId: dossier.id })
            }
          />
        </View>
      ) : (
        <PrimaryButton
          title="Ajouter un locataire"
          icon="add"
          onPress={() =>
            navigation.navigate("ContractImport", { propertyId: property.id })
          }
        />
      )}
      {property.published && (
        <View className="gap-2 rounded-[20px] bg-surface p-4">
          <Text className="font-bold text-xs text-primary">PUBLICATION</Text>
          <Text className="font-sans text-sm text-muted">
            {property.views} vues · Publié le {property.publishedAt}
          </Text>
        </View>
      )}
      {!dossier && (
        <PrimaryButton
          title={property.published ? "Dépublier" : "Publier le bien"}
          variant="dark"
          disabled
        />
      )}
      {property.published && (
        <PrimaryButton
          title="Voir candidatures"
          variant="neutral"
          onPress={() =>
            navigation
              .getParent()
              .navigate("AgencyHome", {
                screen: "Applications",
                initial: false,
                params: { propertyId: property.id },
              })
          }
        />
      )}
      <PrimaryButton
        title="Modifier"
        variant="neutral"
        onPress={() =>
          navigation.navigate("PropertyForm", { propertyId: property.id })
        }
      />
      <InfoCard
        variant="neutral"
        description="Données d’exemple : publication et modification seront disponibles après connexion au service."
      />
    </ScreenLayout>
  );
}

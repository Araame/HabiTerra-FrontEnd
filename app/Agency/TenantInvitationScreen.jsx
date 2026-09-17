import { Text, View } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import Avatar from "../../components/common/Avatar";
import InfoCard from "../../components/common/InfoCard";
import PrimaryButton from "../../components/common/PrimaryButton";


// Tenant invitation screen
export default function TenantInvitationScreen({ navigation, tenant }) {
  const initials =
    `${tenant.firstName.charAt(0)}${tenant.lastName.charAt(0)}`.toUpperCase();
  return (
    <ScreenLayout
      inTab
      header={
        <ScreenHeader
          title="Invitation du locataire"
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <PrimaryButton
          title="Retour au portefeuille"
          onPress={() => navigation.popTo("Portfolio")}
        />
      }
    >
      <InfoCard
        variant="primary"
        title="Dossier locataire créé"
        icon="checkbox-outline"
        description="Aperçu uniquement — aucun dossier créé, aucune invitation envoyée."
      />
      <View className="gap-4 rounded-[20px] border border-border bg-surface p-4">
        <View className="flex-row items-center gap-3">
          <Avatar initials={initials} size="medium" variant="primary" />
          <View className="flex-1 gap-1">
            <Text className="font-bold text-lg text-ink">
              {tenant.firstName} {tenant.lastName}
            </Text>
            <Text className="font-sans text-xs text-muted">{tenant.email}</Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1 items-center rounded-xl bg-secondary p-3">
            <Text className="font-sans text-xs text-muted">Dossier</Text>
            <Text className="font-bold text-sm text-positive">Actif</Text>
          </View>
          <View className="flex-1 items-center rounded-xl bg-secondary p-3">
            <Text className="font-sans text-xs text-muted">Compte</Text>
            <Text className="font-bold text-sm text-muted">Non activé</Text>
          </View>
        </View>
      </View>
      <View className="gap-3 rounded-[20px] border border-border bg-surface p-4">
        <Text className="font-bold text-sm text-ink">LIEN D’ACTIVATION</Text>
        <Text className="rounded-xl bg-secondary p-3 font-sans text-sm text-muted">
          Le lien sera fourni après création du dossier.
        </Text>
      </View>
      <Text className="font-bold text-sm text-ink">Envoyer l’invitation</Text>
      <PrimaryButton title="Envoyer par WhatsApp" disabled />
      <PrimaryButton
        title="Envoyer par notification"
        variant="neutral"
        disabled
      />
    </ScreenLayout>
  );
}

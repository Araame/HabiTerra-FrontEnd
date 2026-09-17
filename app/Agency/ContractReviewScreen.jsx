import { Text, View } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import FormField from "../../components/common/FormField";
import PrimaryButton from "../../components/common/PrimaryButton";
import InfoCard from "../../components/common/InfoCard";

const groups = [
  {
    title: "LOCATAIRE",
    fields: [
      { key: "firstName", label: "Prénom" },
      { key: "lastName", label: "Nom" },
      {
        key: "email",
        label: "Email",
        keyboardType: "email-address",
        autoCapitalize: "none",
      },
      { key: "phone", label: "Téléphone", keyboardType: "phone-pad" },
    ],
  },
  {
    title: "CONTRAT",
    fields: [
      { key: "startDate", label: "Date de début", icon: "calendar-outline" },
      { key: "rent", label: "Loyer (FCFA)", keyboardType: "numeric" },
      { key: "deposit", label: "Caution (FCFA)", keyboardType: "numeric" },
    ],
  },
];

// Contractextracted infos screen
export default function ContractReviewScreen({
  navigation,
  route,
  values,
  onChange: setValues,
}) {
  const valid =
    Object.values(values).every((value) => value.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) &&
    Number(values.rent) > 0 &&
    Number(values.deposit) >= 0;
  return (
    <ScreenLayout
      inTab
      header={
        <ScreenHeader
          title="Vérification des données"
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <View className="gap-2">
          <PrimaryButton title="Valider les informations" disabled />
          <Text className="font-sans text-xs text-muted">
            La création du dossier attend le service backend.
          </Text>
        </View>
      }
    >
      <InfoCard
        variant="neutral"
        description="Données d’exemple — modifiez si nécessaire"
      />
      {groups.map((group) => (
        <View key={group.title} className="gap-4 rounded-[20px] bg-surface p-4">
          <Text className="font-bold text-sm text-text">{group.title}</Text>
          {group.fields.map(({ key, ...field }) => (
            <FormField
              key={key}
              {...field}
              value={values[key]}
              onChangeText={(value) => setValues({ ...values, [key]: value })}
            />
          ))}
        </View>
      ))}
      <InfoCard
        variant="neutral"
        icon="information-circle-outline"
        description="Vérifiez les informations avant de créer le dossier locataire."
      />
      {__DEV__ && (
        <PrimaryButton
          title="Prévisualiser l’invitation"
          disabled={!valid}
          variant="outline"
          onPress={() =>
            navigation.navigate("TenantInvitation", {
              propertyId: route.params?.propertyId,
            })
          }
        />
      )}
    </ScreenLayout>
  );
}

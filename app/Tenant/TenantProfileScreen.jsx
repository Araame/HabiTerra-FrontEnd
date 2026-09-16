import { useState } from "react";
import { Alert, Text, View } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import Avatar from "../../components/common/Avatar";
import FormField from "../../components/common/FormField";
import PrimaryButton from "../../components/common/PrimaryButton";
import { demoProfile } from "./tenantMocks";

export default function TenantProfileScreen({ navigation, route }) {
  const [profile, setProfile] = useState({ ...demoProfile });
  const valid =
    profile.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) &&
    profile.phone.trim();
  const inTab = route.name === "Profile";
  function save() {
    if (route.params?.applicationFlow)
      navigation.navigate("Application", {
        propertyId: route.params.propertyId,
      });
    else
      Alert.alert(
        "Profil de démonstration",
        "Les modifications restent dans cet écran. Aucun profil serveur n’a été modifié.",
      );
  }
  return (
    <ScreenLayout
      inTab={inTab}
      header={
        <ScreenHeader
          title="Mon profil"
          subtitle="Complétez pour candidater"
          onBack={() =>
            inTab ? navigation.navigate("Home") : navigation.goBack()
          }
        />
      }
      footer={
        <PrimaryButton
          title="Enregistrer les modifications"
          disabled={!valid}
          onPress={save}
        />
      }
    >
      <View className="items-center gap-3 pb-2">
        <Avatar name={profile.name} />
        <Text className="mt-1 font-bold text-xl text-text ">{profile.name}</Text>
        <Text className="font-sans text-sm text-muted">
          Chercheur de logement
        </Text>
      </View>
      {[
        { key: "name", label: "Nom complet" },
        {
          key: "email",
          label: "Email",
          keyboardType: "email-address",
          autoCapitalize: "none",
        },
        { key: "phone", label: "Téléphone", keyboardType: "phone-pad" },
      ].map(({ key, ...field }) => (
        <FormField
          key={key}
          {...field}
          value={profile[key]}
          onChangeText={(value) => setProfile({ ...profile, [key]: value })}
        />
      ))}
    </ScreenLayout>
  );
}

import { useState } from "react";
import { Alert, Text, View } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import FormField from "../../components/common/FormField";
import TextAreaField from "../../components/common/TextAreaField";
import Chip from "../../components/common/Chip";
import InfoCard from "../../components/common/InfoCard";
import PrimaryButton from "../../components/common/PrimaryButton";
import PropertyMiniCard from "../../components/property/PropertyMiniCard";
import { getProperty } from "./tenantMocks";

export function isValidMoveInDate(value, today = new Date()) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
  const [day, month, year] = value.split("/").map(Number);
  const date = new Date(year, month - 1, day);
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date >= startOfToday
  );
}

export default function ApplicationScreen({ navigation, route }) {
  const property = getProperty(route.params?.propertyId);
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(12);
  const [message, setMessage] = useState("");
  const validDate = isValidMoveInDate(date);
  function submit() {
    Alert.alert(
      "Aperçu de candidature",
      "Aucun dossier ne sera transmis. Ouvrir la confirmation de démonstration ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Voir l’aperçu",
          onPress: () =>
            navigation.navigate("ApplicationConfirmation", {
              propertyId: property.id,
            }),
        },
      ],
    );
  }
  return (
    <ScreenLayout
      header={
        <ScreenHeader
          title="Ma candidature"
          subtitle="Déposez votre dossier"
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <PrimaryButton
          title="Envoyer ma candidature"
          disabled={!validDate || !message.trim()}
          onPress={submit}
        />
      }
    >
      <PropertyMiniCard {...property} />
      <FormField
        label="Date d’emménagement souhaitée"
        value={date}
        onChangeText={setDate}
        placeholder="jj/mm/aaaa"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        icon="calendar-outline"
        variant="warm"
        error={
          date.length === 10 && !validDate
            ? "Indiquez une date valide à partir d’aujourd’hui."
            : undefined
        }
      />
      <View className="gap-2">
        <Text className="font-semibold text-[13px] text-ink">
          Durée souhaitée (mois)
        </Text>
        <View className="flex-row gap-2">
          {[6, 12, 24].map((months) => (
            <Chip
              key={months}
              label={`${months} mois`}
              variant="duration"
              selected={duration === months}
              onPress={() => setDuration(months)}
            />
          ))}
        </View>
      </View>
      <TextAreaField
        label="Message au propriétaire"
        value={message}
        onChangeText={setMessage}
        placeholder="Présentez-vous brièvement et expliquez votre situation…"
        maxLength={500}
      />
      <InfoCard
        variant="primary"
        icon="information-circle-outline"
        description="Votre candidature sera transmise directement au propriétaire. Il vous contactera dans les 48h suivant réception."
      />
    </ScreenLayout>
  );
}

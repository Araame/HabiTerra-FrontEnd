import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import { EmptyState } from "../../components/common/FeedbackStates";

const content = {
  Landlords: [
    "Bailleurs",
    "La gestion détaillée des bailleurs attend sa référence visuelle.",
  ],
  AgencyNotifications: [
    "Notifications",
    "Aucune référence Agence n’est disponible pour cet écran.",
  ],
  PropertyForm: [
    "Formulaire du bien",
    "Les champs de création et de modification attendent leur référence visuelle.",
  ],
  AgencyProfile: [
    "Profil Agence",
    "Le profil Agence attend sa référence visuelle et les données de session.",
  ],
};

export default function AgencyPendingScreen({ navigation, route }) {
  const [title, description] = content[route.name];
  return (
    <ScreenLayout
      inTab
      scroll={false}
      header={
        <ScreenHeader
          title={title}
          onBack={() =>
            route.name === "AgencyProfile"
              ? navigation.navigate("AgencyHome")
              : navigation.goBack()
          }
        />
      }
    >
      <EmptyState title={title} description={description} />
    </ScreenLayout>
  );
}

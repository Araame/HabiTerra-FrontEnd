import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import { EmptyState } from "../../components/common/FeedbackStates";

export default function TenantLeaseScreen({ navigation }) {
  return (
    <ScreenLayout
      inTab
      scroll={false}
      header={
        <ScreenHeader
          title="Mon bail"
          onBack={() => navigation.navigate("Home")}
        />
      }
    >
      <EmptyState
        title="Mon bail"
        description="Votre bail actif sera disponible ici."
      />
    </ScreenLayout>
  );
}

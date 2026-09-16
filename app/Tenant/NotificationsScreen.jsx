import { FlatList } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import { EmptyState } from "../../components/common/FeedbackStates";

export default function NotificationsScreen({ navigation }) {
  return (
    <ScreenLayout
      scroll={false}
      header={
        <ScreenHeader
          title="Notifications"
          onBack={() => navigation.goBack()}
        />
      }
    >
      <FlatList
        data={[]}
        renderItem={() => null}
        contentContainerClassName="grow"
        ListEmptyComponent={
          <EmptyState
            title="Aucune notification"
            description="Vos notifications apparaîtront ici."
          />
        }
      />
    </ScreenLayout>
  );
}

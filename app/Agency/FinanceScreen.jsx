import { useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import ScreenLayout from "../../components/common/ScreenLayout";
import ScreenHeader from "../../components/common/ScreenHeader";
import StatCard from "../../components/common/StatCard";
import Chip from "../../components/common/Chip";
import InfoCard from "../../components/common/InfoCard";
import PaymentCard from "../../components/property/PaymentCard";
import { EmptyState } from "../../components/common/FeedbackStates";
import { payments } from "./agencyMocks";

const filters = [
  { label: "Tous", status: null },
  { label: "Payés", status: "Payé" },
  { label: "En attente", status: "En attente" },
  { label: "En retard", status: "En retard" },
];

// Finance screen
export default function FinanceScreen({ navigation }) {
  const [status, setStatus] = useState("En retard");
  const [notice, setNotice] = useState(false);
  const total = (filter) =>
    `${payments.filter((p) => !filter || p.status === filter).reduce((sum, p) => sum + p.amountValue, 0) / 1000}k`;
  const visible = payments.filter((item) => !status || item.status === status);
  return (
    <ScreenLayout
      inTab
      scroll={false}
      header={
        <ScreenHeader
          title="Finance"
          onBack={() => navigation.getParent().navigate("AgencyHome")}
        />
      }
    >
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-4 p-5"
        ListHeaderComponent={
          <View className="gap-4">
            <View className="-mx-5 -mt-5 flex-row flex-wrap gap-2 bg-primary p-5">
              {[
                ["Attendus", null],
                ["Reçus", "Payé"],
                ["Retard", "En retard"],
                ["Attente", "En attente"],
              ].map(([label, value]) => (
                <StatCard
                  key={label}
                  label={label}
                  value={total(value)}
                  compact
                />
              ))}
            </View>
            <ScrollView
              horizontal
              contentContainerClassName="gap-2"
              showsHorizontalScrollIndicator={false}
            >
              {filters.map((filter) => (
                <Chip
                  variant="neutral"
                  key={filter.label}
                  label={filter.label}
                  selected={status === filter.status}
                  onPress={() => setStatus(filter.status)}
                />
              ))}
            </ScrollView>
            <Text className="font-sans text-xs text-muted">
              {visible.length} paiement{visible.length > 1 ? "s" : ""}
            </Text>
            {notice && (
              <InfoCard
                variant="neutral"
                description="La relance sera disponible après connexion au service. Aucun message n’a été envoyé."
              />
            )}
          </View>
        }
        renderItem={({ item }) => (
          <PaymentCard
            payment={item}
            onRemind={
              item.status === "En retard" ? () => setNotice(true) : undefined
            }
            onOpenDossier={() =>
              navigation.navigate("TenantDossier", {
                dossierId: item.dossierId,
              })
            }
          />
        )}
        ListEmptyComponent={<EmptyState title="Aucun paiement" />}
      />
    </ScreenLayout>
  );
}

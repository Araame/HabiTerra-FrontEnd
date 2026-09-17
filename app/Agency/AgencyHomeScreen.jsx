import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenLayout from "../../components/common/ScreenLayout";
import SectionHeader from "../../components/common/SectionHeader";
import StatCard from "../../components/common/StatCard";
import Avatar from "../../components/common/Avatar";
import { agency, properties, owners, applications } from "./agencyMocks";
import { colors } from "../../shared/theme";

// Home screen
export default function AgencyHomeScreen({ navigation }) {
  const goProperties = () =>
    navigation.navigate("AgencyProperties", { screen: "Portfolio" });
  const actions = [
    {
      title: "Ajouter un bien",
      icon: "business-outline",
      press: () =>
        navigation.navigate("AgencyProperties", {
          screen: "PropertyForm",
          initial: false,
        }),
    },
    {
      title: "Ajouter un locataire",
      icon: "person-add-outline",
      press: () =>
        navigation.navigate("AgencyProperties", {
          screen: "Portfolio",
          params: { selectForTenant: true },
        }),
    },
    {
      title: "Candidatures",
      icon: "clipboard-outline",
      press: () => navigation.navigate("Applications"),
    },
    {
      title: "Paiements",
      icon: "wallet-outline",
      press: () => navigation.navigate("AgencyFinance"),
    },
  ];
  const links = [
    {
      title: "Bailleurs",
      subtitle: "Gérer vos bailleurs",
      icon: "people-outline",
      press: () => navigation.navigate("Landlords"),
    },
    {
      title: "Portefeuille",
      subtitle: "Tous vos biens",
      icon: "business-outline",
      press: goProperties,
    },
    {
      title: "Candidatures",
      subtitle: "Demandes en attente",
      icon: "clipboard-outline",
      press: () => navigation.navigate("Applications"),
    },
    {
      title: "Finance",
      subtitle: "Loyers et paiements",
      icon: "wallet-outline",
      press: () => navigation.navigate("AgencyFinance"),
    },
  ];
  return (
    <ScreenLayout inTab>
      <View className="-mx-5 -mt-5 gap-4 bg-primary p-5">
        <View className="flex-row items-center gap-2">
          <View className="flex-1 gap-1">
            <Text className="font-bold text-xl text-surface">
              HabiTerra <Text className="font-sans text-sm">Agence</Text>
            </Text>
            <Text className="font-sans text-xs text-surface">
              {agency.name}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => navigation.navigate("AgencyNotifications")}
            className="h-11 w-11 items-center justify-center rounded-full bg-surface"
          >
            <Ionicons
              name="notifications-outline"
              size={23}
              color={colors.text}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Profil de l’agence"
            onPress={() => navigation.navigate("AgencyProfile")}
          >
            <Avatar initials={agency.initials} size="small" />
          </Pressable>
        </View>
        <View className="gap-2 rounded-2xl bg-surface p-4">
          <Text className="font-sans text-xs text-muted">Bonjour,</Text>
          <Text className="font-bold text-base text-text">
            {agency.manager}
          </Text>
          <Text className="font-sans text-xs text-primary">{agency.date}</Text>
        </View>
      </View>
      <SectionHeader title="Vue d’ensemble" />
      <View className="flex-row flex-wrap justify-between gap-y-3">
        <StatCard
          value={owners.length}
          label="Bailleurs"
          icon="people-outline"
          highlighted
          onPress={() => navigation.navigate("Landlords")}
        />
        <StatCard
          value={properties.length}
          label="Biens"
          icon="business-outline"
          onPress={goProperties}
        />
        <StatCard
          value={
            properties.filter((p) =>
              ["Disponible", "Publié"].includes(p.status),
            ).length
          }
          label="Disponibles"
          icon="checkmark-circle-outline"
          onPress={goProperties}
        />
        <StatCard
          value={properties.filter((p) => p.status === "Occupé").length}
          label="Occupés"
          icon="lock-closed-outline"
          onPress={goProperties}
        />
        <StatCard
          value={applications.filter((a) => a.status !== "Refusée").length}
          label="Candidatures"
          icon="clipboard-outline"
          onPress={() => navigation.navigate("Applications")}
        />
        <StatCard
          value={
            applications.filter((a) =>
              ["Nouvelle", "En cours"].includes(a.status),
            ).length
          }
          label="À suivre"
          highlighted
          onPress={() => navigation.navigate("Applications")}
        />
      </View>
      <SectionHeader title="Actions rapides" />
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {actions.map((action) => (
          <Pressable
            key={action.title}
            accessibilityRole="button"
            onPress={action.press}
            className="min-h-[64px] w-[48%] flex-row items-center gap-2 rounded-2xl border border-border bg-surface p-3 shadow-sm"
          >
            <Ionicons name={action.icon} size={22} color={colors.ink} />
            <Text className="flex-1 font-semibold text-xs text-ink">
              {action.title}
            </Text>
          </Pressable>
        ))}
      </View>
      <SectionHeader title="Navigation" />
      {links.map((link) => (
        <Pressable
          key={link.title}
          accessibilityRole="button"
          onPress={link.press}
          className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm"
        >
          <Ionicons name={link.icon} size={24} color={colors.ink} />
          <View className="flex-1 gap-1">
            <Text className="font-semibold text-sm text-ink">{link.title}</Text>
            <Text className="font-sans text-xs text-muted">
              {link.subtitle}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>
      ))}
    </ScreenLayout>
  );
}

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import AuthNavigator from "./AuthNavigator";
import TenantNavigator from "./TenantNavigator";
import AgencyNavigator from "./AgencyNavigator";
import { EmptyState, ErrorState } from "../../components/common/FeedbackStates";
import { roleOptions } from "./navigationConfig";

const Stack = createNativeStackNavigator();

// RBAC Navigation
function RoleNavigator({ role, authenticated = false }) {
  // Tenant section
  if (role === "LOCATAIRE")
    return <TenantNavigator authenticated={authenticated} />;
  // Agency section
  if (role === "AGENCE") return <AgencyNavigator />;
  // Owner section
  if (role === "PROPRIETAIRE") {
    return (
      <View className="flex-1 bg-background">
        <EmptyState
          title="Espace Propriétaire"
          description="Ce parcours n’est pas encore intégré."
        />
      </View>
    );
  }
  return (
    <ErrorState message="Le rôle associé à la session n’est pas reconnu." />
  );
}

// session doit provenir de l’authentification serveur, jamais du choix d’inscription.
export default function AppNavigator({ session = null }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session?.user ? (
        <Stack.Screen
          name="Authenticated"
          navigationKey={`${session.user.id}:${session.user.role}`}
        >
          {() => <RoleNavigator role={session.user.role} authenticated />}
        </Stack.Screen>
      ) : (
        <Stack.Group navigationKey="guest">
          <Stack.Screen name="Auth" component={AuthNavigator} />
          {__DEV__ && (
            <Stack.Screen
              name="Preview"
              options={({ route }) => ({
                headerShown: true,
                title: `Aperçu · ${roleOptions.find((option) => option.value === route.params?.role)?.label ?? "Profil"}`,
                headerBackTitle: "Quitter",
              })}
            >
              {({ route }) => <RoleNavigator role={route.params?.role} />}
            </Stack.Screen>
          )}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

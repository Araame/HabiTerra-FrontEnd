import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import AuthNavigator from "./AuthNavigator";
import TenantNavigator from "./TenantNavigator";
import AgencyNavigator from "./AgencyNavigator";
import { EmptyState, ErrorState, LoadingState } from "../../components/common/FeedbackStates";
import { useAuth } from "../Auth/AuthContext";
import LogoutButton from "../../components/common/LogoutButton";
import { roleOptions } from "./navigationConfig";

const Stack = createNativeStackNavigator();

// RBAC Navigation
function RoleNavigator({ role, authenticated = false }) {
  // Tenant section
  if (role === "LOCATAIRE")
    return <TenantNavigator authenticated={authenticated} />;
  // Agency section
  if (role === "GERANT_AGENCE") return <AgencyNavigator />;
  // Owner section
  if (role === "PROPRIETAIRE") {
    return (
      <View className="flex-1 bg-background">
        <EmptyState
          title="Espace Propriétaire"
          description="Ce parcours n’est pas encore intégré."
        />
        <LogoutButton />
      </View>
    );
  }
  return (
    <View className="flex-1 bg-background">
      <ErrorState message={role === "ADMIN" ? "Profil administrateur non pris en charge." : "Le rôle associé à la session n’est pas reconnu."} />
      <LogoutButton />
    </View>
  );
}


export default function AppNavigator() {
  const { user, isRestoring, restoreError, restoreSession } = useAuth();
  if (isRestoring) return <LoadingState message="Restauration de votre session…" />;
  if (restoreError) return (
    <View className="flex-1 bg-background">
      <ErrorState message={restoreError.message} onRetry={restoreSession} />
      <LogoutButton allowUnrestored />
    </View>
  );
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen
          name="Authenticated"
          navigationKey={`${user.id}:${user.role}`}
        >
          {() => <RoleNavigator role={user.role} authenticated />}
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

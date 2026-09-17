import { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileChoiceScreen from "../Auth/ProfileChoiceScreen";
import AccountScreen from "../Auth/AccountScreen";
import VerificationScreen from "../Auth/VerificationScreen";
import ActivationScreen from "../Auth/ActivationScreen";

const Stack = createNativeStackNavigator();

// Auth Navigation component
export default function AuthNavigator({ route }) {
  const [selectedRole, setSelectedRole] = useState("LOCATAIRE");
  // Back to button
  const returnTo = route.params?.returnTo;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileChoice">
        {(props) => (
          <ProfileChoiceScreen
            {...props}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => (
          <AccountScreen {...props} role={selectedRole} returnTo={returnTo} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Login">
        {(props) => (
          <AccountScreen {...props} mode="login" returnTo={returnTo} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Verification">
        {(props) => <VerificationScreen {...props} role={selectedRole} />}
      </Stack.Screen>
      <Stack.Screen name="Activation">
        {(props) => <ActivationScreen {...props} role={selectedRole} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

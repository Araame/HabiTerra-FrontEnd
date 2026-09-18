import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileChoiceScreen from "../Auth/ProfileChoiceScreen";
import AccountScreen from "../Auth/AccountScreen";
import VerificationScreen from "../Auth/VerificationScreen";
import IdentifierScreen from "../Auth/IdentifierScreen";
import CompleteProfileScreen from "../Auth/CompleteProfileScreen";
import { useAuth } from "../Auth/AuthContext";
import useRegistrationFlow from "../Auth/useRegistrationFlow";

const Stack = createNativeStackNavigator();

// Auth Navigation component
export default function AuthNavigator({ route }) {
  const { establishSession } = useAuth();
  const registration = useRegistrationFlow(establishSession);
  // Back to button
  const returnTo = route.params?.returnTo;
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" listeners={{ focus: registration.reset }}>
        {(props) => <AccountScreen {...props} returnTo={returnTo} />}
      </Stack.Screen>
      <Stack.Screen name="ProfileChoice">
        {(props) => (
          <ProfileChoiceScreen
            {...props}
            selectedRole={registration.registration.role}
            onSelectRole={registration.selectRole}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Identifier" listeners={{ blur: registration.cancelPending }}>
        {(props) => (
          <IdentifierScreen {...props} flow={registration} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Verification" listeners={{ blur: registration.cancelPending }}>
        {(props) => <VerificationScreen {...props} flow={registration} />}
      </Stack.Screen>
      <Stack.Screen name="CompleteProfile" listeners={{ blur: registration.cancelPending }}>
        {(props) => <CompleteProfileScreen {...props} flow={registration} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomBar from "../../components/navigation/BottomBar";
import { navigationConfig } from "./navigationConfig";
import TenantHomeScreen from "../Tenant/TenantHomeScreen";
import ConversationalSearchScreen from "../Tenant/ConversationalSearchScreen";
import TenantLeaseScreen from "../Tenant/TenantLeaseScreen";
import TenantProfileScreen from "../Tenant/TenantProfileScreen";
import PropertyDetailsScreen from "../Tenant/PropertyDetailsScreen";
import LocationColocationScreen from "../Tenant/LocationColocationScreen";
import ApplicationScreen from "../Tenant/ApplicationScreen";
import ApplicationConfirmationScreen from "../Tenant/ApplicationConfirmationScreen";
import NotificationsScreen from "../Tenant/NotificationsScreen";

//Initialize bottom bar navigation and Stack navigation
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tabs for bottom bar
const screens = {
  Home: TenantHomeScreen,
  Search: ConversationalSearchScreen,
  Lease: TenantLeaseScreen,
  Profile: TenantProfileScreen,
};

// Bottom bar component
function TenantTabs({ authenticated }) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="history"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomBar {...props} />}
    >
      {navigationConfig.LOCATAIRE.map(({ name, label, icon }) => (
        <Tab.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarAccessibilityLabel: label,
            tabBarIconName: icon,
          }}
        >
          {(props) => {
            const Screen = screens[name];
            return <Screen {...props} authenticated={authenticated} />;
          }}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

// Stack navigation component
export default function TenantNavigator({ authenticated = false }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TenantTabs">
        {() => <TenantTabs authenticated={authenticated} />}
      </Stack.Screen>
      <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
      <Stack.Screen name="LocationColocation">
        {(props) => (
          <LocationColocationScreen {...props} authenticated={authenticated} />
        )}
      </Stack.Screen>
      <Stack.Screen name="TenantProfile" component={TenantProfileScreen} />
      <Stack.Screen name="Application" component={ApplicationScreen} />
      <Stack.Screen
        name="ApplicationConfirmation"
        component={ApplicationConfirmationScreen}
      />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TenantBottomBar from "../../components/navigation/TenantBottomBar";
import TenantHomeScreen from "../Tenant/TenantHomeScreen";
import ConversationalSearchScreen from "../Tenant/ConversationalSearchScreen";
import TenantLeaseScreen from "../Tenant/TenantLeaseScreen";
import TenantProfileScreen from "../Tenant/TenantProfileScreen";
import PropertyDetailsScreen from "../Tenant/PropertyDetailsScreen";
import LocationColocationScreen from "../Tenant/LocationColocationScreen";
import TenantAccountScreen from "../Tenant/TenantAccountScreen";
import ApplicationScreen from "../Tenant/ApplicationScreen";
import ApplicationConfirmationScreen from "../Tenant/ApplicationConfirmationScreen";
import NotificationsScreen from "../Tenant/NotificationsScreen";

//Initialize bottom bar navigation and Stack navigation
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tabs for bottom bar
const tabs = [
  {
    name: "Home",
    label: "Accueil",
    icon: "home-outline",
    component: TenantHomeScreen,
  },
  {
    name: "Search",
    label: "Recherche",
    icon: "search-outline",
    component: ConversationalSearchScreen,
  },
  {
    name: "Lease",
    label: "Mon bail",
    icon: "document-text-outline",
    component: TenantLeaseScreen,
  },
  {
    name: "Profile",
    label: "Profil",
    icon: "person-outline",
    component: TenantProfileScreen,
  },
];


// Bottom bar component
function TenantTabs() {
  return (
    <Tab.Navigator initialRouteName="Home" backBehavior="history" screenOptions={{ headerShown: false }} tabBar={(props) => <TenantBottomBar {...props} />}>
      {tabs.map(({ name, label, icon, component }) => (
        <Tab.Screen key={name} name={name} component={component}
          options={{title: label, tabBarAccessibilityLabel: label, tenantIcon: icon,}}/>
      ))}
    </Tab.Navigator>
  );
}

// Stack navigation component
export default function TenantNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TenantTabs" component={TenantTabs} />
      <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
      <Stack.Screen name="LocationColocation" component={LocationColocationScreen}/>
      <Stack.Screen name="TenantAccount" component={TenantAccountScreen} />
      <Stack.Screen name="TenantProfile" component={TenantProfileScreen} />
      <Stack.Screen name="Application" component={ApplicationScreen} />
      <Stack.Screen name="ApplicationConfirmation" component={ApplicationConfirmationScreen}/>
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomBar from "../../components/navigation/BottomBar";
import { navigationConfig } from "./navigationConfig";
import AgencyHomeScreen from "../Agency/AgencyHomeScreen";
import PortfolioScreen from "../Agency/PortfolioScreen";
import ManagedPropertyDetailsScreen from "../Agency/ManagedPropertyDetailsScreen";
import ApplicationsScreen from "../Agency/ApplicationsScreen";
import ApplicationDetailsScreen from "../Agency/ApplicationDetailsScreen";
import FinanceScreen from "../Agency/FinanceScreen";
import TenantDossierScreen from "../Agency/TenantDossierScreen";
import AuditDossierScreen from "../Agency/AuditDossierScreen";
import ContractImportScreen from "../Agency/ContractImportScreen";
import ContractAnalysisScreen from "../Agency/ContractAnalysisScreen";
import ContractReviewScreen from "../Agency/ContractReviewScreen";
import TenantInvitationScreen from "../Agency/TenantInvitationScreen";
import AgencyPendingScreen from "../Agency/AgencyPendingScreen";
import { contractExample } from "../Agency/agencyMocks";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


// Agency main Stack component
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={AgencyHomeScreen} />
      <Stack.Screen name="Applications" component={ApplicationsScreen} />
      <Stack.Screen
        name="ApplicationDetails"
        component={ApplicationDetailsScreen}
      />
      <Stack.Screen name="Landlords" component={AgencyPendingScreen} />
      <Stack.Screen
        name="AgencyNotifications"
        component={AgencyPendingScreen}
      />
    </Stack.Navigator>
  );
}


// Agency properties stack component
function PropertiesStack() {
  const [contractDraft, setContractDraft] = useState({ ...contractExample });
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Portfolio" component={PortfolioScreen} />
      <Stack.Screen
        name="ManagedPropertyDetails"
        component={ManagedPropertyDetailsScreen}
      />
      <Stack.Screen name="PropertyForm" component={AgencyPendingScreen} />
      <Stack.Screen name="TenantDossier" component={TenantDossierScreen} />
      <Stack.Screen name="AuditDossier" component={AuditDossierScreen} />
      <Stack.Screen name="ContractImport" component={ContractImportScreen} />
      <Stack.Screen
        name="ContractAnalysis"
        component={ContractAnalysisScreen}
      />
      <Stack.Screen name="ContractReview">
        {(props) => (
          <ContractReviewScreen
            {...props}
            values={contractDraft}
            onChange={setContractDraft}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="TenantInvitation">
        {(props) => (
          <TenantInvitationScreen {...props} tenant={contractDraft} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Finance stack nav component
function FinanceStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Payments" component={FinanceScreen} />
      <Stack.Screen name="TenantDossier" component={TenantDossierScreen} />
      <Stack.Screen name="AuditDossier" component={AuditDossierScreen} />
    </Stack.Navigator>
  );
}

// Agency main screens
const screens = {
  AgencyHome: HomeStack,
  AgencyProperties: PropertiesStack,
  AgencyFinance: FinanceStack,
  AgencyProfile: AgencyPendingScreen,
};

// Agency bottom bar navigation
export default function AgencyNavigator() {
  return (
    <Tab.Navigator
      backBehavior="history"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomBar {...props} />}
    >
      {navigationConfig.GERANT_AGENCE.map(({ name, label, icon }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={screens[name]}
          options={{
            title: label,
            tabBarAccessibilityLabel: label,
            tabBarIconName: icon,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

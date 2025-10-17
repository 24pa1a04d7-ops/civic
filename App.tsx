import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootStackParamList } from './src/types';
import { StorageService } from './src/services/storageService';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HealthConditionsScreen from './src/screens/HealthConditionsScreen';
import AllergiesScreen from './src/screens/AllergiesScreen';
import DietaryPreferencesScreen from './src/screens/DietaryPreferencesScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import AlternativesScreen from './src/screens/AlternativesScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D32',
    secondary: '#4CAF50',
    tertiary: '#81C784',
    surface: '#FFFFFF',
    background: '#F5F5F5',
    error: '#D32F2F',
    warning: '#FF9800',
    success: '#4CAF50',
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Scanner':
              iconName = 'camera-alt';
              break;
            case 'History':
              iconName = 'history';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scanner" component={ScannerScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize storage and check for existing user
        const storageService = new StorageService();
        const user = await storageService.getUserProfile();
        
        // Perform any necessary app initialization
        console.log('App initialized, user:', user ? 'exists' : 'new');
        
        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsReady(true); // Continue anyway
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return null; // Or a loading screen component
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="MainTabs"
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Results" 
              component={ResultsScreen}
              options={{ title: 'Analysis Results' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
            <Stack.Screen 
              name="HealthConditions" 
              component={HealthConditionsScreen}
              options={{ title: 'Health Conditions' }}
            />
            <Stack.Screen 
              name="Allergies" 
              component={AllergiesScreen}
              options={{ title: 'Allergies' }}
            />
            <Stack.Screen 
              name="DietaryPreferences" 
              component={DietaryPreferencesScreen}
              options={{ title: 'Dietary Preferences' }}
            />
            <Stack.Screen 
              name="ProductDetails" 
              component={ProductDetailsScreen}
              options={{ title: 'Product Details' }}
            />
            <Stack.Screen 
              name="Alternatives" 
              component={AlternativesScreen}
              options={{ title: 'Healthier Alternatives' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
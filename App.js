import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep splash screen visible while we initialize
SplashScreen.preventAutoHideAsync();

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';

// Import utilities
import { setupNotifications } from './src/utils/notifications';
import { THEME } from './src/constants/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Home');

  // Initialize app and prepare resources
  useEffect(() => {
    async function prepareApp() {
      try {
        // Initialize notifications
        await setupNotifications();

        // Check for pending scans or deep links
        const pendingScan = await AsyncStorage.getItem('pendingScan');
        if (pendingScan) {
          setInitialRoute('Scan');
          await AsyncStorage.removeItem('pendingScan');
        }
      } catch (error) {
        console.warn('Error during app initialization:', error);
      } finally {
        setIsReady(true);
      }
    }

    prepareApp();
  }, []);

  // Handle hiding the splash screen once the app is ready
  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  // Display a loading screen while the app initializes
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style="light" />
      <NavigationContainer
        theme={{
          colors: {
            primary: THEME.colors.primary,
            background: THEME.colors.background,
            card: THEME.colors.surface,
            text: THEME.colors.text,
            border: THEME.colors.border,
          },
        }}
      >
        <Tab.Navigator
          initialRouteName={initialRoute}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Scan') {
                iconName = focused ? 'scan-circle' : 'scan-circle-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: THEME.colors.primary,
            tabBarInactiveTintColor: THEME.colors.inactive,
            tabBarStyle: styles.tabBar,
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
            tabBarLabelStyle: styles.tabBarLabel,
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              title: 'My Inventory',
              headerShown: true,
            }}
          />
          <Tab.Screen 
            name="Scan" 
            component={ScannerScreen}
            options={{
              title: 'Scan Product',
              headerShown: true,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
  },
  tabBar: {
    elevation: 0,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    height: 60,
    paddingBottom: 5,
  },
  header: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
  },
  headerTitle: {
    fontSize: 18, // Removed fontWeight
    color: THEME.colors.text,
  },
  tabBarLabel: {
    fontSize: 12, // Removed fontWeight
  },
});

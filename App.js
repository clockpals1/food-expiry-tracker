import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens and components
import HomeScreen from './src/screens/HomeScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import { AppProvider } from './src/context/AppContext';

// Import utilities
import { setupNotifications } from './src/utils/notifications';
import { THEME } from './src/constants/theme';

const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: THEME.colors.primary,
    background: THEME.colors.background,
    card: THEME.colors.surface,
    text: THEME.colors.text,
    border: THEME.colors.border,
  },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Home');

  useEffect(() => {
    async function prepareApp() {
      try {
        await setupNotifications();
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

  const navigationTheme = {
    ...MyTheme,
    colors: {
      ...MyTheme.colors,
      background: THEME.colors.background,
    },
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  return (
    <AppProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="auto" />
        <Tab.Navigator
          initialRouteName={initialRoute}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Scan') {
                iconName = focused ? 'scan' : 'scan-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: THEME.colors.primary,
            tabBarInactiveTintColor: THEME.colors.textSecondary,
            tabBarStyle: {
              backgroundColor: THEME.colors.surface,
              borderTopColor: THEME.colors.border,
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            headerStyle: {
              backgroundColor: THEME.colors.surface,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: THEME.colors.text,
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Food Expiry Tracker',
            }}
          />
          <Tab.Screen
            name="Scan"
            component={ScannerScreen}
            options={{
              title: 'Scan Product',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
  },
});

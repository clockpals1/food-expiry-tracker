import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';  // Import your theme
import { scheduleNotification } from '../utils/notifications'; // Import the notification function

const HomeScreen = ({ navigation }) => {
  useEffect(() => {
    // Schedule a notification when the home screen loads
    const item = { name: 'Milk', id: 1 }; // Example item for notification
    const daysUntilExpiry = 3; // Example expiry in days

    const scheduleExpiryNotification = async () => {
      const notificationId = await scheduleNotification(item, daysUntilExpiry);
      if (notificationId) {
        console.log(`Notification scheduled with ID: ${notificationId}`);
      } else {
        console.warn('Failed to schedule notification.');
      }
    };

    scheduleExpiryNotification();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Food Expiry Tracker</Text>

      <Image
        source={{ uri: 'https://www.example.com/your-image.jpg' }} // Replace with an actual URL or local asset
        style={styles.image}
      />

      <Text style={styles.description}>
        Keep track of your food expiry dates and manage your inventory with ease.
      </Text>

      <Button
        title="Go to Scanner"
        onPress={() => navigation.navigate('Scan')}
        color={THEME.colors.primary}  // Use theme colors
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.lg,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
  },
  description: {
    fontSize: 16,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
});

export default HomeScreen;

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Sets up notifications by requesting permissions, configuring handlers,
 * and setting notification categories (for iOS).
 */
export async function setupNotifications() {
  try {
    // Request notification permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      throw new Error('Permission not granted for notifications');
    }

    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Configure notification categories/actions for iOS
    if (Platform.OS === 'ios') {
      await Notifications.setNotificationCategoryAsync('EXPIRY', [
        {
          identifier: 'MARK_USED',
          buttonTitle: 'Mark as Used',
          options: { isAuthenticationRequired: false },
        },
        {
          identifier: 'REMIND_LATER',
          buttonTitle: 'Remind Later',
          options: { isAuthenticationRequired: false },
        },
      ]);
    }

    return true;
  } catch (error) {
    console.warn('Error setting up notifications:', error);
    return false;
  }
}

/**
 * Schedules a notification to alert the user about an expiring food item.
 *
 * @param {Object} item - The food item object.
 * @param {number} daysUntilExpiry - Number of days until the item expires.
 * @returns {string|null} - The notification ID if successful, or null if it fails.
 */
export async function scheduleNotification(item, daysUntilExpiry) {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Food Item Expiring Soon! 🔔',
        body: `${item.name} will expire in ${daysUntilExpiry} days`,
        data: { itemId: item.id },
        categoryIdentifier: Platform.OS === 'ios' ? 'EXPIRY' : undefined,
      },
      trigger: null, // Immediate notification
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
}

import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { useApp } from '../context/AppContext';

export const useProductExpiry = () => {
  const { products, dispatch } = useApp();
  const [expiringProducts, setExpiringProducts] = useState([]);

  const checkExpiryDates = useCallback(() => {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const expiring = products.filter(product => {
      const expiryDate = new Date(product.expiryDate);
      return expiryDate <= threeDaysFromNow && expiryDate >= today;
    });

    setExpiringProducts(expiring);
    return expiring;
  }, [products]);

  const scheduleExpiryNotification = useCallback(async (product) => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const trigger = new Date(product.expiryDate);
      trigger.setDate(trigger.getDate() - 2); // 2 days before expiry

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Product Expiring Soon!',
          body: `${product.name} will expire in 2 days`,
          data: { productId: product.id },
        },
        trigger,
      });

      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: notificationId,
          productId: product.id,
          expiryDate: product.expiryDate,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }, [dispatch]);

  const cancelExpiryNotification = useCallback(async (notificationId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }, []);

  useEffect(() => {
    const checkExpiry = () => {
      const expiring = checkExpiryDates();
      expiring.forEach(product => {
        if (!product.notificationScheduled) {
          scheduleExpiryNotification(product);
        }
      });
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 1000 * 60 * 60); // Check every hour

    return () => clearInterval(interval);
  }, [checkExpiryDates, scheduleExpiryNotification]);

  return {
    expiringProducts,
    checkExpiryDates,
    scheduleExpiryNotification,
    cancelExpiryNotification,
  };
};

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { getExpiryStatus, formatExpiryDate } from '../utils/expiryUtils';
import * as Notifications from 'expo-notifications';

const ScannerScreen = () => {
  const [image, setImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const scanAnimation = useRef(new Animated.Value(1)).current;
  const detailsAnimation = useRef(new Animated.Value(0)).current;

  // Simulated product data (replace with actual barcode scanning)
  const mockProductData = {
    name: "Fresh Milk",
    price: "$3.99",
    expiryDate: "2024-12-25",
    image: "https://example.com/milk.jpg"
  };

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    if (scanning) {
      pulseAnimation.start();
    } else {
      pulseAnimation.stop();
      scanAnimation.setValue(1);
    }

    return () => pulseAnimation.stop();
  }, [scanning]);

  const handleScan = async () => {
    try {
      setScanning(true);
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        // Simulate barcode scanning delay
        setTimeout(() => {
          setScanning(false);
          setProductDetails(mockProductData);
          Animated.spring(detailsAnimation, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }, 1500);
      } else {
        setScanning(false);
      }
    } catch (error) {
      console.error('Error scanning:', error);
      setScanning(false);
      Alert.alert('Error', 'Failed to scan product. Please try again.');
    }
  };

  const scheduleExpiryReminder = async () => {
    if (!productDetails) return;

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please enable notifications to set reminders');
        return;
      }

      const trigger = new Date(productDetails.expiryDate);
      trigger.setDate(trigger.getDate() - 2); // Notify 2 days before expiry

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Product Expiring Soon!',
          body: `${productDetails.name} will expire in 2 days`,
        },
        trigger,
      });

      Alert.alert('Success', 'Expiry reminder set successfully!');
    } catch (error) {
      console.error('Error setting reminder:', error);
      Alert.alert('Error', 'Failed to set expiry reminder');
    }
  };

  const renderProductDetails = () => {
    if (!productDetails) return null;

    const { status, color } = getExpiryStatus(productDetails.expiryDate);
    const expiryText = formatExpiryDate(productDetails.expiryDate);

    return (
      <Animated.View
        style={[
          styles.productCard,
          { transform: [{ scale: detailsAnimation }] },
        ]}
      >
        <Text style={styles.productName}>{productDetails.name}</Text>
        <Text style={styles.productPrice}>{productDetails.price}</Text>
        <View style={[styles.expiryContainer, { backgroundColor: color }]}>
          <Ionicons
            name={status === 'expired' ? 'warning' : 'time-outline'}
            size={20}
            color="white"
          />
          <Text style={styles.expiryText}>{expiryText}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.addToCartButton]}
            onPress={() => Alert.alert('Success', 'Added to cart!')}
          >
            <Ionicons name="cart" size={20} color="white" />
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.reminderButton]}
            onPress={scheduleExpiryReminder}
          >
            <Ionicons name="notifications" size={20} color="white" />
            <Text style={styles.buttonText}>Set Reminder</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.scannerContainer}>
        <Animated.View
          style={[
            styles.scannerOverlay,
            { transform: [{ scale: scanAnimation }] },
          ]}
        >
          <Ionicons
            name="scan-outline"
            size={100}
            color={THEME.colors.primary}
          />
        </Animated.View>
        
        {scanning ? (
          <Text style={styles.scanningText}>Scanning...</Text>
        ) : (
          <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
            <Ionicons name="camera" size={24} color="white" />
            <Text style={styles.buttonText}>Scan Product</Text>
          </TouchableOpacity>
        )}
      </View>

      {renderProductDetails()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scannerContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    marginBottom: THEME.spacing.lg,
  },
  scannerOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    borderRadius: 10,
    marginBottom: THEME.spacing.lg,
  },
  scanningText: {
    fontSize: 18,
    color: THEME.colors.primary,
    marginTop: THEME.spacing.md,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
  },
  productCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    margin: THEME.spacing.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  productPrice: {
    fontSize: 20,
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.md,
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.md,
  },
  expiryText: {
    color: 'white',
    marginLeft: THEME.spacing.sm,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: THEME.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
    flex: 1,
    marginHorizontal: THEME.spacing.xs,
  },
  addToCartButton: {
    backgroundColor: THEME.colors.primary,
  },
  reminderButton: {
    backgroundColor: THEME.colors.warning,
  },
  buttonText: {
    color: 'white',
    marginLeft: THEME.spacing.sm,
    fontSize: 16,
  },
});

export default ScannerScreen;

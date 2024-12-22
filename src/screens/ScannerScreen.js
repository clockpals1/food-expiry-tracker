import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const ScannerScreen = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('An error occurred while taking the photo. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Scan Your Product</Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Ionicons name="camera" size={24} color={THEME.colors.background} />
        <Text style={styles.buttonText}>Take a Photo</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      <Text style={styles.text}>
        Scan your food items to track their expiry dates and manage your inventory.
      </Text>
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
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  text: {
    fontSize: 16,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: THEME.spacing.md,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginTop: THEME.spacing.lg,
  },
  buttonText: {
    color: THEME.colors.background,
    fontSize: 16,
    marginLeft: THEME.spacing.sm,
  },
});

export default ScannerScreen;

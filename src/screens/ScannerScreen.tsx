import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  Button,
  Text,
  Surface,
  ActivityIndicator,
  useTheme,
  FAB,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootStackParamList, FoodProduct, User } from '../types';
import { OCRService } from '../services/ocrService';
import { IngredientAnalyzer } from '../services/ingredientAnalyzer';
import { StorageService } from '../services/storageService';

type ScannerScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

export default function ScannerScreen() {
  const navigation = useNavigation<ScannerScreenNavigationProp>();
  const theme = useTheme();
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);

  const ocrService = new OCRService();
  const analyzer = new IngredientAnalyzer();
  const storageService = new StorageService();

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs camera access to scan food labels',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const permission = await Camera.requestCameraPermission();
        setHasPermission(permission === 'authorized');
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasPermission(false);
    }
  };

  const handleTakePhoto = async () => {
    if (!camera.current || isScanning) return;

    try {
      setIsScanning(true);
      
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'quality',
        flash: flashEnabled ? 'on' : 'off',
      });

      await processImage(`file://${photo.path}`);
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          const imageUri = response.assets[0].uri;
          if (imageUri) {
            processImage(imageUri);
          }
        }
      }
    );
  };

  const processImage = async (imageUri: string) => {
    try {
      setIsScanning(true);

      // Extract text from image using OCR
      const extractedText = await ocrService.extractTextFromImage(imageUri);
      
      if (!extractedText.trim()) {
        Alert.alert('No Text Found', 'Could not extract text from the image. Please try again with better lighting.');
        return;
      }

      // Parse the extracted text into product data
      const productData = ocrService.parseExtractedText(extractedText);
      
      if (!productData.ingredients || productData.ingredients.length === 0) {
        Alert.alert('No Ingredients Found', 'Could not find ingredient information. Please try scanning a different part of the label.');
        return;
      }

      // Create a complete product object
      const product: FoodProduct = {
        id: Date.now().toString(),
        name: productData.name || 'Unknown Product',
        ingredients: productData.ingredients,
        nutritionalInfo: productData.nutritionalInfo || {
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
          servingSize: 'Unknown'
        },
        scannedAt: new Date(),
        imageUri
      };

      // Get user profile for analysis
      const user = await storageService.getUserProfile();
      
      if (!user) {
        Alert.alert(
          'Profile Required', 
          'Please set up your health profile first for personalized analysis.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Set Up Profile', onPress: () => navigation.navigate('Profile') }
          ]
        );
        return;
      }

      // Analyze the product
      const analysisResult = analyzer.analyzeProduct(product, user);

      // Save the scan session
      const scanSession = {
        id: Date.now().toString(),
        userId: user.id,
        product,
        analysis: analysisResult,
        timestamp: new Date()
      };

      await storageService.saveScanSession(scanSession);
      await storageService.saveProduct(product);

      // Navigate to results
      navigation.navigate('Results', { analysisResult });

    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Processing Error', 'Failed to process the image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Icon name="camera-alt" size={80} color={theme.colors.primary} />
        <Text style={styles.permissionText}>Camera access is required to scan food labels</Text>
        <Button mode="contained" onPress={requestCameraPermission} style={styles.permissionButton}>
          Grant Permission
        </Button>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.permissionText}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />
      
      {/* Scanning Overlay */}
      {isScanning && (
        <View style={styles.scanningOverlay}>
          <Surface style={styles.scanningContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.scanningText}>Analyzing image...</Text>
          </Surface>
        </View>
      )}

      {/* Camera Overlay */}
      <View style={styles.overlay}>
        {/* Top Instructions */}
        <Surface style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Position the ingredient list within the frame
          </Text>
        </Surface>

        {/* Scanning Frame */}
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Bottom Controls */}
        <View style={styles.controls}>
          <FAB
            icon="photo-library"
            size="medium"
            onPress={handleSelectFromGallery}
            style={[styles.controlButton, { backgroundColor: 'rgba(255,255,255,0.9)' }]}
            color={theme.colors.primary}
          />
          
          <FAB
            icon="camera"
            size="large"
            onPress={handleTakePhoto}
            disabled={isScanning}
            style={[styles.captureButton, { backgroundColor: theme.colors.primary }]}
          />
          
          <FAB
            icon={flashEnabled ? "flash-on" : "flash-off"}
            size="medium"
            onPress={toggleFlash}
            style={[styles.controlButton, { backgroundColor: 'rgba(255,255,255,0.9)' }]}
            color={theme.colors.primary}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  permissionButton: {
    marginTop: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  instructionsContainer: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignSelf: 'center',
  },
  instructionsText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  scanFrame: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    height: '25%',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: 'white',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 50,
  },
  controlButton: {
    elevation: 8,
  },
  captureButton: {
    elevation: 8,
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningContainer: {
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  scanningText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '500',
  },
});
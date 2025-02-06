import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, PermissionsAndroid, Platform,Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CustomIcon from '../components/CustomIcon';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  ImagePreview: { imageUri: string };
  // Add other screens if necessary
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ImagePreview'>;

const Home = () => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        // Request Camera Permission
        const cameraGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'HarvestSmart needs access to your camera to capture images.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );

        let storageGranted = PermissionsAndroid.RESULTS.GRANTED;

        if (Platform.Version >= 33) {
          storageGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          );
        }

        if (
          cameraGranted === PermissionsAndroid.RESULTS.GRANTED &&
          storageGranted === PermissionsAndroid.RESULTS.GRANTED
        ) {
          setCameraPermission(true);
        } else {
          setCameraPermission(false);
          Alert.alert(
            'Permission Required',
            'Camera and storage permissions are needed to capture images. Please enable them in settings.'
          );
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      setCameraPermission(true);
    }
  };

  const openCamera = async () => {
    if (!cameraPermission) {
      console.log('Camera permission not granted');
      return;
    }

    launchCamera({ mediaType: 'photo', saveToPhotos: true,includeBase64: false }, (response) => {
      if (!response.didCancel && response.assets && response.assets[0].uri) {
        const imageUri = response.assets[0].uri!;
        navigation.navigate('ImagePreview', { imageUri });
      }
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false }, (response) => {
      if (!response.didCancel && response.assets && response.assets[0].uri) {
        const imageUri = response.assets[0].uri!;
        navigation.navigate('ImagePreview', { imageUri });
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>HarvestSmart</Text>

        <Image
          source={require('../../assets/PalmOil.jpg')}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={openCamera}>
            <CustomIcon source={require('../../assets/icons/camera.png')} size={24} />
            <Text style={styles.buttonText}>Capture Image</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={openGallery}>
            <CustomIcon source={require('../../assets/icons/gallery.png')} size={24} />
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>
          Capture or Upload an image to detect Palm oil bunches and classify ripeness
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 500,
    borderRadius: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#374151',
    fontSize: 16,
  },
  description: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
  },
});

export default Home;

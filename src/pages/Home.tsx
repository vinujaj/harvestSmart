import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CustomIcon from '../components/CustomIcon';

const Home = () => {
  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: true,
        cameraType: 'back',
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          console.log('Camera error: ', response.errorMessage);
        } else {
          console.log('Image captured: ', response.assets);
        }
      }
    );
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('Gallery error: ', response.errorMessage);
        } else {
          console.log('Image selected: ', response.assets);
        }
      }
    );
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

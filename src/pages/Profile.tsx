import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackButton from '../components/BackButton';
import { useUser } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

// Define the type for navigation
type NavigationProps = NativeStackNavigationProp<any>;

interface UserProfile {
  name: string;
  email: string;
  createdAt: Date;
}

const Profile = () => {
  const navigation = useNavigation<NavigationProps>();
  const { signOut, user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const userDoc = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
        
        if (userDoc.exists) {
          const data = userDoc.data() as UserProfile;
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await signOut();
      setModalVisible(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.header}>
          <Image
            source={require('../../assets/icons/ProfileIcon.png')}
            style={styles.avatar}
          />
          {loading ? (
            <ActivityIndicator size="small" color="#068042" />
          ) : (
            <>
              <Text style={styles.name}>{userProfile?.name || 'Loading...'}</Text>
              <Text style={styles.farmerId}>Farmer ID: {user?.uid.slice(0, 6).toUpperCase()}</Text>
            </>
          )}
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Image
              source={require('../../assets/icons/Forward.png')}
              style={styles.forwardIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Settings</Text>
            <Image
              source={require('../../assets/icons/Forward.png')}
              style={styles.forwardIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Help & Support</Text>
            <Image
              source={require('../../assets/icons/Forward.png')}
              style={styles.forwardIcon}
            />
          </TouchableOpacity>

          {/* Logout Button - Opens Modal */}
          <TouchableOpacity style={styles.logout} onPress={() => setModalVisible(true)}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Custom Styled Logout Confirmation Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmButton} onPress={handleLogout}>
                <Text style={styles.confirmText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  logout: {
    marginTop: 102,
    backgroundColor: 'red',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    width: '50%',
    alignSelf: 'center',
  },
  logoutText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    marginLeft: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  farmerId: {
    fontSize: 16,
    color: '#6B7280',
  },
  menuContainer: {
    gap: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#374151',
  },
  forwardIcon: {
    width: 24,
    height: 24,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'red',
  },
  confirmText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;

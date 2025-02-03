import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://example.com/profile-avatar.jpg' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.farmerId}>Farmer ID: S02344</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="person-outline" size={24} color="#374151" />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Icon name="chevron-forward" size={24} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="settings-outline" size={24} color="#374151" />
            <Text style={styles.menuText}>Settings</Text>
            <Icon name="chevron-forward" size={24} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Icon name="help-circle-outline" size={24} color="#374151" />
            <Text style={styles.menuText}>Help & Support</Text>
            <Icon name="chevron-forward" size={24} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logout]}>
            <Icon name="log-out-outline" size={24} color="#EF4444" />
            <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
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
  logout: {
    marginTop: 32,
    backgroundColor: '#FEE2E2',
  },
  logoutText: {
    color: '#EF4444',
  },
});

export default Profile;
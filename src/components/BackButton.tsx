import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomIcon from './CustomIcon';

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={() => navigation.goBack()}
    >
      <CustomIcon source={require('../../assets/icons/back.png')} size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    paddingTop: 16,
    position: 'absolute',
    left: 16,
    top: 16,
    
  },
});

export default BackButton;

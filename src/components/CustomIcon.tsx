import React from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';

interface CustomIconProps {
  source: ImageSourcePropType;
  size?: number;
}

const CustomIcon: React.FC<CustomIconProps> = ({ source, size = 24 }) => {
  return <Image source={source} style={[styles.icon, { width: size, height: size }]} />;
};

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
  },
});

export default CustomIcon;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/pages/Login';
import SignUp from './src/pages/SignUp';
import BottomNav from './src/components/BottomNav';
import Home from './src/pages/Home';
import Results from './src/pages/Results';
import ImagePreview from './src/pages/ImagePreview';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainApp: undefined; // This corresponds to BottomNav
  Home: undefined;
  Results: { 
    imageUri: string;
    totalBunches: number;
    ripeLevels: {
      ripe: number;
      underripe: number;
      overripe: number;
      abnormal: number;
    };
  };
  ImagePreview: { imageUri: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="MainApp" component={BottomNav} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Results" component={Results} />
        <Stack.Screen name="ImagePreview" component={ImagePreview} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

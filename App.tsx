import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider, useUser } from './src/context/UserContext';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';
import SplashScreen from 'react-native-splash-screen';

import Login from './src/pages/Login';
import SignUp from './src/pages/SignUp';
import BottomNav from './src/components/BottomNav';
import Home from './src/pages/Home';
import Results from './src/pages/Results';
import ImagePreview from './src/pages/ImagePreview';

type User = FirebaseAuthTypes.User;

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainApp: undefined;
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

const Navigation = () => {
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hide();
    }
  }, [loading]);

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!user ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </>
      ) : (
        // App Stack
        <>
          <Stack.Screen name="MainApp" component={BottomNav} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Results" component={Results} />
          <Stack.Screen name="ImagePreview" component={ImagePreview} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;

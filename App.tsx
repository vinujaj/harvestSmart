import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/pages/Login';
import SignUp from './src/pages/SignUp';
import BottomNav from './src/components/BottomNav';
import Home from './src/pages/Home';

// Define the navigation type
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainApp: undefined; // This corresponds to BottomNav
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
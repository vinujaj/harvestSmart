import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../pages/Home';
import Report from '../pages/Results'; // Make sure this is correctly imported
import Profile from '../pages/Profile';
import Results from '../pages/Results';

const Tab = createBottomTabNavigator();

const BottomNav = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    let iconSource;

                    if (route.name === 'Home') {
                        iconSource = focused
                            ? require('../../assets/icons/home-active.png')
                            : require('../../assets/icons/home.png');
                    } else if (route.name === 'Report') {
                        iconSource = focused
                            ? require('../../assets/icons/report-active.png')
                            : require('../../assets/icons/report.png');
                    } else if (route.name === 'Profile') {
                        iconSource = focused
                            ? require('../../assets/icons/profile-active.png')
                            : require('../../assets/icons/profile.png');
                    }

                    return <Image source={iconSource} style={styles.icon} />;
                },
                tabBarActiveTintColor: '#34A853',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarStyle: styles.tabBar,
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Report" component={Results} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    tabBar: {
        height: 60,
        paddingBottom: 10,
    },
});

export default BottomNav;

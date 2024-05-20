import React, { useEffect } from 'react'

import { StatusBar } from 'expo-status-bar';

import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens:
import HomeScreen from '../../screens/HomeScreen';
import ShortStoriesScreen from '../../screens/ShortStoriesScreen';
import UnderConstruction from '../../screens/UnderConstruction';
import SearchScreen from '../../screens/SearchScreen';
import ProfileScreen from '../../screens/ProfileScreen';

// Components:
import NavbarComponent from '../navbar/NavbarComponent';

import { CurrentRouteProvider, useCurrentRoute } from '../../context/CurrentRouteContext';

const Stack = createNativeStackNavigator();

const UserStack = () => {

    const navigationRef = useNavigationContainerRef();
    const { setCurrentRoute } = useCurrentRoute();

    useEffect(() => {
        const unsubscribe = navigationRef.addListener('state', () => {
            const currentRouteName = navigationRef.getCurrentRoute().name;
            setCurrentRoute(currentRouteName);
        });
        return unsubscribe;
    }, [navigationRef]);

    return (
        <NavigationContainer ref={navigationRef}>
            <StatusBar style='auto' />
            <Stack.Navigator initialRouteName="HomeScreen">
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ShortStoriesScreen" component={ShortStoriesScreen} options={{ headerShown: false }} />
                <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />

                <Stack.Screen name="UnderConstruction" component={UnderConstruction} options={{ headerShown: false }} />
            </Stack.Navigator>
            <NavbarComponent />
        </NavigationContainer>
    )
}

export default UserStack
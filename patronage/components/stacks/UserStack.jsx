import React from 'react'

import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import ShortStoriesScreen from '../../screens/ShortStoriesScreen';
import UnderConstruction from '../../screens/UnderConstruction';
import NavbarComponent from '../navbar/NavbarComponent';

const Stack = createNativeStackNavigator();

const UserStack = () => {
    return (
        <NavigationContainer>
            <StatusBar style='auto' />
            <Stack.Navigator initialRouteName="HomeScreen">
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ShortStoriesScreen" component={ShortStoriesScreen} options={{ headerShown: false }} />

                <Stack.Screen name="UnderConstruction" component={UnderConstruction} options={{ headerShown: false }} />
            </Stack.Navigator>
            <NavbarComponent />
        </NavigationContainer>
    )
}

export default UserStack
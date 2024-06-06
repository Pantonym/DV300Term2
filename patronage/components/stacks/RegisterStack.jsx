import React from 'react'

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen';

// REGISTER OR LOG IN STACK

const Stack = createNativeStackNavigator();

const RegisterStack = () => {
    return (
        <NavigationContainer>

            <StatusBar style='auto' />

            <Stack.Navigator initialRouteName="LoginScreen">
                {/* Login and register screens */}
                <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
            </Stack.Navigator>

            {/* No navbar as the user should not be able to leave this stack without logging in */}

        </NavigationContainer>
    )
}

export default RegisterStack
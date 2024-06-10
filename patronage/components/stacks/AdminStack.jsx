import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useCurrentRoute } from '../../context/CurrentRouteContext';

// Screens:
import HomeScreen from '../../screens/HomeScreen';
import ShortStoriesScreen from '../../screens/ShortStoriesScreen';
import UnderConstruction from '../../screens/UnderConstruction';
import SearchScreen from '../../screens/SearchScreen';
import GenreScreen from '../../screens/ShortStories/GenreScreen';
import LeaderboardScreen from '../../screens/ShortStories/LeaderboardScreen';
import PersonalStoriesScreen from '../../screens/Profiles/PersonalStoriesScreen';
import SettingsScreen from '../../screens/Profiles/SettingsScreen';
import SingleStoryEditorScreen from '../../screens/Profiles/SingleStoryEditorScreen';
import StoryScreen from '../../screens/ShortStories/StoryScreen';
import AuthorProfileScreen from '../../screens/ShortStories/AuthorProfileScreen';
import AuthorSingleStoryScreen from '../../screens/ShortStories/AuthorSingleStoryScreen';
import AuthorStoriesScreen from '../../screens/ShortStories/AuthorStoriesScreen';
import UserSearchScreen from '../../screens/UserSearchScreen';
import AdminProfileScreen from '../../screens/AdminProfileScreen';
import FollowedAuthorsScreen from '../../screens/Profiles/FollowedAuthorsScreen';

// Components
import AdminNavbarComponent from '../navbar/AdminNavbarComponent';

// ADMIN STACK

const Stack = createNativeStackNavigator();

const AdminStack = () => {
    const navigationRef = useNavigationContainerRef();
    const { currentRoute, setCurrentRoute } = useCurrentRoute();

    useEffect(() => {
        const unsubscribe = navigationRef.addListener('state', () => {
            const currentRouteName = navigationRef.getCurrentRoute().name;
            setCurrentRoute(currentRouteName);
        });
        return unsubscribe;
    }, [navigationRef]);

    // Screens where the navbar should be hidden
    const hideNavbarRoutes = ['StoryScreen', 'SingleStoryEditorScreen'];

    return (
        <NavigationContainer ref={navigationRef}>
            <StatusBar style='auto' />
            <Stack.Navigator initialRouteName="HomeScreen">
                {/* Index Screen */}
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />

                {/* Search Screen */}
                <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />

                {/* Profile Screen Flow */}
                <Stack.Screen name="AdminProfileScreen" component={AdminProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="PersonalStoriesScreen" component={PersonalStoriesScreen} options={{ headerShown: false }} />
                <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ headerShown: false }} />
                <Stack.Screen name="SingleStoryEditorScreen" component={SingleStoryEditorScreen} options={{ headerShown: false }} />
                <Stack.Screen name="FollowedAuthorsScreen" component={FollowedAuthorsScreen} options={{ headerShown: false }} />

                {/* User Search Screen */}
                <Stack.Screen name="UserSearchScreen" component={UserSearchScreen} options={{ headerShown: false }} />

                {/* --Reading User Flow */}
                <Stack.Screen name="ShortStoriesScreen" component={ShortStoriesScreen} options={{ headerShown: false }} />
                <Stack.Screen name="GenreScreen" component={GenreScreen} options={{ headerShown: false }} />
                <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} options={{ headerShown: false }} />
                <Stack.Screen name="StoryScreen" component={StoryScreen} options={{ headerShown: false }} />

                {/* ----View different user profiles */}
                <Stack.Screen name="AuthorProfileScreen" component={AuthorProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="AuthorStoriesScreen" component={AuthorStoriesScreen} options={{ headerShown: false }} />
                <Stack.Screen name="AuthorSingleStoryScreen" component={AuthorSingleStoryScreen} options={{ headerShown: false }} />

                {/* 404/Not Found Screen */}
                <Stack.Screen name="UnderConstruction" component={UnderConstruction} options={{ headerShown: false }} />
            </Stack.Navigator>

            {/* Conditionally render the Navbar */}
            {!hideNavbarRoutes.includes(currentRoute) && <AdminNavbarComponent />}
        </NavigationContainer>
    )
}

export default AdminStack
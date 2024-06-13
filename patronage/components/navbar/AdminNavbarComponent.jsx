import { View, StyleSheet, Animated, Dimensions } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useCurrentRoute } from '../../context/CurrentRouteContext';

// NAVBAR FOR ADMINS

// Gets the width of the window, then creates four equal tabs from the width to control where the indicator will go.
const { width } = Dimensions.get('window');
const tabWidth = width / 4;  // Assuming 4 tabs

const AdminNavbarComponent = () => {
    const navigation = useNavigation();

    // Tests to see what the current active route is through using the CurrentRouteContext
    const { currentRoute } = useCurrentRoute();

    // Changes the name of the icons based on which route is currently active. This allows it to change to a filled version if selected
    const getIconName = (baseName, activeNames) => {
        return activeNames.includes(currentRoute) ? baseName : `${baseName}-outline`;
    };

    // Used for the indicator at the bottom of the navbar, which changes to be below the currently active item
    const indicatorPosition = useRef(new Animated.Value(0)).current;

    // This controls in which tab the indicator will be in when specific screens are active
    useEffect(() => {
        let newIndex;
        switch (currentRoute) {
            // All pages that match these names will have the index be set to 0
            // case 'HomeScreen':
            case 'ShortStoriesScreen':
            case 'GenreScreen':
            case 'LeaderboardScreen':
            case 'StoryScreen':
                newIndex = 0;
                break;
            // All pages that match these names will have the index be set to 1
            case 'UserSearchScreen':
            case 'AuthorProfileScreen':
            case 'AuthorStoriesScreen':
            case 'AuthorSingleStoryScreen':
                newIndex = 1;
                break;
            // Etc.
            case 'SearchScreen':
                newIndex = 2;
                break;
            case 'AdminProfileScreen':
            case 'SettingsScreen':
            case 'PersonalStoriesScreen':
            case 'SingleStoryEditorScreen':
            case 'FollowedAuthorsScreen':
                newIndex = 3;
                break;
            default:
                newIndex = 0;
        }
        // Moves the indicator
        Animated.spring(indicatorPosition, {
            toValue: newIndex * tabWidth,
            useNativeDriver: true,
        }).start();
    }, [currentRoute]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navbar}>

                {/* The item sends several pages through as params because in each of them this icon should be active as they are sub pages */}
                <Ionicons
                    style={styles.navImage}
                    size={35}
                    color={'white'}
                    // name={getIconName('book', ['HomeScreen', 'ShortStoriesScreen', 'GenreScreen', 'LeaderboardScreen', 'StoryScreen'])}
                    // onPress={() => navigation.navigate('HomeScreen')}
                    name={getIconName('book', ['ShortStoriesScreen', 'GenreScreen', 'LeaderboardScreen', 'StoryScreen'])}
                    onPress={() => navigation.navigate('ShortStoriesScreen')}
                />

                <Ionicons
                    style={styles.navImage}
                    size={35}
                    color={'white'}
                    name={getIconName('body', ['UserSearchScreen', 'AuthorProfileScreen', 'AuthorStoriesScreen', 'AuthorSingleStoryScreen'])}
                    onPress={() => navigation.navigate('UserSearchScreen')}
                />

                <Ionicons
                    style={styles.navImage}
                    size={35}
                    color={'white'}
                    name={getIconName('search', ['SearchScreen'])}
                    onPress={() => navigation.navigate('SearchScreen')}
                />

                <Ionicons
                    style={styles.navImage}
                    size={35}
                    color={'white'}
                    name={getIconName('person', ['AdminProfileScreen', 'SettingsScreen', 'PersonalStoriesScreen', 'SingleStoryEditorScreen', 'FollowedAuthorsScreen'])}
                    onPress={() => navigation.navigate('AdminProfileScreen')}
                />

            </View>

            {/* The indicator */}
            <Animated.View
                style={[
                    styles.indicator,
                    {
                        transform: [{ translateX: indicatorPosition }],
                    },
                ]}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: 100,
        backgroundColor: "#332511",
        padding: 20
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    navImage: {
        margin: '9%',
        marginTop: 0,
        marginBottom: 0,
    },
    indicator: {
        position: 'absolute',
        bottom: 30,
        width: tabWidth,
        height: 10,
        backgroundColor: '#9A3E53',
        borderRadius: 15
    },
});

export default AdminNavbarComponent
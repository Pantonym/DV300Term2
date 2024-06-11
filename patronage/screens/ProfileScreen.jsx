import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { getUser } from '../services/accountService';
import { handleSignOut } from '../services/authService';
import { getShortStoryByID } from '../services/storiesService';

const ProfileScreen = ({ navigation }) => {
    // User data
    const [email, setEmail] = useState(null);
    const [userID, setUserID] = useState(null);
    const [userData, setUserData] = useState(null);
    const [followedAuthors, setFollowedAuthors] = useState([]);
    const [faves, setFaves] = useState([]);

    // loader
    const [loading, setLoading] = useState(true);

    // Get user data
    const getUserEmail = async () => {
        const userEmail = await AsyncStorage.getItem('UserEmail');
        setEmail(userEmail);
    };

    const getUserID = async () => {
        const userID = await AsyncStorage.getItem('UserID');
        setUserID(userID);
    };

    useEffect(() => {
        getUserEmail();
        getUserID();
    }, []);

    // When the screen is opened, refresh the data to show changes
    useFocusEffect(
        useCallback(() => {
            if (userID) {
                handleGetProfile();
            }
        }, [userID])
    );

    // Get data from the user who is logged in
    const handleGetProfile = async () => {
        setLoading(true);
        const data = await getUser(userID);
        setUserData(data);
        
        if (data.followedAuthors) {
            const authors = await Promise.all(data.followedAuthors.map(async authorID => {
                const authorData = await getUser(authorID);
                return { ...authorData, id: authorID };
            }));
            setFollowedAuthors(authors);
        }

        if (data.favouriteStories) {
            const faveStories = await Promise.all(data.favouriteStories.map(async storyID => {
                const storyData = await getShortStoryByID(storyID);
                return { ...storyData, id: storyID };
            }));
            setFaves(faveStories);
        }

        setLoading(false);
    };

    // Sign out
    const handleLogout = async () => {
        handleSignOut();
    };

    // Confirm if the user wants to sign out
    const confirmLogout = () => {
        Alert.alert(
            "Confirm Sign Out",
            "Are you sure you want to sign out?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Sign out cancelled"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: handleLogout
                }
            ],
            { cancelable: false }
        );
    };

    // Get the color that corresponds to the place the user achieved
    const getCardColor = (place) => {
        switch (place) {
            case 'gold':
                return '#FFD700';
            case 'silver':
                return '#C0C0C0';
            case 'bronze':
                return '#CD7F32';
            default:
                return '#FFFFFF';
        }
    };

    // Map through the awards array to render each award. This is done to ensure any amount of awards can be loaded.
    const renderRewards = () => {
        if (userData && userData.awards) {
            return userData.awards.map((award, index) => (
                <View key={index} style={[styles.rewardCard, { backgroundColor: getCardColor(award.place) }]}>
                    <Text style={styles.rewardText}>{award.genre}</Text>
                    <Text style={styles.rewardText}>{award.year}</Text>
                </View>
            ));
        }
        return null;
    };

    // Loader
    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#332511" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                        <Image style={styles.imgBack} source={require("../assets/images/Arrow.png")} />
                    </TouchableOpacity>
                    <Text style={styles.header}>Patronage</Text>
                </View>

                {/* Render if the user's data has been collected. This stops the program from rendering output before it is ready */}
                {userData && (
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                        <Image
                            style={styles.profileIcon}
                            source={{ uri: userData.userImg }}
                            resizeMode="cover"
                        />
                        <Text style={styles.username}>{userData.username}</Text>
                        <Text style={styles.email}>{userData.email}</Text>

                        {/* Awards the user has */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
                            {renderRewards()}
                        </ScrollView>

                        {/* Go to your follows */}
                        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('FollowedAuthorsScreen', { authors: followedAuthors })}>
                            <Text style={styles.profileButtonText}>Followed Authors ({followedAuthors.length})</Text>
                        </TouchableOpacity>

                        {/* Go to favourited stories */}
                        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('FavouriteStoriesScreen', { favouriteStories: faves })}>
                            <Text style={styles.profileButtonText}>Favourite Stories ({faves.length})</Text>
                        </TouchableOpacity>

                        {/* Go to your stories to edit, publish unpublish or delete them */}
                        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('PersonalStoriesScreen')}>
                            <Text style={styles.profileButtonText}>Stories</Text>
                        </TouchableOpacity>

                        {/* Go to the settings screen to edit your information */}
                        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('SettingsScreen')}>
                            <Text style={styles.profileButtonText}>Settings</Text>
                        </TouchableOpacity>

                        {/* Log out */}
                        <TouchableOpacity style={styles.profileButton} onPress={confirmLogout}>
                            <Text style={styles.profileButtonText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        display: 'flex',
        flex: 1,
        padding: 20,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: "#F6EEE3",
        flexDirection: 'column',
        textAlign: 'center'
    },
    header: {
        fontFamily: 'Italianno',
        fontSize: 64,
        padding: 20,
        paddingBottom: 0,
        paddingTop: 0,
        textAlign: 'center'
    },
    imgBack: {
        height: 36,
        width: 60,
        marginTop: 15
    },
    profileIcon: {
        width: 125,
        height: 125,
        borderRadius: 62.5,
        overflow: 'hidden',
        marginBottom: 5,
        borderWidth: 3,
        borderColor: "#332511"
    },
    username: {
        fontSize: 32,
        fontFamily: 'Baskervville'
    },
    email: {
        fontSize: 20,
        fontFamily: 'Baskervville'
    },
    carousel: {
        paddingVertical: 20,
        marginBottom: 20
    },
    rewardCard: {
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        height: 140,
        width: 185
    },
    rewardText: {
        fontSize: 32,
        fontFamily: 'Baskervville',
    },
    profileButton: {
        width: '90%',
        borderBottomWidth: 2,
        marginTop: 5,
        marginBottom: 10
    },
    profileButtonText: {
        fontSize: 24,
        fontFamily: 'Baskervville',
        marginBottom: 5
    }
});

export default ProfileScreen;
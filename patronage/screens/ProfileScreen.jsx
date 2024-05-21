import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native'; // Import Alert
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser } from '../services/accountService';
import { handleSignOut } from '../services/authService';

const ProfileScreen = ({ navigation }) => {
    const [email, setEmail] = useState(null);
    const [userID, setUserID] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (userID) {
            handleGetProfile();
        }
    }, [userID]);

    const handleGetProfile = async () => {
        setLoading(true);
        const data = await getUser(userID);
        setUserData(data);
        setLoading(false);
    };

    const handleLogout = async () => {
        handleSignOut();
    };

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

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#332511" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <Image style={styles.imgBack} source={require("../assets/images/Arrow.png")} />
                </TouchableOpacity>
                <Text style={styles.header}>Patronage</Text>
            </View>

            {userData && (
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Image
                        style={styles.profileIcon}
                        source={require('../assets/icons/GlenIcon.jpg')}
                        resizeMode="cover"
                    />
                    <Text style={styles.username}>{userData.username}</Text>
                    <Text style={styles.email}>{userData.email}</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
                        {renderRewards()}
                    </ScrollView>

                    <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('PersonalStoriesScreen')}>
                        <Text style={styles.profileButtonText}>Stories</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('SettingsScreen')}>
                        <Text style={styles.profileButtonText}>Settings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.profileButton} onPress={confirmLogout}>
                        <Text style={styles.profileButtonText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        marginBottom: 5
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
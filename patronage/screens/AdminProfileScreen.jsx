import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { getUser } from '../services/accountService';
import { handleSignOut } from '../services/authService';

const AdminProfileScreen = ({ navigation }) => {
    // User data
    const [email, setEmail] = useState(null);
    const [userID, setUserID] = useState(null);
    const [userData, setUserData] = useState(null);

    // loading
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

    // Loading
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

                    {/* Margins don't seem to work with the email not profile button, so this is a spacer used to add spacing between elements */}
                    <View style={{ padding: 15 }}></View>

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

export default AdminProfileScreen;
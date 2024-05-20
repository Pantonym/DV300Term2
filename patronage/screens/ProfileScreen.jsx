import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
    // Get the email from asynchronous storage
    const [email, setEmail] = useState(null);

    useEffect(() => {
        const getUserEmail = async () => {
            const userEmail = await AsyncStorage.getItem('UserEmail');
            setEmail(userEmail);
        };

        getUserEmail();
    }, []);

    // example data for a user
    const userData = {
        email: email,
        username: 'Glen Doe',
        icon: require('../assets/icons/GlenIcon.jpg'),
        rewards: [
            { genre: 'Fantasy', year: '2023', place: 'gold' },
            { genre: 'Horror', year: '2024', place: 'silver' },
            { genre: 'Sci-Fi', year: '2024', place: 'bronze' }
        ]
    }

    // Function to get card color based on place
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

    // Dynamically render the rewards
    const renderRewards = () => {
        return userData.rewards.map((reward, index) => (
            <View key={index} style={[styles.rewardCard, { backgroundColor: getCardColor(reward.place) }]}>
                <Text style={styles.rewardText}>{reward.genre}</Text>
                <Text style={styles.rewardText}>{reward.year}</Text>
            </View>
        ));
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <Image
                        style={styles.imgBack}
                        source={require("../assets/images/Arrow.png")} />
                </TouchableOpacity>

                <Text style={styles.header}>
                    Patronage
                </Text>
            </View>

            <View style={{ flexDirection: 'column', alignItems: 'center' }}>

                <Image
                    style={styles.profileIcon}
                    source={userData.icon}
                    resizeMode="contain"
                />

                <Text style={styles.username}>{userData.username}</Text>

                {/* Rewards slider goes here */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
                    {renderRewards()}
                </ScrollView>

                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('PersonalStoriesScreen')}>
                    <Text style={styles.profileButtonText}>Stories</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('SettingsScreen')}>
                    <Text style={styles.profileButtonText}>Settings</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        padding: 20,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: "#F6EEE3",
        flexDirection: 'column',
        textAlign: 'center',
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

export default ProfileScreen
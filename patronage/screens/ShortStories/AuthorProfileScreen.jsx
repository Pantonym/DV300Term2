import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUser } from '../../services/accountService';

const AuthorProfileScreen = ({ route, navigation }) => {
    const { authorID } = route.params;
    const [authorProfile, setAuthorProfile] = useState(null);
    const [profileImg, setProfileImg] = useState(null);

    useEffect(() => {
        const fetchAuthorProfile = async () => {
            const profile = await getUser(authorID);
            setAuthorProfile(profile);
            if (profile.userImg) {
                // get the user's profile image link
                setProfileImg(profile.userImg);
            }
        };

        fetchAuthorProfile();
    }, [authorID]);

    if (!authorProfile) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#332511" />
            </View>
        );
    }

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
        if (authorProfile && authorProfile.awards && authorProfile.awards.length > 0) {

            return authorProfile.awards.map((award, index) => (
                <View key={index} style={[styles.rewardCard, { backgroundColor: getCardColor(award.place) }]}>
                    <Text style={styles.rewardText}>{award.genre}</Text>
                    <Text style={styles.rewardText}>{award.year}</Text>
                </View>
            ));

        } else {

            return (
                <Text style={styles.noAwardsText}>No Awards Yet</Text>
            );

        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('ShortStoriesScreen')}>
                    <Image
                        style={styles.imgBack}
                        source={require("../../assets/images/Arrow.png")} />
                </TouchableOpacity>
                <Text style={styles.header}>Patronage</Text>
            </View>

            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                {/* If the image does not load, load the preset image. */}
                {profileImg ? (
                    <Image
                        style={styles.profileIcon}
                        source={{ uri: profileImg }}
                        resizeMode="cover"
                    />
                ) : (
                    <Image
                        style={styles.profileIcon}
                        source={require('../../assets/icons/GlenIcon.jpg')}
                        resizeMode="cover"
                    />
                )}
                <Text style={styles.username}>{authorProfile.username}</Text>
                <Text style={styles.email}>{authorProfile.email}</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
                    {renderRewards()}
                </ScrollView>

                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('AuthorStoriesScreen', authorID)}>
                    <Text style={styles.profileButtonText}>View Published Stories</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}

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
    noAwardsText: {
        fontSize: 24,
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

export default AuthorProfileScreen
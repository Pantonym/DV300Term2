import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUser } from '../../services/accountService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { arrGenres } from '../../context/genres';

const AuthorProfileScreen = ({ route, navigation }) => {
    const { authorID } = route.params;
    const [authorProfile, setAuthorProfile] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState('Adventure');
    const [selectedYear, setSelectedYear] = useState('2024')

    // Genre data
    const genres = arrGenres;

    const years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

    // Admin useStates
    const [isAdmin, setIsAdmin] = useState();
    const [isAddingReward, setIsAddingReward] = useState(false);

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

    useEffect(() => {
        const fetchUserData = async () => {
            const email = await AsyncStorage.getItem('UserEmail');
            setIsAdmin(email === "greatquill.patronage@gmail.com")
        };

        fetchUserData();
    }, []);

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

    const handleGenreChange = (itemValue, itemIndex) => {
        setSelectedGenre(itemValue);
    };

    const handleYearChange = (itemValue, itemIndex) => {
        setSelectedYear(itemValue);
    };

    const addReward = () => {
        setIsAddingReward(true)
    }

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
                        source={require('../../assets/icons/ProfileIcon.png')}
                        resizeMode="cover"
                    />
                )}

                <Text style={styles.username}>{authorProfile.username}</Text>
                <Text style={styles.email}>{authorProfile.email}</Text>

                {isAdmin === true && isAddingReward === false ? (
                    <TouchableOpacity style={styles.rewardBtn} onPress={addReward}>
                        <Text style={styles.rewardBtnText}>Add Reward</Text>
                    </TouchableOpacity>
                ) : isAdmin === true && isAddingReward === true ? (
                    <View>
                        <Text style={styles.inputLabelPicker}>Choose a Genre</Text>
                        <Picker
                            selectedValue={selectedGenre}
                            style={styles.picker}
                            onValueChange={handleGenreChange}
                        >
                            {genres.map((genre) => (
                                <Picker.Item key={genre.value} label={genre.label} value={genre.value} />
                            ))}
                        </Picker>

                        <Text style={styles.inputLabelPicker}>Choose a Year</Text>
                        <Picker
                            selectedValue={selectedYear}
                            style={styles.picker}
                            onValueChange={handleYearChange}
                        >
                            {years.map((year, index) => (
                                <Picker.Item key={index} label={year} value={year} />
                            ))}
                        </Picker>

                        <TouchableOpacity style={styles.rewardBtnCancel} onPress={() => setIsAddingReward(false)}>
                            <Text style={styles.rewardBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                ) : null}

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
    },
    rewardBtn: {
        backgroundColor: '#9A3E53',
        padding: 15,
        borderRadius: 25,
        marginTop: 15
    },
    rewardBtnText: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'Baskervville'
    },
    inputLabelPicker: {
        fontFamily: 'Baskervville',
        fontSize: 24,
        marginBottom: 10,
        backgroundColor: '#F6EEE3',
        zIndex: 9,
        paddingTop: 20
    },
    picker: {
        marginTop: -80
    },
    rewardBtnCancel: {
        backgroundColor: '#9A3E53',
        padding: 15,
        borderRadius: 25,
        marginTop: -40
    }
});

export default AuthorProfileScreen
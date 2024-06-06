import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, ScrollView, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addAward, getUser, removeReward } from '../../services/accountService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { arrGenres } from '../../context/genres';

const AuthorProfileScreen = ({ route, navigation }) => {
    const { authorID } = route.params;
    const [authorProfile, setAuthorProfile] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState('Sci-Fi');
    const [selectedYear, setSelectedYear] = useState('2024')
    const [selectedPlace, setSelectedPlace] = useState('gold')

    // Awards data
    const genres = arrGenres;
    const years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    const places = ['bronze', 'silver', 'gold'];

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

    const handlePlaceChange = (itemValue, itemIndex) => {
        setSelectedPlace(itemValue);
    };

    const handleYearChange = (itemValue, itemIndex) => {
        setSelectedYear(itemValue);
    };

    const addReward = async () => {
        try {
            await addAward(authorID, selectedGenre, selectedPlace, selectedYear);
            Alert.alert("Award successfully added")
        } catch (error) {
            Alert.alert("Error adding award")
        }

    }

    const confirmRemoveReward = (award) => {
        Alert.alert(
            "Confirm Remove Award",
            "Are you sure you want to remove the award?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Reward removing cancelled"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => handleRewardRemove(award)
                }
            ],
            { cancelable: false }
        );
    }

    const handleRewardRemove = async (award) => {
        try {
            await removeReward(authorID, award)
            Alert.alert("Award successfully removed")
        } catch (error) {
            Alert.alert("Error removing award")
        }

    }

    const renderRewards = () => {
        if (authorProfile && authorProfile.awards && authorProfile.awards.length > 0) {

            return authorProfile.awards.map((award, index) => (
                <View key={index} style={[styles.rewardCard, { backgroundColor: getCardColor(award.place) }]}>
                    <Text style={styles.rewardText}>{award.genre}</Text>
                    <Text style={styles.rewardText}>{award.year}</Text>

                    {isAdmin ? (
                        <TouchableOpacity style={styles.removeBtn} onPress={() => confirmRemoveReward(award)}>
                            <Text style={styles.removeBtnText}>Remove Reward</Text>
                        </TouchableOpacity>
                    ) : null}

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
            <ScrollView>
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
                        <TouchableOpacity style={styles.rewardBtn} onPress={() => setIsAddingReward(true)}>
                            <Text style={styles.rewardBtnText}>Add Reward</Text>
                        </TouchableOpacity>
                    ) : isAdmin === true && isAddingReward === true ? (
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Picker
                                    selectedValue={selectedGenre}
                                    style={styles.picker}
                                    onValueChange={handleGenreChange}
                                >
                                    {genres.map((genre) => (
                                        <Picker.Item key={genre.value} label={genre.label} value={genre.value} />
                                    ))}
                                </Picker>
                                <Picker
                                    selectedValue={selectedPlace}
                                    style={styles.picker}
                                    onValueChange={handlePlaceChange}
                                >
                                    {places.map((places, index) => (
                                        <Picker.Item key={index} label={places} value={places} />
                                    ))}
                                </Picker>

                            </View>

                            <View style={{ alignItems: 'center' }}>
                                <Picker
                                    selectedValue={selectedYear}
                                    style={styles.picker}
                                    onValueChange={handleYearChange}
                                >
                                    {years.map((year, index) => (
                                        <Picker.Item key={index} label={year} value={year} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity style={styles.rewardBtnConfirm} onPress={addReward}>
                                    <Text style={styles.rewardBtnText}>Confirm</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.rewardBtnCancel} onPress={() => setIsAddingReward(false)}>
                                    <Text style={styles.rewardBtnTextDark}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    ) : null}

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
                        {renderRewards()}
                    </ScrollView>

                    <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('AuthorStoriesScreen', authorID)}>
                        <Text style={styles.profileButtonText}>View Published Stories</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
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
    rewardBtnTextDark: {
        color: 'black',
        fontSize: 22,
        fontFamily: 'Baskervville'
    },
    picker: {
        width: 200
    },
    inputLabelPicker: {
        fontFamily: 'Baskervville',
        fontSize: 24,
        marginBottom: 10,
        zIndex: 9,
        paddingTop: 20
    },
    inputLabelPickerPlace: {
        fontFamily: 'Baskervville',
        fontSize: 24,
        marginBottom: 10,
        zIndex: 9,
        paddingTop: 20
    },
    inputLabelPickerYear: {
        fontFamily: 'Baskervville',
        fontSize: 24,
        marginBottom: 10,
        zIndex: 9,
        paddingTop: 20
    },
    rewardBtnConfirm: {
        backgroundColor: '#9A3E53',
        padding: 15,
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    rewardBtnCancel: {
        backgroundColor: 'none',
        padding: 15,
        borderRadius: 25
    },
    removeBtn: {
        backgroundColor: 'none',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 25,
        marginTop: 15
    },
    removeBtnText: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Baskervville',
        textDecorationLine: 'underline'
    }
});

export default AuthorProfileScreen
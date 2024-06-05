import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuthorUsername, rateStory } from '../../services/storiesService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

// TODO: 1-10 Stars where you select a star and those before it change color to match. This will replace the number input to choose a rating out of 10.
// TODO: Change database to use sub collections instead of nested arrays Future Implementation

const StoryScreen = ({ route, navigation }) => {
    const story = route.params.story;
    const author = route.params.authorUsername;

    const [rating, setRating] = useState('');
    const [views, setViews] = useState();
    const [username, setUsername] = useState('');
    const [userID, setUserID] = useState('');
    const [isAuthor, setIsAuthor] = useState();
    const [hasVoted, setHasVoted] = useState(false);

    // Loading state for initial loading
    const [loading, setLoading] = useState(true);

    // Loader state for having submitted a rating
    const [loadingVisible, setLoadingVisible] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const id = await AsyncStorage.getItem('UserID');
            setUserID(id);
            if (id) {
                const usernameReceived = await getAuthorUsername(id);
                setUsername(usernameReceived);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (username && userID) {
            setViews(story.chapters[0].ratings.length);
            setIsAuthor(author === username);

            // Check if user has already voted
            let userHasVoted = false;
            for (let k = 0; k < story.chapters[0].ratings.length; k++) {
                if (userID === story.chapters[0].ratings[k].voterID) {
                    setRating(story.chapters[0].ratings[k].voteAmount)
                    userHasVoted = true;
                    break;
                }
            }

            setHasVoted(userHasVoted);

            setLoading(false);
        }
    }, [username, userID]);

    // Confirm the submission of the user's rating
    const confirmRating = () => {
        Alert.alert(
            "Confirm Rating",
            "Are you sure you want to rate this story? You will not be able to change your rating later.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Rating cancelled"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: handleRating
                }
            ],
            { cancelable: false }
        );
    };

    // Handle rating function
    const handleRating = async () => {
        const ratingValue = parseInt(rating, 10);

        // Validation
        if (ratingValue < 1 || ratingValue > 10 || isNaN(ratingValue)) {
            Alert.alert('Invalid Rating', 'Please enter a rating between 1 and 10.');
            return;
        }

        try {
            // Show loader
            setLoadingVisible(true);

            // Submit the data to add the rating
            const result = await rateStory(story.authorID, ratingValue, story.title, story.genre);
            if (result) {
                Alert.alert('Success', 'Your rating has been submitted.');
            } else {
                Alert.alert('Error', 'You have already voted on this story.');
            }
        } catch (error) {
            console.error('Error rating the story:', error.message);
            Alert.alert('Error', 'Failed to rate the story. Please try again later.');
        } finally {
            // Hide loader
            setLoadingVisible(false);
        }
    };

    // Render stars to select the amount out of 10
    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 10; i++) {
            stars.push(
                <View key={i} style={styles.starContainer}>
                    <TouchableOpacity onPress={() => setRating(i)} disabled={isAuthor || hasVoted || loadingVisible}>
                        <Ionicons
                            name={i <= rating ? "star" : "star-outline"}
                            size={32}
                            color={i <= rating ? "#FFD700" : "#D3D3D3"}
                        />
                    </TouchableOpacity>
                    <Text style={styles.starAmount}>{i}</Text>
                </View>
            );
        }
        return stars;
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}>
            <SafeAreaView style={styles.container}>
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            style={styles.imgBack}
                            source={require("../../assets/images/Arrow.png")} />
                    </TouchableOpacity>
                    <Text style={styles.header}>Patronage</Text>
                </View>

                <ScrollView>
                    <View>
                        <Text style={styles.storyTitle}>{story.title}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AuthorProfileScreen', { authorID: story.authorID })}>
                            <Text style={styles.storyAuthor}> by {author}</Text>
                        </TouchableOpacity>

                        {loading ? (
                            <ActivityIndicator size="large" color="#9A3E53" />
                        ) : (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.storyRatings}>{views} Ratings</Text>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.averageRating}>{story.averageRating.toFixed(1)} / 10</Text>
                                    <Ionicons
                                        size={25}
                                        color={'purple'}
                                        name={'star'}
                                    />
                                </View>
                            </View>
                        )}

                        <View
                            style={{
                                borderBottomColor: 'black',
                                borderBottomWidth: 2.5,
                                width: '100%',
                                alignSelf: 'center',
                                marginBottom: 20,
                                marginTop: 10
                            }}
                        />

                        <Text style={styles.storyContent}>{story.chapters[0].chapterContent}</Text>

                        {isAuthor ? (
                            null
                        ) : (
                            <View style={styles.starsContainer}>
                                {renderStars()}
                            </View>
                        )}

                        {/* Displays a disabled button if the viewer is the author of the story */}
                        {isAuthor ? (
                            <View>
                                <TouchableOpacity style={[
                                    styles.btnStart,
                                    { opacity: 0.5 },
                                ]} disabled>
                                    <Text style={styles.btnStartText}>Rate Story</Text>
                                </TouchableOpacity>
                                <Text style={styles.btnStartTextAuthor}>Authors cannot rate their own stories</Text>
                            </View>
                        ) : hasVoted ? (
                            <View>
                                <TouchableOpacity style={[
                                    styles.btnStart,
                                    { opacity: 0.5 },
                                ]} disabled>
                                    <Text style={styles.btnStartText}>Rate Story</Text>
                                </TouchableOpacity>
                                <Text style={styles.btnStartTextAuthor}>You have already voted</Text>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.btnStart} onPress={confirmRating} disabled={loadingVisible}>
                                <Text style={styles.btnStartText}>Rate Story</Text>
                            </TouchableOpacity>
                        )}

                    </View>
                </ScrollView>

                {/* Loader overlay */}
                {loadingVisible && (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color="#F6EEE3" />
                    </View>
                )}

            </SafeAreaView>
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    container: {
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
        paddingTop: 0,
        paddingBottom: 0,
        textAlign: 'center'
    },
    imgBack: {
        height: 36,
        width: 60,
        marginTop: 15
    },
    storyTitle: {
        fontFamily: 'Baskervville',
        fontSize: 40,
        textAlign: 'center'
    },
    storyAuthor: {
        fontFamily: 'Baskervville',
        fontSize: 26,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    storyRatings: {
        fontFamily: 'Baskervville',
        fontSize: 22,
        textAlign: 'left',
    },
    storyContent: {
        fontFamily: 'Baskervville',
        fontSize: 18
    },
    ratingInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 20,
        alignSelf: 'center',
        width: '80%',
        fontFamily: 'Baskervville',
        fontSize: 18
    },
    btnStart: {
        height: 50,
        width: 150,
        backgroundColor: '#9A3E53',
        borderRadius: 12,
        justifyContent: 'center',
        marginTop: 5,
        alignSelf: 'center'
    },
    btnStartText: {
        color: 'white',
        fontFamily: 'Baskervville',
        fontSize: 24,
        textAlign: 'center'
    },
    btnStartTextAuthor: {
        color: 'black',
        fontFamily: 'Baskervville',
        fontSize: 24,
        textAlign: 'center'
    },
    loader: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    averageRating: {
        fontFamily: 'Baskervville',
        fontSize: 18,
        color: 'black',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
    },
    starContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    starAmount: {
        fontFamily: 'Baskervville',
        fontSize: 16,
        alignSelf: 'center',
    }

});

export default StoryScreen;
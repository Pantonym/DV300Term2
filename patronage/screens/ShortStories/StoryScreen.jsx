import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuthorUsername, rateStory } from '../../services/storiesService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

// TODO: Extra functionality: user can edit the rating they gave

const StoryScreen = ({ route, navigation }) => {
    // Parameters
    const story = route.params.story;
    const author = route.params.authorUsername;

    // User Input Information
    const [rating, setRating] = useState('');

    // Story Information
    const [views, setViews] = useState();
    const [username, setUsername] = useState('');

    // Active User Information
    const [userID, setUserID] = useState('');
    const [isAuthor, setIsAuthor] = useState();
    const [isAdmin, setIsAdmin] = useState();
    const [hasVoted, setHasVoted] = useState(false);

    // Loading state for initial loading
    const [loading, setLoading] = useState(true);

    // Loader state for having submitted a rating
    const [loadingVisible, setLoadingVisible] = useState(false);

    // Re Render data
    const [reRender, setReRender] = useState(false);

    // Fetch user data when the screen becomes active.
    useEffect(() => {
        const fetchUserData = async () => {
            // Get the data set in the service from AsyncStorage. This could also be done with Auth by seeing who is the active/current user.
            const id = await AsyncStorage.getItem('UserID');
            const email = await AsyncStorage.getItem('UserEmail');

            // Set the relevant data
            setUserID(id);
            // --Test to see if the user is the admin
            setIsAdmin(email === "greatquill.patronage@gmail.com")

            // Test to see if the ID has been collected
            if (id) {
                // Get the username of the logged in user. The function is primarily used to gte the username of an author through their ID, but can be used here as well.
                // A better name for the function would have been "getUsername(id)", and it would be placed inside of the accountService file.
                const usernameReceived = await getAuthorUsername(id);

                // Set the username
                setUsername(usernameReceived);
            }
        };

        // Trigger the function
        fetchUserData();
    }, []);

    // Use Effect that re renders whenever the username or userID changes
    useEffect(() => {
        // Only run if both are available
        if (username && userID) {
            // Set the amount of views (ratings) the story has
            setViews(story.chapters[0].ratings.length);
            // Set whether or not the logged in user is the author
            setIsAuthor(author === username);

            // Check if user has already voted
            let userHasVoted = false;
            // --Loop through the ratings to see if the user's ID is found there. If it is, they have already voted.
            for (let k = 0; k < story.chapters[0].ratings.length; k++) {
                if (userID === story.chapters[0].ratings[k].voterID) {
                    // Set the rating the user gave to the rating state. This will show on the stars what the user gave.
                    setRating(story.chapters[0].ratings[k].voteAmount)
                    // Set that the user has voted
                    userHasVoted = true;
                    // Exit the loop
                    break;
                }
            }

            // Set if the user has voted
            setHasVoted(userHasVoted);
            // Trigger the function to render stars
            reRenderStars()

            // Stop loading
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
        // Convert the string to an integer
        const ratingValue = parseInt(rating, 10);

        // Validation
        // --If the rating is less than 1, more than 10 or not a number at all
        if (ratingValue < 1 || ratingValue > 10 || isNaN(ratingValue)) {
            Alert.alert('Invalid Rating', 'Please enter a rating between 1 and 10.');

            // Exit the function if there is an error so it does not try to upload invalid information.
            return;
        }

        try {
            // Show loader
            setLoadingVisible(true);

            // Submit the data to add the rating
            const result = await rateStory(story.authorID, ratingValue, story.title, story.genre);

            if (result) {
                Alert.alert('Success', 'Your rating has been submitted.');
                // rerender the stars
                setReRender(reRender === false);
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

    // Rerender the stars based on what the user has voted. This also calls to render the stars on screen load.
    const reRenderStars = () => {
        let stars = [];
        // Loop through the stars to render 10
        for (let i = 1; i <= 10; i++) {
            stars.push(
                <View key={i} style={styles.starContainer}>
                    <TouchableOpacity onPress={() => setRating(i)} disabled={isAuthor || hasVoted || loadingVisible}>
                        {/* If the index is equal to or lower than the rating, make the star filled. If not, make it outline */}
                        <Ionicons
                            name={i <= rating ? "star" : "star-outline"}
                            size={32}
                            // Change the color form golden to gray if the index is higher than the rating.
                            color={i <= rating ? "#FFD700" : "#D3D3D3"}
                        />
                    </TouchableOpacity>
                    <Text style={styles.starAmount}>{i}</Text>
                </View>
            );
        }

        return stars;
    }

    //   Rerender the stars
    useEffect(() => {
        // Disable the button and stars
        setHasVoted(true);
        // The rerendering of stars may be unnecessary. 
        reRenderStars();
    }, [reRender])

    // Render stars to select the amount out of 10
    const renderStars = () => {
        let starsRender = reRenderStars();
        return starsRender;
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
                        {/* Navigate to the author's profile */}
                        <TouchableOpacity onPress={() => navigation.navigate('AuthorProfileScreen', { authorID: story.authorID })}>
                            <Text style={styles.storyAuthor}> by {author}</Text>
                        </TouchableOpacity>

                        {/* Loader for the rating out of 10 as well as total ratings */}
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

                        {/* Hide stars if the user is an admin or an author */}
                        {isAuthor || isAdmin ? (
                            null
                        ) : (
                            <View style={styles.starsContainer}>
                                {renderStars()}
                            </View>
                        )}

                        {/* Displays a disabled button if the viewer is the author of the story or an admin */}
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
                        ) : isAdmin ? (
                            <View>
                                <TouchableOpacity style={[
                                    styles.btnStart,
                                    { opacity: 0.5 },
                                ]} disabled>
                                    <Text style={styles.btnStartText}>Rate Story</Text>
                                </TouchableOpacity>
                                <Text style={styles.btnStartTextAuthor}>The Great Quill Does Not Meddle</Text>
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

                {/* Loader overlay for when a rating is being uploaded */}
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
        textAlign: 'center',
        marginTop: 15
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
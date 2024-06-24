// SCREEN FOR CREATING A STORY FROM THE WRITE SCREEN

import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserStories, handleStoryCreate } from '../../services/storiesService';
import { CommonActions } from '@react-navigation/native';
import { arrGenres } from '../../context/genres';
import uuid from 'react-native-uuid';

const WriteEditorScreen = ({ navigation }) => {
    // Logged in user details
    const [userID, setUserID] = useState('');

    // Get logged in user details
    const getUserID = async () => {
        const userID = await AsyncStorage.getItem('UserID');
        setUserID(userID);
    };

    useEffect(() => {
        getUserID();
    }, []);

    // Variables the user enters
    const [selectedGenre, setSelectedGenre] = useState('Adventure');
    const [storyTitle, setStoryTitle] = useState('');
    const [storyDesc, setStoryDesc] = useState('');
    const [storyContent, setStoryContent] = useState('');

    // Variable to change output
    const [showLargeTextInput, setShowLargeTextInput] = useState(false);

    // Error message state
    const [errorMessage, setErrorMessage] = useState('');

    // Loading state
    const [loading, setLoading] = useState(false);

    // Genre data
    const genres = arrGenres;

    // Collects data the user inputs
    const handleGenreChange = (itemValue, itemIndex) => {
        setSelectedGenre(itemValue);
    };

    const handleTitleChange = (text) => {
        setStoryTitle(text);
    };

    const handleDescriptionChange = (text) => {
        setStoryDesc(text);
    };

    const handleContentChange = (text) => {
        setStoryContent(text);
    }

    // Submit and save the story
    const handleSubmit = async () => {
        // If the user has not entered all the information they need
        if (selectedGenre === "" || storyTitle === "" || storyDesc === "" || storyContent === "") {
            setErrorMessage('Please fill in all fields.');
        } else {
            // Tell the user the app is processing the request
            setLoading(true);

            // Empty the error message as it has been resolved (if an error was made)
            setErrorMessage('');

            try {
                // Fetch user's existing stories to check for duplicate titles
                const userStories = await fetchUserStories(userID);

                const duplicateStory = userStories.find(story => story.title === storyTitle);

                if (duplicateStory) {
                    setErrorMessage('You already have a story with this title. Please choose a different title.');
                    setLoading(false);
                    return;
                }

                // Generate a unique storyID
                const storyID = uuid.v4();
                // Generate the year the story was made/updated
                const year = new Date().getFullYear().toString();

                // Generate the data that will be sent to the database
                const storyDetails = {
                    id: storyID,
                    date: year,
                    completed: false,
                    genre: selectedGenre,
                    title: storyTitle,
                    description: storyDesc,
                    chapters: [
                        {
                            chapterTitle: storyTitle,
                            chapterContent: storyContent,
                            // Comments and ratings are included for easier changing later
                            comments: [],
                            ratings: []
                        }
                    ]
                }

                await handleStoryCreate(storyDetails, userID);

                // Reset the navigation stack to remove the ability to swipe back
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'PersonalStoriesScreen' }],
                    })
                );

            } catch (error) {
                // If there's an error creating the story
                setErrorMessage('An error occurred while submitting your story. Please try again.');
                console.log(error)
            } finally {
                // remove the loading no matter if there's an error or not.
                setLoading(false);
            }

        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}>

            <SafeAreaView style={styles.container}>

                {/* Changes between the large and smaller text inputs, depending on if there's an error */}
                {!showLargeTextInput ? (
                    <ScrollView>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            {/* <TouchableOpacity onPress={() => navigation.navigate('WriteScreen')} disabled={loading}>
                                <Image
                                    style={styles.imgBack}
                                    source={require("../../assets/images/Arrow.png")} />
                            </TouchableOpacity> */}

                            <Text style={styles.header}>
                                Patronage
                            </Text>
                        </View>

                        {/* Select a genre */}
                        <View>
                            <Text style={styles.inputLabelPicker}>Choose a Genre</Text>
                            <Picker
                                selectedValue={selectedGenre}
                                style={styles.picker}
                                onValueChange={handleGenreChange}
                                enabled={!loading}
                            >
                                {genres.map((genre) => (
                                    <Picker.Item key={genre.value} label={genre.label} value={genre.value} />
                                ))}
                            </Picker>
                        </View>

                        {/* Change Title */}
                        <View>
                            <Text style={styles.inputLabel}>Enter a Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Title"
                                onChangeText={handleTitleChange}
                                value={storyTitle}
                                editable={!loading}
                            />
                        </View>

                        {/* Change Description */}
                        <View>
                            <Text style={styles.inputLabel}>Enter a Description</Text>
                            <TextInput
                                style={styles.inputLong}
                                multiline={true}
                                placeholder="Description"
                                onChangeText={handleDescriptionChange}
                                value={storyDesc}
                                editable={!loading}
                                maxLength={250}
                            />
                        </View>

                        {/*Show the story content input and hide these inputs */}
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.btnStart} onPress={() => setShowLargeTextInput(true)} disabled={loading}>
                                <Text style={styles.btnStartText}>Start!</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {/* Display an error message with smaller input */}
                        {errorMessage ? (
                            <View style={{ width: '100%' }}>
                                <View style={styles.errorContainer}>
                                    <Text style={styles.errorText}>{errorMessage}</Text>
                                </View>
                                <TextInput
                                    style={styles.largeTextInputError}
                                    multiline={true}
                                    placeholder="Start writing your story..."
                                    onChangeText={handleContentChange}
                                    value={storyContent}
                                    editable={!loading}
                                />
                            </View>
                        ) : (
                            // Display the content input
                            <TextInput
                                style={styles.largeTextInput}
                                multiline={true}
                                placeholder="Start writing your story..."
                                onChangeText={handleContentChange}
                                value={storyContent}
                                editable={!loading}
                            />
                        )}

                        <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.btnSubmit} onPress={() => setShowLargeTextInput(false)} disabled={loading}>
                                <Text style={styles.btnSubmitText}>Back</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit} disabled={loading}>
                                <Text style={styles.btnSubmitText}>Done!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* The loading that displays once the button is clicked */}
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingText}>Submitting...</Text>
                    </View>
                )}

            </SafeAreaView>

        </KeyboardAvoidingView>
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
        textAlign: 'center'
    },
    header: {
        fontFamily: 'Italianno',
        fontSize: 64,
        padding: 20,
        paddingBottom: 0,
        paddingTop: 0,
        textAlign: 'center',
        marginBottom: 0
    },
    imgBack: {
        height: 36,
        width: 60,
        marginTop: 15
    },
    inputLabel: {
        fontFamily: 'Baskervville',
        fontSize: 24,
        marginBottom: 10
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
        width: '100%',
        marginTop: -80
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10,
        marginBottom: 10
    },
    inputLong: {
        height: 175,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10
    },
    btnStart: {
        height: 50,
        width: 150,
        backgroundColor: '#9A3E53',
        borderRadius: 12,
        justifyContent: 'center',
        marginTop: 25
    },
    btnStartText: {
        color: 'white',
        fontFamily: 'Baskervville',
        fontSize: 24,
        textAlign: 'center'
    },
    largeTextInput: {
        backgroundColor: 'white',
        borderRadius: 12,
        height: '80%',
        width: '100%',
        padding: 15
    },
    largeTextInputError: {
        backgroundColor: 'white',
        borderRadius: 12,
        height: '60%',
        width: '100%',
        padding: 15
    },
    btnSubmit: {
        height: 50,
        width: 150,
        backgroundColor: '#9A3E53',
        borderRadius: 12,
        justifyContent: 'center',
        marginTop: 25,
        marginRight: 20
    },
    btnSubmitText: {
        color: 'white',
        fontFamily: 'Baskervville',
        fontSize: 24,
        textAlign: 'center'
    },
    errorContainer: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#ffcccc',
        borderRadius: 10,
    },
    errorText: {
        color: '#cc0000',
        fontFamily: 'Baskervville',
        fontSize: 18,
        textAlign: 'center'
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        color: 'white',
        fontFamily: 'Baskervville',
        fontSize: 18,
        textAlign: 'center'
    }
});

export default WriteEditorScreen;
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteStory, fetchUserStories, publishStory, unPublishStory } from '../../services/storiesService';
import Ionicons from '@expo/vector-icons/Ionicons';

const PersonalStoriesScreen = ({ navigation }) => {
    // User information
    const [userID, setUserID] = useState(null);

    // All stories information
    const [stories, setStories] = useState([]);

    // Gather the data
    const getUserID = async () => {
        const userID = await AsyncStorage.getItem('UserID');
        setUserID(userID);
    };

    const fetchStories = async () => {
        if (userID) {
            const fetchedStories = await fetchUserStories(userID);
            setStories(fetchedStories);
        }
    };

    useEffect(() => {
        getUserID();
    }, []);

    useEffect(() => {
        fetchStories();
    }, [userID]);

    // Delete a story and refresh the list
    const handleDelete = async (title) => {
        await deleteStory(userID, title);
        fetchStories();
    }

    // Publish a story and refresh the list 
    const handlePublish = async (title) => {
        await publishStory(userID, title);
        fetchStories();
    }

    // Unpublish a story and refresh the list
    const handleUnPublish = async (title) => {
        await unPublishStory(userID, title);
        fetchStories();
    }

    // Confirm that the user wants to publish a story
    const confirmPublish = (clickedID) => {
        Alert.alert(
            "Confirm Publish",
            "Are you sure you want to publish this story? Future edits here will not be reflected on the leaderboards.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Publish cancelled"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => handlePublish(clickedID)
                }
            ],
            { cancelable: false }
        );
    };

    // Confirm that the user wants to unpublish a story
    const confirmUnPublish = (clickedID) => {
        Alert.alert(
            "Confirm Unpublish",
            "Are you sure you want to unpublish this story? All votes and comments will be lost.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Unpublish cancelled"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => handleUnPublish(clickedID)
                }
            ],
            { cancelable: false }
        );
    };

    // Confirm that the user wants to delete a story
    const confirmDelete = (clickedID) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this story? It will not be recoverable.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Delete cancelled"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => handleDelete(clickedID)
                }
            ],
            { cancelable: false }
        );
    };

    // Truncate the text
    const truncateText = (text, length) => {
        if (!text) return ''; // Return an empty string if text is null or undefined
        if (text.length <= length) return text;
        const truncated = text.substring(0, length);
        const lastSpaceIndex = truncated.lastIndexOf(' ');
        return truncated.substring(0, lastSpaceIndex) + '...';
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                    <Image
                        style={styles.imgBack}
                        source={require("../../assets/images/Arrow.png")} />
                </TouchableOpacity>
                <Text style={styles.header}>
                    Patronage
                </Text>
            </View>

            <Text style={styles.titleText}>
                Stories
            </Text>

            <ScrollView>
                {/* Map all of the stories */}
                {stories.map((story) => (
                    <TouchableOpacity
                        key={story.id} // Use story.id as the unique key
                        style={styles.storyContainer}
                        // Go to the single story screen with this story's information
                        onPress={() => navigation.navigate('SingleStoryEditorScreen', { story, refreshStories: fetchStories })}>

                        <View style={styles.storyItemContainer}>
                            <View>
                                <Text style={styles.storyTitle}>{story.title}</Text>
                                <Text style={styles.storyGenre}>{story.genre}</Text>
                                <Text style={styles.storyDescription}>{truncateText(story.description, 100)}</Text>

                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={styles.btnDelete}
                                        onPress={() => confirmDelete(story.id)}>
                                        <Text style={styles.buttonText}>Delete Story</Text>
                                    </TouchableOpacity>

                                    {/* Change the button depending on whether or not the story is completed */}
                                    {story.completed ? (
                                        <TouchableOpacity
                                            style={styles.btnUnPublish}
                                            onPress={() => confirmUnPublish(story.id)}>
                                            <Text style={styles.buttonText}>Unpublish Story</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.btnPublish}
                                            onPress={() => confirmPublish(story.id)}>
                                            <Text style={styles.buttonText}>Publish Story</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            {/* Add a checkmark if the story is marked as completed */}
                            {story.completed ? (
                                <View style={styles.checkmark}>
                                    <Ionicons
                                        size={35}
                                        color={'#9A3E53'}
                                        name={'checkmark-circle-outline'}
                                    />
                                </View>
                            ) : null}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

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
        textAlign: 'center'
    },
    imgBack: {
        height: 36,
        width: 60,
        marginTop: 15
    },
    titleText: {
        fontFamily: 'Baskervville',
        fontSize: 40,
        padding: 20,
        paddingTop: 0,
        paddingBottom: 10,
        textAlign: 'center'
    },
    storyContainer: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
    },
    storyTitle: {
        fontFamily: 'Baskervville',
        fontSize: 24,
        fontWeight: 'bold',
    },
    storyGenre: {
        fontFamily: 'Baskervville',
        fontSize: 16,
        color: '#666',
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5
    },
    storyDescription: {
        fontFamily: 'Baskervville',
        fontSize: 18,
        color: '#666',
        flex: 1,
        maxWidth: '90%',
    },
    storyItemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    checkmark: {
        marginRight: 10
    },
    btnDelete: {
        backgroundColor: '#ffcccc',
        height: 'auto',
        width: 125,
        padding: 10,
        borderRadius: 12,
        marginTop: 10,
        marginRight: 15,
        alignItems: 'center'
    },
    btnPublish: {
        backgroundColor: '#deffcc',
        height: 'auto',
        width: 145,
        padding: 10,
        borderRadius: 12,
        marginTop: 10,
        alignItems: 'center'
    },
    btnUnPublish: {
        backgroundColor: '#fffdcc',
        height: 'auto',
        width: 145,
        padding: 10,
        borderRadius: 12,
        marginTop: 10,
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: 'Baskervville',
        fontSize: 16
    }
});

export default PersonalStoriesScreen;
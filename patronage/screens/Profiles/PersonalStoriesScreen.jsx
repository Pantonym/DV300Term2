import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteStory, fetchUserStories, publishStory, unPublishStory } from '../../services/storiesService';
import Ionicons from '@expo/vector-icons/Ionicons';

const PersonalStoriesScreen = ({ navigation }) => {
    const [userID, setUserID] = useState(null);
    const [stories, setStories] = useState([]);

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

    const handleDelete = async (title) => {
        await deleteStory(userID, title);
        fetchStories();
    }

    const handlePublish = async (title) => {
        await publishStory(userID, title);
        fetchStories();
    }

    const handleUnPublish = async (title) => {
        await unPublishStory(userID, title);
        fetchStories();
    }

    const confirmDelete = (clickedTitle) => {
        Alert.alert(
            "Confirm delete",
            "Are you sure you want to delete this story? It will not be recoverable.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Delete cancelled"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => handleDelete(clickedTitle)
                }
            ],
            { cancelable: false }
        );
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
                {stories.map((story, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.storyContainer}
                        onPress={() => navigation.navigate('SingleStoryEditorScreen', { story, refreshStories: fetchStories })}>
                        <View style={styles.storyItemContainer}>
                            <View>
                                <Text style={styles.storyTitle}>{story.title}</Text>
                                <Text style={styles.storyDescription}>{story.description}</Text>

                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={styles.btnDelete}
                                        onPress={() => confirmDelete(story.title)}>
                                        <Text style={styles.buttonText}>Delete Story</Text>
                                    </TouchableOpacity>

                                    {story.completed ? (
                                        <TouchableOpacity
                                            style={styles.btnUnPublish}
                                            onPress={() => handleUnPublish(story.title)}>
                                            <Text style={styles.buttonText}>Unpublish Story</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.btnPublish}
                                            onPress={() => handlePublish(story.title)}>
                                            <Text style={styles.buttonText}>Publish Story</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

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
    storyDescription: {
        fontFamily: 'Baskervville',
        fontSize: 18,
        color: '#666',
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
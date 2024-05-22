import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { updateStory } from '../../services/storiesService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { arrGenres } from '../../context/genres';

const SingleStoryEditorScreen = ({ route, navigation }) => {
    const { story, refreshStories } = route.params;

    const [userID, setUserID] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [title, setTitle] = useState(story.title);
    const [chapterDescription, setChapterDescription] = useState(story.description);
    const [selectedGenre, setSelectedGenre] = useState(story.genre);
    const [chapterContent, setChapterContent] = useState(story.chapters[0].chapterContent);

    const storyTitle = story.title;
    const storyContent = story.chapters[0].chapterContent;
    const storyDescription = story.description;
    const storyGenre = story.genre;

    const getUserID = async () => {
        const userID = await AsyncStorage.getItem('UserID');
        setUserID(userID);
    };

    useEffect(() => {
        getUserID();
    }, []);

    const handleSave = async () => {
        var newTitle = title;
        var newContent = chapterContent;
        var newDescription = chapterDescription;
        var newGenre = selectedGenre;

        await updateStory(userID, storyTitle, newContent, newTitle, newDescription, newGenre);
        setIsEditing(false);
        refreshStories();
        navigation.goBack();
    };

    const handleCancel = async () => {
        setChapterContent(storyContent);
        setChapterDescription(storyDescription);
        setTitle(storyTitle);
        setSelectedGenre(storyGenre);

        setIsEditing(false);
        refreshStories();
    }

    // Genre data
    const genres = arrGenres;

    // Collects data the user inputs
    const handleGenreChange = (itemValue, itemIndex) => {
        setSelectedGenre(itemValue);
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
                    <Text style={styles.header}>
                        Patronage
                    </Text>
                </View>

                <ScrollView>
                    {isEditing ? (
                        <View>
                            <Text style={styles.inputLabel}>Title: </Text>
                            <TextInput
                                style={styles.titleTextInput}
                                value={title}
                                onChangeText={setTitle}
                            />

                            <Text style={styles.inputLabel}>Description: </Text>
                            <TextInput
                                style={styles.storyDescriptionInput}
                                value={chapterDescription}
                                onChangeText={setChapterDescription}
                                multiline
                            />

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
                            </View>

                            <Text style={styles.inputLabelContent}>Content: </Text>
                            <TextInput
                                style={styles.storyContentInput}
                                value={chapterContent}
                                onChangeText={setChapterContent}
                                multiline
                            />

                            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                                <TouchableOpacity style={styles.btnEdit} onPress={handleCancel}>
                                    <Text style={styles.btnEditText}>Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btnEdit} onPress={handleSave}>
                                    <Text style={styles.btnEditText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.titleText}>
                                {title}
                            </Text>
                            <Text style={styles.storyContent}>
                                {chapterContent}
                            </Text>

                            <TouchableOpacity style={styles.btnEdit} onPress={() => setIsEditing(true)} >
                                <Text style={styles.btnEditText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>

        </KeyboardAvoidingView>
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
    storyContent: {
        fontFamily: 'Baskervville',
        fontSize: 18,
        padding: 20,
        textAlign: 'left'
    },
    inputLabel: {
        marginTop: 20,
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
        fontSize: 20,
        fontFamily: 'Baskervville'
    },
    inputLabelContent: {
        marginBottom: 10,
        marginTop: -10,
        width: '90%',
        alignSelf: 'center',
        fontSize: 20,
        fontFamily: 'Baskervville'
    },
    inputLabelPicker: {
        fontFamily: 'Baskervville',
        fontSize: 20,
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#F6EEE3',
        zIndex: 9,
        paddingTop: 20
    },
    picker: {
        width: '100%',
        marginTop: -80
    },
    titleTextInput: {
        fontFamily: 'Baskervville',
        fontSize: 40,
        padding: 20,
        paddingTop: 0,
        paddingBottom: 10,
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        width: '90%',
        alignSelf: 'center',
    },
    storyContentInput: {
        fontFamily: 'Baskervville',
        fontSize: 18,
        padding: 20,
        textAlign: 'left',
        backgroundColor: 'white',
        borderRadius: 15,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 20
    },
    storyDescriptionInput: {
        fontFamily: 'Baskervville',
        fontSize: 18,
        padding: 20,
        textAlign: 'left',
        backgroundColor: 'white',
        borderRadius: 15,
        width: '90%',
        alignSelf: 'center',
        zIndex: 9
    },
    btnEdit: {
        backgroundColor: '#9A3E53',
        height: 50,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 15,
        marginLeft: 10,
        marginRight: 10
    },
    btnEditText: {
        fontSize: 24,
        fontFamily: 'Baskervville',
        color: 'white'
    }

});

export default SingleStoryEditorScreen;
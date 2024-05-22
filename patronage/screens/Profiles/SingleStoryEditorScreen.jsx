import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { updateStory } from '../../services/storiesService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SingleStoryEditorScreen = ({ route, navigation }) => {
    const { story, refreshStories } = route.params;

    const [userID, setUserID] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(story.title);
    const [chapterContent, setChapterContent] = useState(story.chapters[0].chapterContent);
    const storyTitle = story.title;

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

        await updateStory(userID, storyTitle, newContent, newTitle);
        setIsEditing(false);
        refreshStories();
        navigation.goBack();
    };

    return (
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

            {isEditing ? (
                <>
                    <TextInput
                        style={styles.titleText}
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={styles.storyContent}
                        value={chapterContent}
                        onChangeText={setChapterContent}
                        multiline
                    />

                    <TouchableOpacity onPress={handleSave}>
                        <Text>Save</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.titleText}>
                        {title}
                    </Text>
                    <Text style={styles.storyContent}>
                        {chapterContent}
                    </Text>

                    <TouchableOpacity onPress={() => setIsEditing(true)} >
                        <Text>Edit</Text>
                    </TouchableOpacity>
                </>
            )}
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
    storyContent: {
        fontFamily: 'Baskervville',
        fontSize: 18,
        padding: 20,
        textAlign: 'left'
    }
});

export default SingleStoryEditorScreen;
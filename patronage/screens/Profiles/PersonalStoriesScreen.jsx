import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserStories } from '../../services/storiesService';

const PersonalStoriesScreen = ({ navigation }) => {
    const [userID, setUserID] = useState(null);
    const [stories, setStories] = useState([]);

    const getUserID = async () => {
        const userID = await AsyncStorage.getItem('UserID');
        setUserID(userID);
    };

    useEffect(() => {
        getUserID();
    }, []);

    useEffect(() => {
        const fetchStories = async () => {
            if (userID) {
                const fetchedStories = await fetchUserStories(userID);
                setStories(fetchedStories);
            }
        };
        fetchStories();
    }, [userID]);

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
                        onPress={() => navigation.navigate('SingleStoryEditorScreen', { story })}>
                        <Text style={styles.storyTitle}>{story.title}</Text>
                        <Text style={styles.storyDescription}>{story.description}</Text>
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
});

export default PersonalStoriesScreen;

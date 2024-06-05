import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchUserStories, getAuthorUsername } from '../../services/storiesService';

const AuthorStoriesScreen = ({ route, navigation }) => {
    const userID = route.params;
    const [stories, setStories] = useState([]);
    const [username, setUsername] = useState('');

    const fetchUsername = async () => {
        if (userID) {
            const usernameReceived = await getAuthorUsername(userID);
            setUsername(usernameReceived);
        }
    };

    const fetchStories = async () => {
        if (userID) {
            const fetchedStories = await fetchUserStories(userID);
            setStories(fetchedStories);
        }
    };

    useEffect(() => {
        fetchUsername();
    }, []);

    useEffect(() => {
        fetchStories();
    }, [userID]);

    const truncateText = (text, length) => {
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
                {username}'s Stories
            </Text>

            <ScrollView>
                {stories.length === 0 ? (
                    <Text style={styles.noStoriesText}>No stories to display</Text>
                ) : (
                    stories.map((story, index) => (
                        story.completed ? (
                            <TouchableOpacity
                                key={index}
                                style={styles.storyContainer}
                                onPress={() => navigation.navigate('AuthorSingleStoryScreen', story)}>
                                <View style={styles.storyItemContainer}>
                                    <View>
                                        <Text style={styles.storyTitle}>{story.title}</Text>
                                        <Text style={styles.storyGenre}>{story.genre}</Text>
                                        <Text style={styles.storyDescription}>{truncateText(story.description, 100)}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ) : null
                    ))
                )}
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
    noStoriesText: {
        fontFamily: 'Baskervville',
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginTop: 20
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

export default AuthorStoriesScreen;
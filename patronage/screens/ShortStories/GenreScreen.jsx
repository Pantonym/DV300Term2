import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuthorUsername, getShortStoriesByGenre } from '../../services/storiesService';
import Ionicons from '@expo/vector-icons/Ionicons';

const GenreScreen = ({ route, navigation }) => {
    const activeGenre = route.params;
    const activeGenreParam = activeGenre.toLowerCase();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authorUsernames, setAuthorUsernames] = useState([]);

    useEffect(() => {
        const fetchStories = async () => {
            setLoading(true);
            try {
                const data = await getShortStoriesByGenre(activeGenreParam);
                if (data) {
                    const stories = data.flatMap(story => story || []);
                    setStories(stories);

                    const usernames = await Promise.all(
                        stories.map(story => getAuthorUsername(story.authorID))
                    );

                    setAuthorUsernames(usernames);

                } else {
                    console.log('No Data');
                    setStories([]);
                }
            } catch (error) {
                console.error('Error fetching stories:', error);
                setStories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [activeGenreParam]);

    const renderStories = () => {
        if (loading) {
            return (
                <View style={[styles.storyCard, { alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            );
        }

        return stories.map((story, index) => (
            <View key={index} style={styles.storyCard}>
                <TouchableOpacity onPress={() => navigation.navigate('StoryScreen', { story, authorUsername: authorUsernames[index] })}>
                    <View style={styles.topHolder}>
                        <View style={styles.titleHolder}>
                            <Text style={styles.storyTitle}>{story.title}</Text>

                            <TouchableOpacity onPress={() => navigation.navigate('AuthorProfileScreen', { authorID: story.authorID })}>
                                <Text style={styles.authorUsername}> by {authorUsernames[index]}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.ratingHolder}>
                            <Text style={styles.averageRating}>{story.averageRating.toFixed(1)} / 10</Text>
                            <Ionicons
                                size={25}
                                color={'purple'}
                                name={'star'}
                            />
                        </View>
                    </View>

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

                    <Text style={styles.storyDescription}>{story.description}</Text>
                </TouchableOpacity>
            </View >
        ));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <Image
                        style={styles.imgBack}
                        source={require("../../assets/images/Arrow.png")} />
                </TouchableOpacity>
                <Text style={styles.header}>Patronage</Text>
            </View>
            <View>
                <Text style={styles.genreTitle}>{activeGenre}</Text>
            </View>
            <ScrollView contentContainerStyle={styles.storiesContainer}>
                {renderStories()}
            </ScrollView>
        </SafeAreaView>
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
    genreTitle: {
        fontFamily: 'Baskervville',
        fontSize: 40,
        textAlign: 'center'
    },
    imgBack: {
        height: 36,
        width: 60,
        marginTop: 15
    },
    storiesContainer: {
        padding: 20,
    },
    storyCard: {
        backgroundColor: '#CAA775',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    storyTitle: {
        fontFamily: 'Baskervville',
        fontSize: 24,
        color: 'black',
    },
    storyDescription: {
        fontFamily: 'Baskervville',
        fontSize: 16,
        color: 'black',
    },
    authorUsername: {
        fontFamily: 'Baskervville',
        fontSize: 18,
        color: 'black',
        textDecorationLine: 'underline',
    },
    topHolder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleHolder: {
        flexDirection: 'column',
        width: '70%',
    },
    ratingHolder: {
        alignItems: 'center',
        width: '30%',
    },
    averageRating: {
        fontFamily: 'Baskervville',
        fontSize: 18,
        color: 'black',
    }
});

export default GenreScreen;
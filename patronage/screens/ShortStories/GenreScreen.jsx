import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuthorUsername, getShortStoriesByGenre } from '../../services/storiesService';
import Ionicons from '@expo/vector-icons/Ionicons';

const GenreScreen = ({ route, navigation }) => {
    // Parameters
    // --For display reasons (It should be displayed oin a correct grammatical way)
    const { genre: activeGenre } = route.params || {};
    // --For database reasons (it is lowercase in the database)
    const activeGenreParam = activeGenre ? activeGenre.toLowerCase() : '';

    // All stories information
    const [stories, setStories] = useState([]);
    // Collect author usernames to display on the cards as they are saved as id's in the database
    const [authorUsernames, setAuthorUsernames] = useState([]);

    // Display loader
    const [loading, setLoading] = useState(true);

    // Change what is displayed when a different genre is selected. This will rerender the data with the new genre as a filter
    useEffect(() => {
        if (!activeGenreParam) {
            console.error('No genre provided');
            setLoading(false);
            return;
        }
    
        // Function to fetch the stories
        const fetchStories = async () => {
            // Activate loader
            setLoading(true);
    
            try {
                // Get the data
                const data = await getShortStoriesByGenre(activeGenreParam);
                if (data) {
                    // --Set the stories
                    setStories(data);
    
                    // Map the usernames 
                    const usernames = await Promise.all(
                        data.map(story => getAuthorUsername(story.authorID))
                    );
                    // Set the usernames
                    setAuthorUsernames(usernames);
                } else {
                    console.log('No Data');
                    setStories([]);
                }
            } catch (error) {
                console.error('Error fetching stories:', error);
                setStories([]);
            } finally {
                // Deactivate loading
                setLoading(false);
            }
        };
    
        // Activate the function
        fetchStories();
    }, [activeGenreParam]);

    const renderStories = () => {
        // Loader
        if (loading) {
            return (
                <View style={[styles.storyCard, { alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            );
        }

        // Map each story in a card
        return stories.map((story, index) => (
            <View key={index} style={styles.storyCard}>
                {/* Navigate to the story screen and send the story's information as well as who the author is */}
                <TouchableOpacity onPress={() => navigation.navigate('StoryScreen', { story, authorUsername: authorUsernames[index] })}>
                    <View style={styles.topHolder}>
                        <View style={styles.titleHolder}>
                            <Text style={styles.storyTitle}>{story.title}</Text>

                            <TouchableOpacity onPress={() => navigation.navigate('AuthorProfileScreen', { authorID: story.authorID })}>
                                <Text style={styles.authorUsername}> by {authorUsernames[index]}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Display the average rating out of 10 */}
                        <View style={styles.ratingHolder}>
                            {/* Average Rating is created and added to the story in the service file */}
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
                <TouchableOpacity onPress={() => navigation.navigate('ShortStoriesScreen')}>
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
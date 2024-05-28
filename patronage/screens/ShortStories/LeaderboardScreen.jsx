import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLeaderboards, getAuthorUsername } from '../../services/storiesService';

const LeaderboardScreen = ({ route, navigation }) => {
    const { genre } = route.params;
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authorUsernames, setAuthorUsernames] = useState([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const genreStories = await getLeaderboards(genre);

                // Filter stories by those with 5 or more ratings
                const filteredStories = genreStories.filter(story => story.chapters[0].ratings.length >= 5);

                // Sort filtered stories by average rating percentage descending
                filteredStories.sort((a, b) => calculateAverageRating(b.chapters[0].ratings) - calculateAverageRating(a.chapters[0].ratings));

                // Take only the top 5 stories
                const top5Stories = filteredStories.slice(0, 5);

                setStories(top5Stories);

                // Fetch all author usernames for the top 5 stories
                const usernames = await Promise.all(
                    top5Stories.map(story => getAuthorUsername(story.authorID))
                );

                setAuthorUsernames(usernames);
            } catch (error) {
                console.error("Error fetching stories: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, [genre]);

    // Calculate the average rating for a story and convert it to a percentage
    const calculateAverageRating = (ratings) => {
        if (ratings.length === 0) return 0;
        const total = ratings.reduce((acc, rating) => acc + rating.voteAmount, 0);
        return (total / ratings.length) * 10; // Convert to percentage
    };

    // Loader
    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#332511" />
            </View>
        );
    }

    // Display message when fewer than 5 stories are available
    if (stories.length < 5) {
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

                <Text style={styles.titleText}>
                    Leaderboard for {genre} Short Stories
                </Text>

                <Text style={styles.noStoriesText}>Not enough eligible stories available for this leaderboard!</Text>
            </SafeAreaView>
        );
    }

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

            <Text style={styles.titleText}>
                Leaderboard for {genre} Short Stories
            </Text>

            {/* Map the filtered items to display the top 5 stories */}
            <FlatList
                data={stories}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <View key={index} style={styles.storyCard}>
                        <TouchableOpacity onPress={() => navigation.navigate('StoryScreen', { story: item, authorUsername: authorUsernames[index] })}>
                            <View style={styles.topHolder}>
                                <View style={styles.titleHolder}>
                                    <Text style={styles.storyTitle}>{item.title}</Text>

                                    <TouchableOpacity onPress={() => navigation.navigate('AuthorProfileScreen', { authorID: item.authorID })}>
                                        <Text style={styles.authorUsername}> by {authorUsernames[index]}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.ratingHolder}>
                                    <Text style={styles.averageRating}>{calculateAverageRating(item.chapters[0].ratings).toFixed(1)}%</Text>
                                </View>
                            </View>

                            {/* Percentage graph background */}
                            <View style={{
                                height: 20,
                                backgroundColor: '#B3813A',
                                width: '100%',
                                alignSelf: 'start',
                                marginBottom: 20,
                                marginTop: 10,
                                borderTopRightRadius: 10,
                                borderBottomRightRadius: 10
                            }}>

                                {/* Percentage Graph */}
                                <View
                                    style={{
                                        height: 20,
                                        backgroundColor: '#CAA775',
                                        width: `${calculateAverageRating(item.chapters[0].ratings)}%`,
                                        alignSelf: 'start',
                                        borderTopRightRadius: 10,
                                        borderBottomRightRadius: 10
                                    }}
                                />

                            </View>

                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        display: 'flex',
        flex: 1,
        padding: 20,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: "#F6EEE3",
        flexDirection: 'column',
        textAlign: 'center',
    },
    header: {
        fontFamily: 'Italianno',
        fontSize: 64,
        padding: 20,
        paddingTop: 0,
        paddingBottom: 0,
        textAlign: 'center',
    },
    imgBack: {
        height: 36,
        width: 60,
        marginTop: 15,
    },
    titleText: {
        fontFamily: 'Baskervville',
        fontSize: 32,
        padding: 20,
        paddingTop: 0,
        paddingBottom: 10,
        textAlign: 'center'
    },
    storyCard: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 20,
    },
    topHolder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleHolder: {
        flex: 1,
    },
    storyTitle: {
        fontSize: 24,
        fontFamily: 'Baskervville',
    },
    authorUsername: {
        fontSize: 18,
        fontFamily: 'Baskervville',
        textDecorationLine: 'underline'
    },
    averageRating: {
        fontSize: 20,
        fontFamily: 'Baskervville',
    },
    noStoriesText: {
        fontSize: 20,
        fontFamily: 'Baskervville',
        marginTop: 20,
        textAlign: 'center',
    }
});

export default LeaderboardScreen;
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getShortStoriesByGenre } from '../../services/storiesService';

const GenreScreen = ({ route, navigation }) => {
    const activeGenre = route.params;
    const activeGenreParam = activeGenre.toLowerCase();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const fetchStories = async () => {
            setLoading(true);

            try {
                const data = await getShortStoriesByGenre(activeGenreParam);

                if (data) {
                    const stories = data.flatMap(story => story || []);
                    setStories(stories);
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
                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={styles.storyDescription}>{story.description}</Text>
                {/* Add more story details as needed */}
            </View>
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

                <Text style={styles.header}>
                    Patronage
                </Text>
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
        marginBottom: 10,
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
    }
});

export default GenreScreen;
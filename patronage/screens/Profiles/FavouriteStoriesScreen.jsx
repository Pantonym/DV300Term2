import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuthorUsername } from '../../services/storiesService';

const FavouriteStoriesScreen = ({ route, navigation }) => {
    // Collect the stories
    const { favouriteStories } = route.params || [];

    // Collect author usernames to display on the cards as they are saved as id's in the database
    const [authorUsernames, setAuthorUsernames] = useState([]);

    useEffect(() => {
        // Function to fetch the stories
        const fetchStories = async () => {
            try {
                // Map the usernames 
                const usernames = await Promise.all(
                    favouriteStories.map(favouriteStory => getAuthorUsername(favouriteStory.authorID))
                );

                // Set the usernames
                setAuthorUsernames(usernames);

            } catch (error) {
                console.error('Error fetching stories:', error);
            }
        };

        // Activate the function
        fetchStories();
    }, []);

    const renderStories = () => {
        // Map each story in a card
        return favouriteStories.map((story, index) => (
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
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={styles.imgBack} source={require("../../assets/images/Arrow.png")} />
                </TouchableOpacity>
                <Text style={styles.header}>favourites</Text>
            </View>
            <Text style={styles.titleText}>Favourite Stories:</Text>

            <ScrollView contentContainerStyle={styles.storiesContainer}>
                {renderStories()}
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
    storyCard: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#FFF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    storyTitle: {
        fontSize: 24,
        fontFamily: 'Baskervville',
    },
    storyDescription: {
        fontSize: 16,
        fontFamily: 'Baskervville',
        textAlign: 'center'
    },
    titleText: {
        fontFamily: 'Baskervville',
        fontSize: 40,
        padding: 20,
        paddingTop: 0,
        paddingBottom: 10,
        textAlign: 'center'
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
});

export default FavouriteStoriesScreen;
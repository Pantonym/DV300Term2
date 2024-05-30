import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { rateStory } from '../../services/storiesService';

// TODO: Show views, votes and how many have voted
// TODO: If you have already voted, it should say already without having to click on the button
// TODO: Refine database to use subcollections instead of nested maps and arrays

const StoryScreen = ({ route, navigation }) => {
    const story = route.params.story;
    const author = route.params.authorUsername;

    const [rating, setRating] = useState('');

    // Confirm the submission of the user's rating
    const confirmRating = () => {
        Alert.alert(
            "Confirm Rating",
            "Are you sure you want to rate this story? You will not be able to change your rating later.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Rating cancelled"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: handleRating
                }
            ],
            { cancelable: false }
        );
    };

    // Handle rating function
    const handleRating = async () => {
        const ratingValue = parseInt(rating, 10);

        // Validation
        if (ratingValue < 1 || ratingValue > 10 || isNaN(ratingValue)) {
            Alert.alert('Invalid Rating', 'Please enter a rating between 1 and 10.');
            return;
        }

        // Submit the data to add the rating
        const result = await rateStory(story.authorID, ratingValue, story.title, story.genre);
        if (result) {
            Alert.alert('Success', 'Your rating has been submitted.');
        } else {
            Alert.alert('Error', 'You cannot vote on your own story or you have already voted.');
        }
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
                    <Text style={styles.header}>Patronage</Text>
                </View>

                <ScrollView>
                    <View>
                        <Text style={styles.storyTitle}>{story.title}</Text>
                        <Text style={styles.storyAuthor}>by {author}</Text>

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

                        <Text style={styles.storyContent}>{story.chapters[0].chapterContent}</Text>

                        <TextInput
                            style={styles.ratingInput}
                            placeholder="Enter rating (1-10)"
                            keyboardType="numeric"
                            value={rating}
                            onChangeText={setRating}
                        />

                        <TouchableOpacity style={styles.btnStart} onPress={confirmRating}>
                            <Text style={styles.btnStartText}>Rate Story</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
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
    imgBack: {
        height: 36,
        width: 60,
        marginTop: 15
    },
    storyTitle: {
        fontFamily: 'Baskervville',
        fontSize: 40,
        textAlign: 'center'
    },
    storyAuthor: {
        fontFamily: 'Baskervville',
        fontSize: 26,
        textAlign: 'center'
    },
    storyContent: {
        fontFamily: 'Baskervville',
        fontSize: 18
    },
    ratingInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 20,
        alignSelf: 'center',
        width: '80%',
        fontFamily: 'Baskervville',
        fontSize: 18
    },
    btnStart: {
        height: 50,
        width: 150,
        backgroundColor: '#9A3E53',
        borderRadius: 12,
        justifyContent: 'center',
        marginTop: 20,
        alignSelf: 'center'
    },
    btnStartText: {
        color: 'white',
        fontFamily: 'Baskervville',
        fontSize: 24,
        textAlign: 'center'
    },
});

export default StoryScreen;
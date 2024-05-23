import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StoryScreen = ({ route, navigation }) => {
    const story = route.params.story;
    const author = route.params.authorUsername;

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
                </View>
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
    }
});

export default StoryScreen
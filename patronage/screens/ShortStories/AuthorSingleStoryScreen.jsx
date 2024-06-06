import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'

const AuthorSingleStoryScreen = ({ route, navigation }) => {
    // Parameters
    const story = route.params;

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

            <ScrollView>
                <View>
                    <Text style={styles.titleText}>
                        {story.title}
                    </Text>
                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 2.5,
                            width: '80%',
                            alignSelf: 'center'
                        }}
                    />

                    {/* Render the story content from the parameters */}
                    <Text style={styles.storyContent}>
                        {story.chapters[0].chapterContent}
                    </Text>

                    {/* Displays a disclaimer. This is needed because a story may be from a previous competition, 
                    and therefore is displayed as one of the user's stories, but cannot be voted on as it isn't a part of a competition now. */}
                    <Text style={styles.disclaimer}>
                        To vote for this story, first verify its competition entry status on the search screen.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

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
    },
    disclaimer: {
        fontFamily: 'Baskervville',
        fontSize: 18,
        padding: 20,
        paddingTop: 10,
        color: 'red',
        textAlign: 'center'
    }
});

export default AuthorSingleStoryScreen
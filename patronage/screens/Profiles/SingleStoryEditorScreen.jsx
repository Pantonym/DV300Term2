import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import React from 'react';

const SingleStoryEditorScreen = ({ route, navigation }) => {
    const { story } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        style={styles.imgBack}
                        source={require("../../assets/images/Arrow.png")} />
                </TouchableOpacity>
                <Text style={styles.header}>
                    Patronage
                </Text>
            </View>
            <Text style={styles.titleText}>
                {story.title}
            </Text>
            <Text style={styles.storyContent}>
                {story.chapters[0].chapterContent}
            </Text>
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
    storyContent: {
        fontFamily: 'Baskervville',
        fontSize: 18,
        padding: 20,
        textAlign: 'left'
    }
});

export default SingleStoryEditorScreen;

import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WriteEditorScreen = ({ navigation }) => {

    // Variables the user enters.
    const [selectedGenre, setSelectedGenre] = useState('');
    const [storyTitle, setStoryTitle] = useState('');
    const [storyDesc, setStoryDesc] = useState('');
    const [storyContent, setStoryContent] = useState('');

    // Variable to change output
    const [showLargeTextInput, setShowLargeTextInput] = useState(false);

    // Genre example data
    const genres = [
        { label: 'Adventure', value: 'adventure' },
        { label: 'Fantasy', value: 'fantasy' },
        { label: 'Science Fiction', value: 'science_fiction' },
        { label: 'Mystery', value: 'mystery' },
        { label: 'Romance', value: 'romance' },
    ];

    // Collects data the user inputs
    const handleGenreChange = (itemValue, itemIndex) => {
        setSelectedGenre(itemValue);
    };

    const handleTitleChange = (text) => {
        setStoryTitle(text);
    };

    const handleDescriptionChange = (text) => {
        setStoryDesc(text);
    };

    const handleContentChange = (text) => {
        setStoryContent(text);
    }

    // Submit and save story
    const handleSubmit = async () => {

        // Similar to localStorage
        loggedInUser = await AsyncStorage.getItem('UserEmail');

        const storyDetails = [selectedGenre, storyTitle, storyDesc, storyContent, loggedInUser];
        console.log(storyDetails);

        navigation.navigate('ProfileScreen')
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}>

            <SafeAreaView style={styles.container}>

                {!showLargeTextInput ? (
                    <ScrollView>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => navigation.navigate('WriteScreen')}>
                                <Image
                                    style={styles.imgBack}
                                    source={require("../../assets/images/Arrow.png")} />
                            </TouchableOpacity>

                            <Text style={styles.header}>
                                Patronage
                            </Text>
                        </View>

                        <View>
                            <Text style={styles.inputLabelPicker}>Choose a Genre</Text>
                            <Picker
                                selectedValue={selectedGenre}
                                style={styles.picker}
                                onValueChange={handleGenreChange}>
                                {genres.map((genre) => (
                                    <Picker.Item key={genre.value} label={genre.label} value={genre.value} />
                                ))}
                            </Picker>
                        </View>

                        <View>
                            <Text style={styles.inputLabel}>Enter a Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Title"
                                onChangeText={handleTitleChange}
                                value={storyTitle}
                            />
                        </View>

                        <View>
                            <Text style={styles.inputLabel}>Enter a Description</Text>
                            <TextInput
                                style={styles.inputLong}
                                multiline={true}
                                placeholder="Description"
                                onChangeText={handleDescriptionChange}
                                value={storyDesc}
                            />
                        </View>

                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.btnStart} onPress={() => setShowLargeTextInput(true)}>
                                <Text style={styles.btnStartText}>Start!</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            style={styles.largeTextInput}
                            multiline={true}
                            placeholder="Start writing your story..."
                            onChangeText={handleContentChange}
                            value={storyContent}
                        />

                        <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.btnSubmit} onPress={() => setShowLargeTextInput(false)}>
                                <Text style={styles.btnSubmitText}>Back</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.btnSubmit} onPress={() => handleSubmit()}>
                                <Text style={styles.btnSubmitText}>Done!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

            </SafeAreaView>

        </KeyboardAvoidingView>
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
        textAlign: 'center',
        marginBottom: 0
    },
    imgBack: {
        height: 36,
        width: 60,
        marginTop: 15
    },
    inputLabel: {
        fontFamily: 'Baskervville',
        fontSize: 24,
        marginBottom: 10
    },
    inputLabelPicker: {
        fontFamily: 'Baskervville',
        fontSize: 24,
        marginBottom: 10,
        backgroundColor: '#F6EEE3',
        zIndex: 9,
        paddingTop: 20
    },
    picker: {
        width: '100%',
        marginTop: -80
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10
    },
    inputLong: {
        height: 175,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 10
    },
    btnStart: {
        height: 50,
        width: 150,
        backgroundColor: '#9A3E53',
        borderRadius: 12,
        justifyContent: 'center',
        marginTop: 25
    },
    btnStartText: {
        color: 'white',
        fontFamily: 'Baskervville',
        fontSize: 24,
        textAlign: 'center'
    },
    largeTextInput: {
        backgroundColor: 'white',
        borderRadius: 12,
        height: '80%',
        width: '100%',
        padding: 15
    },
    btnSubmit: {
        height: 50,
        width: 150,
        backgroundColor: '#9A3E53',
        borderRadius: 12,
        justifyContent: 'center',
        marginTop: 25,
        marginRight: 20
    },
    btnSubmitText: {
        color: 'white',
        fontFamily: 'Baskervville',
        fontSize: 24,
        textAlign: 'center'
    }
});

export default WriteEditorScreen
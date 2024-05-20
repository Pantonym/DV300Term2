import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker, PickerIOS } from '@react-native-picker/picker';

const WriteEditorScreen = ({ navigation }) => {

    // Variables the user enters.
    const [selectedGenre, setSelectedGenre] = useState('');
    const [storyTitle, setStoryTitle] = useState('');
    const [storyDesc, setStoryDesc] = useState('');

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

    return (
        <SafeAreaView style={styles.container}>

            <View style={{ flexDirection: 'row' }}>
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
                <Text style={styles.inputLabel}>Choose a Genre</Text>
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
                    style={styles.input}
                    placeholder="Description"
                    onChangeText={handleDescriptionChange}
                    value={storyDesc}
                />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('UnderConstruction')}>
                <Text>Start!</Text>
            </TouchableOpacity>

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
        textAlign: 'center',
    },
    header: {
        fontFamily: 'Italianno',
        fontSize: 64,
        padding: 20,
        paddingBottom: 0,
        paddingTop: 0,
        textAlign: 'center',
        marginBottom: 20
    },
    imgBack: {
        height: 36,
        width: 60,
        marginTop: 15
    },
    inputLabel: {
        fontFamily: 'Baskervville',
        fontSize: 24,
        marginBottom: 10,
    },
    picker: {
        width: '100%',
        marginTop: -80
    },
});

export default WriteEditorScreen
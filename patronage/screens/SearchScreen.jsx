import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchScreen = ({ navigation }) => {
    // Input for searching
    const [searchQuery, setSearchQuery] = useState('');

    // Output after searching
    const [filteredData, setFilteredData] = useState([]);

    // Example data
    const data = [
        { id: 1, name: 'Green Eyes' },
        { id: 2, name: 'POWER' },
        { id: 3, name: 'Pretty Young Lads' },
        { id: 4, name: 'Elderberry Wine' },
        { id: 5, name: 'The Scrolls of Elder Times' },
        { id: 6, name: 'A Dance With Death' },
        { id: 7, name: 'Grapevine' },
    ];

    // Filters through the data to retrieve items that match what was entered in the search input
    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = data.filter(item =>
            item.name.toLowerCase().includes(text.toLowerCase())
        );

        // Change the displayed data
        setFilteredData(filtered);
    };

    return (
        <SafeAreaView style={styles.container}>

            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <Image
                        style={styles.imgBack}
                        source={require("../assets/images/Arrow.png")} />
                </TouchableOpacity>

                <Text style={styles.header}>
                    Patronage
                </Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search..."
                    onChangeText={handleSearch}
                    value={searchQuery}
                />
            </View>

            {/* Dynamically renders the data, changing what is displayed as the user searches */}
            <FlatList
                data={searchQuery ? filteredData : data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.name}</Text>
                    </View>
                )}
            />
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
        textAlign: 'center'
    },
    imgBack: {
        height: 36,
        width: 60,
        marginTop: 15
    },
    searchContainer: {
        marginTop: 20,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
});

export default SearchScreen
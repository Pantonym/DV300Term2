import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllShortStories, getAuthorUsername } from '../services/storiesService';

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [shortStories, setShortStories] = useState([]);
    const [authorUsernames, setAuthorUsernames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch short stories from Firestore when the component mounts
        fetchShortStories();
    }, []);

    const fetchShortStories = async () => {
        try {
            const storiesData = await getAllShortStories();
            if (storiesData) {
                // Flatten the shortStories object into an array of stories
                const storiesArray = Object.values(storiesData).flat();
                setShortStories(storiesArray);

                const usernames = await Promise.all(
                    storiesArray.map(story => getAuthorUsername(story.authorID))
                );

                setAuthorUsernames(usernames);
                setLoading(false); // Set loading to false once data is fetched
            }
        } catch (error) {
            console.error("Error fetching short stories", error);
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = shortStories.filter(item =>
            item.title.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const navigateToStoryScreen = (item) => {
        navigation.navigate('StoryScreen', {
            story: item,
            authorUsername: authorUsernames[shortStories.indexOf(item)]
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#332511" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <Image
                        style={styles.imgBack}
                        source={require("../assets/images/Arrow.png")}
                    />
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

            <FlatList
                data={searchQuery ? filteredData : shortStories}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigateToStoryScreen(item)}
                    >
                        <View style={styles.item}>
                            <Text style={styles.itemText}>{item.title}</Text>
                            <Text>{authorUsernames[shortStories.indexOf(item)]}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
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
    searchContainer: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 45,
        width: '90%',
        borderRadius: 15,
        paddingHorizontal: 10,
        fontSize: 20,
        backgroundColor: 'white',
        paddingLeft: 15,
        paddingRight: 15
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    itemText: {
        fontSize: 16,
        fontFamily: 'Baskervville',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default SearchScreen;
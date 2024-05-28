import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { arrGenres } from '../context/genres';

const ShortStoriesScreen = ({ navigation }) => {

    const genres = arrGenres;

    // Dynamically render an amount of items in the carousel depending on how many genres there are
    const renderGenres = () => {
        return genres.map((genre, index) => (
            <TouchableOpacity
                key={index}
                style={styles.genreCard}
                onPress={() => navigation.navigate('GenreScreen', genre.value)}
            >
                <Text style={styles.genreText}>{genre.label}</Text>
            </TouchableOpacity>
        ));
    };

    // Dynamically render an amount of items in the carousel depending on how many genres there are
    const renderLeaderboards = () => {
        return genres.map((leaderboard, index) => (
            <TouchableOpacity
                key={index}
                style={styles.genreCard}
                onPress={() => navigation.navigate('LeaderboardScreen', { genre: leaderboard.value })}
            >
                <Text style={styles.genreText}>{leaderboard.label}</Text>
            </TouchableOpacity>
        ));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>

                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                        <Image
                            style={styles.imgBack}
                            source={require("../assets/images/Arrow.png")} />
                    </TouchableOpacity>

                    <Text style={styles.header}>
                        Patronage
                    </Text>
                </View>

                <View style={styles.genreHolder}>
                    <View>
                        <Text style={styles.titleText}>
                            Short Stories
                        </Text>
                    </View>

                    {/* Render all of the data inside of a scrollview set to horizontal so it appears like a carousel */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.carousel}
                    >
                        {renderGenres()}
                    </ScrollView>
                </View>

                <View style={styles.leaderboardHolder}>
                    <View>
                        <Text style={styles.titleText}>
                            Leaderboards
                        </Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.carousel}
                    >
                        {renderLeaderboards()}
                    </ScrollView>
                </View>

            </View>
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
        paddingTop: 0,
        paddingBottom: 0,
        textAlign: 'center'
    },
    titleText: {
        fontFamily: 'Baskervville',
        fontSize: 40,
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
    genreHolder: {
        marginBottom: 20
    },
    leaderboardHolder: {
        marginTop: 20
    },
    carousel: {
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 10,
    },
    genreCard: {
        backgroundColor: '#CAA775',
        borderRadius: 25,
        padding: 10,
        marginHorizontal: 10,
        height: 165,
        width: 225,
        justifyContent: 'center',
        alignItems: 'center'
    },
    genreText: {
        fontFamily: 'Baskervville',
        fontSize: 32,
        color: 'black',
    },
});

export default ShortStoriesScreen
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const HomeScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.container}>
            <View>

                <Text style={styles.header}>
                    Patronage
                </Text>

                <Text style={styles.titleText}>
                    Read
                </Text>

                {/* ScrollView to future proof adding more story types */}
                <ScrollView>
                    {/* Short Stories Card */}
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.pageLink} onPress={() => navigation.navigate('ShortStoriesScreen')}>
                            <Text style={styles.cardText}>Short Stories</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Future Implementation Card */}
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.pageLink} onPress={() => navigation.navigate('UnderConstruction')}>
                            <Text style={styles.cardText}>Coming Soon...</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Future Implementation Card */}
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.pageLink} onPress={() => navigation.navigate('UnderConstruction')}>
                            <Text style={styles.cardText}>Coming Soon...</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

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
        paddingBottom: 0,
        paddingTop: 0,
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
    card: {
        height: 150,
        width: 350,
        width: '100%',
        backgroundColor: '#9A3E53',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        marginRight: -25,
        marginBottom: 25
    },
    cardText: {
        fontFamily: 'Baskervville',
        fontSize: 32,
        color: 'white'
    }
});

export default HomeScreen
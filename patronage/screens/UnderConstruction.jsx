import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const UnderConstruction = () => {
    return (

        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>You Have Found The Great Quill At A Disadvantage...</Text>

                <Image
                    style={styles.image}
                    source={require("../assets/images/Logo.jpg")}
                    contentFit="cover" />

                <Text style={styles.subtitle}>This Realm Is Still Under Construction</Text>
            </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        padding: 20,
        backgroundColor: "#F6EEE3",
        flexDirection: 'column',
        textAlign: 'center',
    },
    title: {
        fontFamily: 'Baskervville',
        fontSize: 40,
        textAlign: 'center',
        marginTop: 20
    },
    subtitle: {
        fontFamily: 'Baskervville',
        fontSize: 32,
        textAlign: 'center'
    },
    image: {
        width: 200,
        height: 181,
        backgroundColor: '#F6EEE3',
        alignSelf: 'center',
        marginTop: 100,
        marginBottom: 100
    },
});

export default UnderConstruction
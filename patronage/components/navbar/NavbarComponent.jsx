import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const NavbarComponent = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navbar}>

                <Ionicons style={styles.navImage} size={35} color={'white'} name="book"></Ionicons>

                <Ionicons style={styles.navImage} size={35} color={'white'} name="brush-outline"></Ionicons>

                <Ionicons style={styles.navImage} size={35} color={'white'} name="search-outline"></Ionicons>

                <Ionicons style={styles.navImage} size={35} color={'white'} name="person-outline"></Ionicons>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        height: 100,
        backgroundColor: "#332511",
        padding: 20
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    navImage: {
        margin: 25,
        marginTop: 0,
        marginBottom: 0,
    }
});

export default NavbarComponent
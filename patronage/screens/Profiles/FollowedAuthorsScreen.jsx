import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FollowedAuthorsScreen = ({ route, navigation }) => {
    const { authors } = route.params;

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('AuthorProfileScreen', { authorID: item.id })}>
            <View style={styles.authorCard}>
                <Text style={styles.authorName}>{item.username}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={styles.imgBack} source={require("../../assets/images/Arrow.png")} />
                </TouchableOpacity>
                <Text style={styles.header}>Patronage</Text>
            </View>
            <Text style={styles.titleText}>Follows:</Text>
            <FlatList
                data={authors}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
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
    authorCard: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#FFF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    authorName: {
        fontSize: 24,
        fontFamily: 'Baskervville',
    },
    titleText: {
        fontFamily: 'Baskervville',
        fontSize: 40,
        padding: 20,
        paddingTop: 0,
        paddingBottom: 10,
        textAlign: 'center'
    }
});

export default FollowedAuthorsScreen;
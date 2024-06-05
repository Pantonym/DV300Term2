import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllUsers } from '../services/accountService';

const UserSearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch users from Firestore when the component mounts
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const usersData = await getAllUsers();
            if (usersData) {
                setUsers(usersData);
                setLoading(false); // Set loading to false once data is fetched
            }
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = users.filter(item =>
            item.email.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const navigateToStoryScreen = (item) => {
        navigation.navigate('AuthorProfileScreen', {
            authorID: item.id
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
                data={searchQuery ? filteredData : users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigateToStoryScreen(item)}
                    >
                        <View style={styles.item}>
                            <Text style={styles.itemText}>{item.email}</Text>
                            <Text style={styles.itemSubtext}>{item.username}</Text>
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
        fontSize: 18,
        fontFamily: 'Baskervville',
    },
    itemSubtext: {
        fontSize: 16,
        fontFamily: 'Baskervville',
        marginLeft: 15,
        textDecorationLine: 'underline'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default UserSearchScreen;
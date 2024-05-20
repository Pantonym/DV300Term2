import { View, StyleSheet, Animated, Dimensions } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useCurrentRoute } from '../../context/CurrentRouteContext';

const { width } = Dimensions.get('window');
const tabWidth = width / 4;  // Assuming 4 tabs

const NavbarComponent = () => {
    const navigation = useNavigation();
    const { currentRoute } = useCurrentRoute();

    const getIconName = (baseName, activeName) => {
        return currentRoute === activeName ? baseName : `${baseName}-outline`;
    };

    const indicatorPosition = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let newIndex;
        switch (currentRoute) {
            case 'HomeScreen':
                newIndex = 0;
                break;
            case 'ShortStoriesScreen':
                newIndex = 1;
                break;
            case 'SearchScreen':
                newIndex = 2;
                break;
            case 'ProfileScreen':
                newIndex = 3;
                break;
            default:
                newIndex = 0;
        }
        Animated.spring(indicatorPosition, {
            toValue: newIndex * tabWidth,
            useNativeDriver: true,
        }).start();
    }, [currentRoute]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navbar}>

                <Ionicons
                    style={styles.navImage}
                    size={35}
                    color={'white'}
                    name={getIconName('book', 'HomeScreen')}
                    onPress={() => navigation.navigate('HomeScreen')}
                />

                <Ionicons
                    style={styles.navImage}
                    size={35}
                    color={'white'}
                    name={getIconName('brush', 'ShortStoriesScreen')}
                    onPress={() => navigation.navigate('ShortStoriesScreen')}
                />

                <Ionicons
                    style={styles.navImage}
                    size={35}
                    color={'white'}
                    name={getIconName('search', 'SearchScreen')}
                    onPress={() => navigation.navigate('SearchScreen')}
                />

                <Ionicons
                    style={styles.navImage}
                    size={35}
                    color={'white'}
                    name={getIconName('person', 'ProfileScreen')}
                    onPress={() => navigation.navigate('ProfileScreen')}
                />

            </View>

            <Animated.View
                style={[
                    styles.indicator,
                    {
                        transform: [{ translateX: indicatorPosition }],
                    },
                ]}
            />
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
    },
    indicator: {
        position: 'absolute',
        bottom: 30,
        width: tabWidth,
        height: 10,
        backgroundColor: '#9A3E53',
        borderRadius: 15
    },
});

export default NavbarComponent
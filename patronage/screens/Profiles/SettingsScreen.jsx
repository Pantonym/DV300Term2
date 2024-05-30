import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { handleImageUpload } from '../../services/bucketService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeUsername } from '../../services/accountService';

const SettingsScreen = ({ navigation }) => {
    // When the user wants to select an image
    const [isUploadingImg, setIsUploadingImg] = useState(false);

    // UseStates for data
    const [userID, setUserID] = useState(null);
    const [image, setImage] = useState(null);

    // When the user is editing the username
    const [isEditingUsername, setIsEditingUsername] = useState(false)
    const [username, setUsername] = useState('')

    // When data is being uploaded to the db
    const [isUploading, setIsUploading] = useState(false);

    const getUserID = async () => {
        const userID = await AsyncStorage.getItem('UserID');
        setUserID(userID);
    };

    useEffect(() => {
        getUserID();
    }, []);

    // Pick an image using ImagePicker
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // upload the image to the db
    const uploadImage = async () => {
        setIsUploading(true); // Disable button usage when the user is uploading data
        try {
            await handleImageUpload(image, userID);
            navigation.goBack();
        } finally {
            setIsUploading(false); // Disable button usage no matter if the upload was a success or failure. This is done to ensure the buttons aren't even disabled when they shouldn't be
        }
    };

    // Confirm if the user wants to change their username
    const confirmUsernameChange = () => {
        Alert.alert(
            "Confirm Username Change",
            "Are you sure you want to change your username?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Username change cancelled"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: handleUsernameChange
                }
            ],
            { cancelable: false }
        );
    };

    // Send the new username to the database, as well as the ID to find the correct user
    const handleUsernameChange = async () => {
        setIsUploading(true); // Disable button usage when the user is uploading data

        try {
            await changeUsername(userID, username);
            navigation.goBack();
        } finally {
            setIsUploading(false);// Disable button usage no matter if the upload was a success or failure.
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')} disabled={isUploading}>
                    <Image
                        style={styles.imgBack}
                        source={require("../../assets/images/Arrow.png")}
                    />
                </TouchableOpacity>
                <Text style={styles.header}>Patronage</Text>
            </View>

            <Text style={styles.titleText}>Settings</Text>

            {/* Change profile icon */}
            {isUploadingImg ? (
                <View>
                    <TouchableOpacity
                        style={styles.btnSelectImage}
                        onPress={pickImage}
                        disabled={isUploading}
                    >
                        <Text style={styles.btnSelectImageText}>Pick an image from camera roll</Text>
                    </TouchableOpacity>
                    {image && <Image source={{ uri: image }} style={styles.image} />}

                    {isUploading ? (
                        <ActivityIndicator size="large" color="#9A3E53" />
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.btnAddImage,
                                { opacity: image === null ? 0.5 : 1 },
                            ]}
                            onPress={uploadImage}
                            disabled={image === null}
                        >
                            <Text style={styles.btnAddImageText}>Change Icon</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.btnCancel}
                        onPress={() => setIsUploadingImg(false)}
                        disabled={isUploading}
                    >
                        <Text style={styles.btnCancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <TouchableOpacity
                        style={styles.btnCancel}
                        onPress={() => setIsUploadingImg(true)}
                        disabled={isUploading}
                    >
                        <Text style={styles.btnCancelText}>Change Profile Icon</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Edit username */}
            {isEditingUsername ? (
                <View>
                    <TextInput
                        style={styles.usernameInput}
                        placeholder='Insert a new username...'
                        onChangeText={setUsername}
                    />

                    {isUploading ? (
                        <ActivityIndicator size="large" color="#9A3E53" style={{ marginTop: 10 }} />
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.btnAdd,
                                { opacity: username === '' ? 0.5 : 1 },
                            ]}
                            onPress={confirmUsernameChange}
                            disabled={username === ''}
                        >
                            <Text style={styles.btnAddImageText}>Change Username</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.btnCancel}
                        onPress={() => setIsEditingUsername(false)}
                        disabled={isUploading}
                    >
                        <Text style={styles.btnCancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <TouchableOpacity
                        style={styles.btnCancel}
                        onPress={() => setIsEditingUsername(true)}
                        disabled={isUploading}
                    >
                        <Text style={styles.btnCancelText}>Change Username</Text>
                    </TouchableOpacity>
                </View >
            )}

        </SafeAreaView >
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
    titleText: {
        fontFamily: 'Baskervville',
        fontSize: 40,
        padding: 20,
        paddingTop: 0,
        paddingBottom: 10,
        textAlign: 'center'
    },
    image: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginBottom: 15,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 100
    },
    btnSelectImage: {
        width: 'auto',
        alignSelf: 'center',
        marginBottom: 15
    },
    btnSelectImageText: {
        fontFamily: 'Baskervville',
        fontSize: 20,
        textAlign: 'center',
        color: 'blue',
        textDecorationLine: 'underline'
    },
    btnAddImage: {
        backgroundColor: "#CAA775",
        width: 200,
        borderRadius: 15,
        alignSelf: 'center',
        paddingVertical: 10
    },
    btnAddImageText: {
        fontFamily: 'Baskervville',
        fontSize: 24,
        textAlign: 'center'
    },
    btnCancel: {
        width: '80%',
        alignSelf: 'center',
        borderBottomWidth: 3,
        marginTop: 15,
        marginBottom: 10
    },
    btnCancelText: {
        fontFamily: 'Baskervville',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10
    },
    usernameInput: {
        alignSelf: 'center',
        fontSize: 20,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        width: 300,
        marginTop: 20
    },
    btnAdd: {
        backgroundColor: "#CAA775",
        width: 250,
        borderRadius: 15,
        alignSelf: 'center',
        marginTop: 15,
        paddingVertical: 10
    }
});

export default SettingsScreen;
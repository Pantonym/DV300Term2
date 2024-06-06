import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleRegister } from '../services/authService';

const RegisterScreen = ({ navigation }) => {
    // User Input Information States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    // Register a user
    const register = () => {
        handleRegister(email, password, username);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>Register</Text>

                {/* Username Input */}
                <Text style={styles.subtitle}>Username</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Your Username"
                    onChangeText={newText => setUsername(newText)}
                    defaultValue={username}
                />

                {/* Email Input */}
                <Text style={styles.subtitle}>Email</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Your Email"
                    onChangeText={newText => setEmail(newText)}
                    defaultValue={email}
                    autoComplete='email'
                    inputMode='email'
                />

                {/* Password Input */}
                <Text style={styles.subtitle}>Password</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Your Password"
                    onChangeText={newText => setPassword(newText)}
                    defaultValue={password}
                    secureTextEntry={true}
                />

                {/* Note: There is no input for user profile image to reduce the work load of registering. The user will be able to change their profile image later. */}

                {/* Submit Data BUtton */}
                <TouchableOpacity style={styles.button} onPress={register}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>

                {/* Change to Login Screen */}
                <TouchableOpacity style={styles.pageLink} onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.pageLinkText}>Already Have an Account? </Text>
                    <Text style={styles.pageLinkTextUnderline}>Log In Here! </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        padding: 20,
        backgroundColor: "#F6EEE3"
    },
    title: {
        width: '100%',
        textAlign: 'center',
        fontFamily: 'Baskervville',
        fontSize: 40
    },
    subtitle: {
        width: '100%',
        textAlign: 'center',
        fontFamily: 'Baskervville',
        fontSize: 32,
        marginTop: 20
    },
    inputField: {
        height: 40,
        marginTop: 15,
        borderRadius: 12,
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10
    },
    button: {
        backgroundColor: "#CAA775",
        textAlign: 'center',
        padding: 10,
        marginTop: 60,
        borderRadius: 12
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Baskervville',
        fontSize: 24
    },
    pageLink: {
        marginTop: 60,
    },
    pageLinkText: {
        textAlign: 'center',
        color: 'black',
        fontFamily: 'Baskervville',
        fontSize: 24
    },
    pageLinkTextUnderline: {
        textAlign: 'center',
        color: 'black',
        fontFamily: 'Baskervville',
        fontSize: 24,
        textDecorationLine: 'underline'
    }
});

export default RegisterScreen;
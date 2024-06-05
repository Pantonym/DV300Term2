import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { handleLogin } from '../services/authService';

const LoginScreen = ({ navigation }) => {

    // User Login:
    // const [email, setEmail] = useState('Glen@gmail.com');
    // const [password, setPassword] = useState('Glen1234');
    // Admin Login:
    const [email, setEmail] = useState('GreatQuill.patronage@gmail.com');
    const [password, setPassword] = useState('Quill1234');
    const [error, setError] = useState(false)

    //  Login Function
    const login = async () => {
        if (email === "GreatQuill.patronage@gmail.com") {
            const bError = await handleLogin(email, password);

            // Display an error if there is one
            setError(bError);
        } else {
            const bError = await handleLogin(email, password);

            // Display an error if there is one
            setError(bError);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>Log In</Text>

                <Text style={styles.subtitle}>Email</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Your Email"
                    onChangeText={newText => setEmail(newText)}
                    defaultValue={email}
                    autoComplete='email'
                    inputMode='email'
                />

                <Text style={styles.subtitle}>Password</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Your Password"
                    onChangeText={newText => setPassword(newText)}
                    defaultValue={password}
                    secureTextEntry={true}
                />

                {error ? <Text style={styles.errorText}>Invalid password or email address</Text> : null}

                <TouchableOpacity style={styles.button} onPress={login}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.pageLink} onPress={() => navigation.navigate('RegisterScreen')}>
                    <Text style={styles.pageLinkText}>Don't Have an Account? </Text>
                    <Text style={styles.pageLinkTextUnderline}>Register Here! </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}

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
        marginTop: 30
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
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        fontFamily: 'Baskervville',
        fontSize: 24,
        marginTop: 10
    }
})

export default LoginScreen
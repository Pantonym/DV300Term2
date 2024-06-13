import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { handleLogin } from '../services/authService';

// TODO: Home screen is removed for current build and is replaced by the short stories screen, but explain the db is set up to future proof.
// In addition, the writing screen is removed and replaced by the write editor screen.

const LoginScreen = ({ navigation }) => {

    // User Input Information States
    // --For logins, once a build is made to launch the app, the admin login info must be deleted and the useState must be set to ''
    // --In addition, admin email must be changed fro security reasons as the password will be visible on GitHub
    // ----User Login:
    const [email, setEmail] = useState('Glen@gmail.com');
    const [password, setPassword] = useState('Glen1234');
    // ----Admin Login:
    // const [email, setEmail] = useState('GreatQuill.patronage@gmail.com');
    // const [password, setPassword] = useState('Quill1234');

    // Error State
    const [error, setError] = useState(false)

    //  Login Function
    const login = async () => {
        const bError = await handleLogin(email, password);

        // --Display an error if there is one
        setError(bError);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>Log In</Text>

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

                {/* Error text that only displays of there is an error */}
                {error ? <Text style={styles.errorText}>Invalid password or email address</Text> : null}

                {/* Submit the entered data */}
                <TouchableOpacity style={styles.button} onPress={login}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>

                {/* Change to register screen */}
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
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { Link } from 'expo-router';

const signUp = () => {

    const [email, onChangeEmail] = useState('example@gmail.com');
    const [password, onChangePassword] = useState('Input Password');

    const styles = StyleSheet.create({
        titleContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: 25
        },
        titleText: {
            fontFamily: 'Baskervville',
            fontSize: 40,
            padding: 20,
            marginTop: 80
        },
        inputText: {
            fontFamily: 'Baskervville',
            fontSize: 32,
            padding: 20,
            marginTop: 20
        },
        submit: {
            backgroundColor: '#CAA775',
            paddingTop: 18,
            paddingBottom: 12,
            paddingLeft: 30,
            paddingEnd: 30,
            borderRadius: 12,
            marginTop: 50
        },
        submitText: {
            color: 'white',
            fontFamily: 'Baskervville',
            fontSize: 24
        },
        logInText: {
            textDecorationLine: 'underline',
            fontFamily: 'Baskervville',
            fontSize: 24,
            marginTop: 100
        }
    });

    return (
        <SafeAreaView>
            <ThemedView style={styles.titleContainer}>
                <ThemedText style={styles.titleText}>
                    Sign Up
                </ThemedText>

                <ThemedText style={styles.inputText}>
                    Username
                </ThemedText>
                <TextInput
                    editable
                    maxLength={60}
                    onChangeText={email => onChangeEmail(email)}
                    value={email}
                    style={{ padding: 10, backgroundColor: 'white', width: 350, height: 45, borderRadius: 12, fontSize: 16 }}
                />

                <ThemedText style={styles.inputText}>
                    Email
                </ThemedText>
                <TextInput
                    editable
                    maxLength={60}
                    onChangeText={email => onChangeEmail(email)}
                    value={email}
                    style={{ padding: 10, backgroundColor: 'white', width: 350, height: 45, borderRadius: 12, fontSize: 16 }}
                />

                <ThemedText style={styles.inputText}>
                    Password
                </ThemedText>
                <TextInput
                    editable
                    maxLength={60}
                    onChangeText={password => onChangePassword(password)}
                    value={password}
                    style={{ padding: 10, backgroundColor: 'white', width: 350, height: 45, borderRadius: 12, fontSize: 16 }}
                />

                <ThemedView style={styles.submit}>
                    <Link href={'../home/'} asChild>
                        <Pressable>
                            <ThemedText style={styles.submitText}>
                                Submit
                            </ThemedText>
                        </Pressable>
                    </Link>
                </ThemedView>

                <Link href={'/logIn'} asChild>
                    <ThemedText style={styles.logInText}>
                        Log In?
                    </ThemedText>
                </Link>

            </ThemedView>
        </SafeAreaView>
    )
}

export default signUp
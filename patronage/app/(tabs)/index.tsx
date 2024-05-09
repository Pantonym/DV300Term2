import { StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function HomeScreen() {

  const [email, onChangeEmail] = useState('example@gmail.com');
  const [password, onChangePassword] = useState('Input Password');

  return (
    <SafeAreaView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText}>
          Home
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}

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
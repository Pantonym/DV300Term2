import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

export default function HomeScreen() {

  return (
    <SafeAreaView>
      <ThemedView style={styles.titleContainer}>

        <ThemedText style={styles.header}>
          Patronage
        </ThemedText>

        <ThemedText style={styles.titleText}>
          Writing Style
        </ThemedText>

        <ThemedView style={styles.card}>
          <Link href={'./read'} asChild>
            <ThemedText style={styles.cardText}>Short Stories</ThemedText>
          </Link>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardText}>Coming Soon...</ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardText}>Coming Soon...</ThemedText>
        </ThemedView>

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
  header: {
    fontFamily: 'Italianno',
    fontSize: 64,
    padding: 20,
    paddingTop: 45
  },
  titleText: {
    fontFamily: 'Baskervville',
    fontSize: 40,
    padding: 20
  },
  card: {
    height: 150,
    width: '100%',
    backgroundColor: '#9A3E53',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    marginRight: -25,
    marginBottom: 20
  },
  cardText: {
    fontFamily: 'Baskervville',
    fontSize: 32,
    color: 'white',
    paddingTop: 20
  }
});
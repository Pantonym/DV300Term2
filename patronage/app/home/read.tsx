import React from 'react'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native';

const read = () => {
  return (
    <SafeAreaView>
      <ThemedView style={styles.titleContainer}>

        <ThemedText style={styles.header}>
          Patronage
        </ThemedText>

        <ThemedText style={styles.titleText}>
          Short Stories
        </ThemedText>

      </ThemedView>
    </SafeAreaView>
  )
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
  }
});

export default read
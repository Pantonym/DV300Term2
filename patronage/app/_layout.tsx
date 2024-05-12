import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Italianno: require('../assets/fonts/Italianno-Regular.ttf'),
    Baskervville: require('../assets/fonts/Baskervville-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // These override the defaultTheme and darkTheme used in the example. This is to make the background color accurate over the entire screen.
  // You cannot use an import to place these styles in another file as it wil override StatusBar color/style changes.
  const MyTheme = {
    dark: false,
    colors: {
      primary: 'rgb(255, 45, 85)',
      background: '#F6EEE3',
      card: 'rgb(255, 255, 255)',
      text: 'black',
      border: 'rgb(199, 199, 204)',
      notification: 'rgb(255, 69, 58)'
    },
  }

  const MyDarkTheme = {
    dark: true,
    colors: {
      primary: 'rgb(255, 45, 85)',
      background: '#F6EEE3',
      card: 'rgb(255, 255, 255)',
      text: 'black',
      border: 'rgb(199, 199, 204)',
      notification: 'rgb(255, 69, 58)'
    },
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? MyDarkTheme : MyTheme}>
      {/* This changes the background color of the status bar to match the background of the app. It also makes the color readable.*/}
      <StatusBar style='dark'></StatusBar>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

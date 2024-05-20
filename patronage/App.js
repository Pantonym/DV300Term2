import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useFonts } from 'expo-font';

import UserStack from './components/stacks/UserStack';
import RegisterStack from './components/stacks/RegisterStack';
import { CurrentRouteProvider } from './context/CurrentRouteContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Italianno': require('./assets/fonts/Italianno-Regular.ttf'),
    'Baskervville': require('./assets/fonts/Baskervville-Regular.ttf'),
  });

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Listening ig the user is logged in or out
    // Always add auth (or the tool you are using)
    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user) {
        setLoggedIn(true);
        console.log("There is a user logged in: " + user.email)
      } else {
        setLoggedIn(false);
        console.log("No user logged in.")
      }

    })

    return unsubscribe

  }, [])

  return (
    <>
      {loggedIn ? (
        <CurrentRouteProvider>
          <UserStack />
        </CurrentRouteProvider>
      ) : (
        <RegisterStack />
      )}
    </>
  );
}
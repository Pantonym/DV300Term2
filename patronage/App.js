import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useFonts } from 'expo-font';

import UserStack from './components/stacks/UserStack';
import RegisterStack from './components/stacks/RegisterStack';
import { CurrentRouteProvider } from './context/CurrentRouteContext';
import AdminStack from './components/stacks/AdminStack';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Italianno': require('./assets/fonts/Italianno-Regular.ttf'),
    'Baskervville': require('./assets/fonts/Baskervville-Regular.ttf'),
  });

  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);

        if (user.email === "greatquill.patronage@gmail.com") {
          // If the user is an admin
          setIsAdmin(true)
        } else {
          // If the user is not an admin. 
          // This line is required as if a user logs in to an admin account, logs out and then logs into a normal account, 
          // the isAdmin is not set back to false and as such they will have access to admin navigation.
          setIsAdmin(false)
        }

        console.log("There is a user logged in")
      } else {
        setLoggedIn(false);
        console.log("No user logged in.")
      }
    });

    return unsubscribe;

  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      {loggedIn ? (
        <CurrentRouteProvider>

          {isAdmin ? (
            <AdminStack />
          ) : (
            <UserStack />
          )}

        </CurrentRouteProvider>
      ) : (
        <RegisterStack />
      )}
    </>
  );
}
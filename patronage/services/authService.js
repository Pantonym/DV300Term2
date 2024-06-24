import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updatePassword } from "firebase/auth";
import { auth } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUser } from "./accountService";

// Log In
export const handleLogin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await AsyncStorage.setItem('UserEmail', user.email);
        await AsyncStorage.setItem('UserID', user.uid);

        return false; // No error
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log("Code: " + errorCode + " ///// Message: " + errorMessage);

        return true; // Error occurred
    }
};

// Sign Up
export const handleRegister = (email, password, username) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            console.log("Signed Up User: " + user.email);

            const userData = {
                "username": username,
                "email": email,
                "userImg": "https://firebasestorage.googleapis.com/v0/b/patronage-31cea.appspot.com/o/defaultIcon.png?alt=media&token=dda3538d-50f5-40b0-bb47-e16d5bbfaa07",
                "awards": []
                // "works", "favouriteStories", and "following" will be initialized as empty subcollections
            };

            await createUser(userData, user.uid);

            // Log the user in after account creation
            handleLogin(email, password);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log("Code: " + errorCode + " ///// Message:" + errorMessage);
        });
};

export const handleSignOut = async () => {
    try {
        await signOut(auth);
        await AsyncStorage.removeItem('UserEmail');
        await AsyncStorage.removeItem('UserID');
        console.log('logged out');
    } catch (error) {
        console.log('Error when logging out: ' + error);
    }
};

export const changePassword = (newPassword) => {
    const user = auth.currentUser;

    updatePassword(user, newPassword).then(() => {
        console.log('Password Update Successful')
    }).catch((error) => {
        console.log('An error occurred: ', error)
    });
}
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUser } from "./accountService";

// Log In
export const handleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Logged In User: " + user.uid);

            AsyncStorage.setItem('UserEmail', user.email);
            AsyncStorage.setItem('UserID', user.uid);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log("Code: " + errorCode + " ///// Message:" + errorMessage);
        });
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
                "userImg": "../assets/icons/ProfileIcon.png",
                "awards": [],
                "works": []
            };

            console.log("USERNAME: ----------------", username);

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

export const handleSignOut = () => {
    signOut(auth).then(() => {
        console.log('logged out');
    }).catch((error) => {
        console.log('Error when logging out: ' + error);
    });
};

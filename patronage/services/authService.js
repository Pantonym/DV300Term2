import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

// Log In
export const handleLogin = (email, password) => {

    signInWithEmailAndPassword(auth, email, password)
        // userCredential is what is returned when the function is successful (logging in)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("Logged In User: " + user.email)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log("Code: " + errorCode + " ///// Message:" + errorMessage)
        });

}

// Sign Up
export const handleRegister = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("Signed Up User: " + user.email);
            handleLogin(email, password);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log("Code: " + errorCode + " ///// Message:" + errorMessage)
        });
}

export const handleSignOut = () => {
    signOut(auth).then(() => {
        console.log('logged out')
    }).catch((error) => {
        console.log('Error when logging out: ' + error)
    });
}
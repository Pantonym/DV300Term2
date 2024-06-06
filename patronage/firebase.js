// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDsgtxYAlqqNm8GRh4b7eqOEWQoe8zz03o",
    authDomain: "patronage-31cea.firebaseapp.com",
    projectId: "patronage-31cea",
    storageBucket: "patronage-31cea.appspot.com",
    messagingSenderId: "601445212652",
    appId: "1:601445212652:web:47214bf05e7f9fa3a460c9",
    measurementId: "G-WJT28P1W9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// TODO: Change database to use sub collections instead of nested arrays Future Implementation

// TODO: Persistence using asyncstorage and InitializeAuth. This has proven difficult because of hot reloading causing the app to attempt multiple inits.
// firebase file suitable for persistence:

// --Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// --Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyDsgtxYAlqqNm8GRh4b7eqOEWQoe8zz03o",
//     authDomain: "patronage-31cea.firebaseapp.com",
//     projectId: "patronage-31cea",
//     storageBucket: "patronage-31cea.appspot.com",
//     messagingSenderId: "601445212652",
//     appId: "1:601445212652:web:47214bf05e7f9fa3a460c9",
//     measurementId: "G-WJT28P1W9G"
// };

// let initialized = false;
// let app;
// let auth;
// let db;
// let storage;

// --Initialize Firebase
// const initializeFirebase = () => {
//     if (!initialized) {
//         app = initializeApp(firebaseConfig);
//         auth = initializeAuth(app, {
//             persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//         });
//         db = getFirestore(app);
//         storage = getStorage(app);
//         initialized = true;
//     }
// };

// --Ensure Firebase is initialized only once
// initializeFirebase();

// export { app, auth, db, storage };
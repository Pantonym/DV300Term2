// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    // --Previous Database
    // apiKey: "AIzaSyDsgtxYAlqqNm8GRh4b7eqOEWQoe8zz03o",
    // authDomain: "patronage-31cea.firebaseapp.com",
    // projectId: "patronage-31cea",
    // storageBucket: "patronage-31cea.appspot.com",
    // messagingSenderId: "601445212652",
    // appId: "1:601445212652:web:47214bf05e7f9fa3a460c9",
    // measurementId: "G-WJT28P1W9G"

    // --New database
    apiKey: "AIzaSyDimujoc-Lba12wi2KdmHQKoJi3wBsPra0",
    authDomain: "patronagerework.firebaseapp.com",
    projectId: "patronagerework",
    storageBucket: "patronagerework.appspot.com",
    messagingSenderId: "740811587049",
    appId: "1:740811587049:web:9d0720263c83932aab5f78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native persistence
const authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = authInstance;
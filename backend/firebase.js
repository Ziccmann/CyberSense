import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// App's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA3neUA2QdTukCOboYrqJSMY8K5ySASTQ",
  authDomain: "cybersense-fb025.firebaseapp.com",
  projectId: "cybersense-fb025",
  storageBucket: "cybersense-fb025.appspot.com",
  messagingSenderId: "602417848441",
  appId: "1:602417848441:web:da9c80c320750ff567f4a8",
  measurementId: "G-YGETF7STML"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

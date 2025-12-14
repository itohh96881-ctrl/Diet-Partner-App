
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot, deleteDoc } from 'firebase/firestore';

const myFirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "diet-patner-app.firebaseapp.com",
    projectId: "diet-patner-app",
    storageBucket: "diet-patner-app.firebasestorage.app",
    messagingSenderId: "507433854484",
    appId: "1:507433854484:web:36372f9b7d16e6b4dc6901"
};

// Use window.__firebase_config if available (legacy support or injection), otherwise use default
const firebaseConfig = window.__firebase_config ? JSON.parse(window.__firebase_config) : myFirebaseConfig;

let app;
let auth;
let db;
let initializationError = null;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
} catch (e) {
    console.error("Firebase initialization failed:", e);
    initializationError = e;
}

export const appId = 'diet-partner-app'; 

export { app, auth, db, signInAnonymously, signInWithCustomToken, onAuthStateChanged, collection, doc, setDoc, onSnapshot, deleteDoc, initializationError };

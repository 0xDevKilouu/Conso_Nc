import { initializeApp } from "firebase/app";
import { getAuth, EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import * as firebaseui from 'firebaseui';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Configurer FirebaseUI
const uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: (authResult, redirectUrl) => {
      console.log('Sign-in successful!');
      return true;
    },
    uiShown: () => {
      console.log('FirebaseUI shown!');
    }
  }
};

const ui = new firebaseui.auth.AuthUI(auth);

export { auth, ui, uiConfig, firestore, storage };

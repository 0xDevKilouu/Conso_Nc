import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
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
auth.languageCode = 'fr';

const googleProvider = new GoogleAuthProvider();
const firestore = getFirestore(app);
const storage = getStorage(app);

// Configurer FirebaseUI
const uiConfig = {
  signInSuccessUrl: '#account',
  signInOptions: [
    {
      provider: GoogleAuthProvider.PROVIDER_ID,
      fullLabel: "Se connecter avec Google",
    },
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
      fullLabel: "S'inscrire avec votre email."
    }
  ],
  tosUrl: '<your-terms-of-service-url>',
  privacyPolicyUrl: '<your-privacy-policy-url>',
};

const ui = new firebaseui.auth.AuthUI(auth);

export { auth, googleProvider, ui, uiConfig, firestore, storage };

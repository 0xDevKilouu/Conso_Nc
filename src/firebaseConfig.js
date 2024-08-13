// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, EmailAuthProvider, signInWithRedirect } from "firebase/auth";
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
auth.languageCode = 'fr'; // Définit la langue en français

const googleProvider = new GoogleAuthProvider();
const firestore = getFirestore(app);
const storage = getStorage(app);

// Configurer FirebaseUI
const uiConfig = {
  signInSuccessUrl: '/', // Redirection après connexion
  signInOptions: [
    {
      provider: GoogleAuthProvider.PROVIDER_ID,
      fullLabel: "Se connecter avec Google", // Texte en français pour le bouton Google
    },
    {
      provider: EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false, // Ne pas exiger de nom d'affichage
    },
  ],
  tosUrl: '<your-terms-of-service-url>', // URL des termes de service
  privacyPolicyUrl: '<your-privacy-policy-url>', // URL de la politique de confidentialité
  callbacks: {
    signInSuccessWithAuthResult: (authResult, redirectUrl) => {
      console.log('Connexion réussie !');
      return true;
    },
    uiShown: () => {
      console.log('Interface FirebaseUI affichée !');
      const nextButton = document.querySelector('.firebaseui-id-submit');
      if (nextButton) {
        nextButton.innerText = 'Suivant'; // Changer le texte du bouton en français
      }
    }
  }
};

const ui = new firebaseui.auth.AuthUI(auth);

export { auth, googleProvider, ui, uiConfig, firestore, storage, signInWithRedirect };

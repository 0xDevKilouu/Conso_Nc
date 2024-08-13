// firebaseConfig.js
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
auth.languageCode = 'fr';  // Assurez-vous que la langue est définie en français

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
      signInMethod: EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,  // Utiliser l'authentification par mot de passe
      fullLabel: "Se connecter avec l'email et mot de passe" // Texte en français pour l'email
    }
  ],
  tosUrl: '<your-terms-of-service-url>', // URL des termes de service
  privacyPolicyUrl: '<your-privacy-policy-url>', // URL de la politique de confidentialité
  callbacks: {
    signInSuccessWithAuthResult: (authResult, redirectUrl) => {
      console.log('Connexion réussie !');
      return true; // Continue la redirection vers signInSuccessUrl
    },
    uiShown: () => {
      console.log('Interface FirebaseUI affichée !');
      const nextButton = document.querySelector('.firebaseui-id-submit');
      if (nextButton) {
        nextButton.innerText = 'Suivant'; // Assurez-vous que le texte du bouton est correct
      }
    }
  }
};

const ui = new firebaseui.auth.AuthUI(auth);

export { auth, googleProvider, ui, uiConfig, firestore, storage };

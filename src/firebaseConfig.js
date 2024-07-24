import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import * as firebaseui from 'firebaseui';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCenXl0HoRahcnsDZuHe_fw3dli97shei0",
  authDomain: "consonc-26043.firebaseapp.com",
  projectId: "consonc-26043",
  storageBucket: "consonc-26043.appspot.com",
  messagingSenderId: "347349604983",
  appId: "1:347349604983:web:8300836901a9bf62768472",
  measurementId: "G-BY69W74409"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configurer FirebaseUI
const uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
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

export { auth, googleProvider, ui, uiConfig };

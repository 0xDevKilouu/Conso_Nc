// Importer Firebase
import firebase from "firebase/app";
import "firebase/auth";
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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Configurer FirebaseUI
const uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

const ui = new firebaseui.auth.AuthUI(auth);

export { auth, googleProvider, ui, uiConfig };

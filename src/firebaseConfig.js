import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import * as firebaseui from 'firebaseui';

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

function handleClientLoad() {
  console.log("Google API client load started");
  gapi.load('client:auth2', initClient);
}

function initClient() {
  console.log("Initializing Google API client");
  gapi.client.init({
    apiKey: process.env.FIREBASE_API_KEY,
    clientId: '545413279038-qsivhgi9o357vq1chnfnh5jrsq3jbffu.apps.googleusercontent.com',
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    scope: 'https://www.googleapis.com/auth/drive.metadata.readonly'
  }).then(function () {
    console.log("Google API client initialized");
    // Handle sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  }, function(error) {
    console.log("Error initializing Google API client:", JSON.stringify(error, null, 2));
  });
}

function updateSigninStatus(isSignedIn) {
  console.log("Sign-in status changed:", isSignedIn);
  if (isSignedIn) {
    console.log("Signed in");
  } else {
    console.log("Not signed in");
  }
}

// Assurez-vous que gapi est chargé avant d'initialiser FirebaseUI
document.addEventListener('DOMContentLoaded', () => {
  handleClientLoad();
});

export { auth, googleProvider, ui, uiConfig };

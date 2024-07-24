// Account.js
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
}

function initializeFirebaseApp() {
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

  const renderUserInfo = (user) => `
    <div id="user-info">
      <p>Bienvenue, ${user.displayName || user.email}</p>
      <button id="logout-button">Déconnexion</button>
    </div>
  `;

  const renderAuthUI = () => `
    <div id="firebaseui-auth-container"></div>
  `;

  const renderAccountPage = (user) => {
    return `
      <div id="account">
        <h2>Compte</h2>
        ${user ? renderUserInfo(user) : renderAuthUI()}
      </div>
    `;
  };

  const attachEventListeners = () => {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        auth.signOut().then(() => {
          alert('Déconnexion réussie');
          handleAuthStateChange();  // Re-render the auth UI after logout
        }).catch((error) => {
          console.error('Erreur de déconnexion:', error);
        });
      });
    }
  };

  const handleAuthStateChange = () => {
    auth.onAuthStateChanged((user) => {
      document.getElementById('content').innerHTML = renderAccountPage(user);
      attachEventListeners();
      if (!user) {
        ui.start('#firebaseui-auth-container', uiConfig);
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    handleAuthStateChange();
  });
}

// Charger dynamiquement les scripts Firebase
loadScript('https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js', () => {
  loadScript('https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js', () => {
    loadScript('https://cdn.firebase.com/libs/firebaseui/6.0.0/firebaseui.js', () => {
      initializeFirebaseApp();
    });
  });
});

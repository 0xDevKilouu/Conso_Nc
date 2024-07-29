import { auth, ui, uiConfig, signInWithRedirect, googleProvider } from '../firebaseConfig';
import { getRedirectResult } from "firebase/auth";

const renderUserInfo = (user) => `
  <div id="user-info">
    <p>Bienvenue, ${user.displayName || user.email}</p>
    <button id="logout-button">Déconnexion</button>
  </div>
`;

const renderAuthUI = () => `
  <div id="account-container">
    <h2>Connexion</h2>
    <div id="firebaseui-auth-container"></div>
    <button id="google-signin-button">Se connecter avec Google</button>
  </div>
`;

const renderAccountPage = (user) => `
  <div id="account">
    <h2>Compte</h2>
    ${user ? renderUserInfo(user) : renderAuthUI()}
  </div>
`;

const attachEventListeners = () => {
  const logoutButton = document.getElementById('logout-button');
  const googleSigninButton = document.getElementById('google-signin-button');

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

  if (googleSigninButton) {
    googleSigninButton.addEventListener('click', () => {
      signInWithRedirect(auth, googleProvider);
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
  getRedirectResult(auth)
    .then((result) => {
      if (result && result.user) {
        console.log('Utilisateur connecté après redirection:', result.user);
        const content = document.getElementById('content');
        if (window.location.hash.substring(1) === 'account') {
          content.innerHTML = renderAccountPage(result.user);
          attachEventListeners();
        }
      }
    })
    .catch((error) => {
      console.error('Erreur de connexion:', error);
    });

  if (window.location.hash.substring(1) === 'account') {
    handleAuthStateChange();
  }
});

export default handleAuthStateChange;

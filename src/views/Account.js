import { auth, ui, uiConfig } from '../firebaseConfig';
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
  </div>
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
    console.log('Auth state changed:', user);
    const content = document.getElementById('content');
    if (window.location.hash.substring(1) === 'account') {
      content.innerHTML = renderAccountPage(user);
      attachEventListeners();
      if (!user) {
        console.log('Starting FirebaseUI');
        ui.start('#firebaseui-auth-container', uiConfig);
      }
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

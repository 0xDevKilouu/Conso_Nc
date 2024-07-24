// Account.js
import { auth, ui, uiConfig } from './firebaseConfig';

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

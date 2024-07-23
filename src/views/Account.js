import { auth, ui, uiConfig } from '../firebaseConfig';

const Account = () => {
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
    console.log('Rendering account page with user:', user);
    return `
      <div id="account">
        <h2>Compte</h2>
        ${user ? renderUserInfo(user) : renderAuthUI()}
      </div>
    `;
  };

  const attachEventListeners = () => {
    const user = auth.currentUser;
    if (user) {
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
    }
  };

  const handleAuthStateChange = () => {
    auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user);
      document.getElementById('content').innerHTML = renderAccountPage(user);
      attachEventListeners();
      if (!user) {
        ui.start('#firebaseui-auth-container', uiConfig);
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    handleAuthStateChange();
  });

  return renderAccountPage(auth.currentUser);
};

export default Account;

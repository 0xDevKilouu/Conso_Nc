import { auth, ui, uiConfig, googleProvider } from '../firebaseConfig';
import { getRedirectResult, signInWithRedirect, updateProfile, updatePassword } from "firebase/auth";

let isUpdateFormVisible = false;

const toggleUpdateForm = () => {
  isUpdateFormVisible = !isUpdateFormVisible;
  handleAuthStateChange();
};

const renderUserInfo = (user) => `
  <div id="user-info">
    <p>Bienvenue, ${user.displayName || user.email}</p>
    <button id="update-profile-button">Mettre à jour son profil</button>
    ${isUpdateFormVisible ? `
      <form id="update-profile-form">
        <input type="text" id="new-display-name" placeholder="Nouveau nom" value="${user.displayName || ''}" />
        <input type="password" id="new-password" placeholder="Nouveau mot de passe" />
        <button type="submit">Enregistrer</button>
      </form>
    ` : ''}
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
    ${user ? renderUserInfo(user) : '<h2>Compte</h2>' + renderAuthUI()}
  </div>
`;

const attachEventListeners = () => {
  const logoutButton = document.getElementById('logout-button');
  const googleSigninButton = document.getElementById('google-signin-button');
  const updateProfileButton = document.getElementById('update-profile-button');
  const updateProfileForm = document.getElementById('update-profile-form');

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

  if (updateProfileButton) {
    updateProfileButton.addEventListener('click', toggleUpdateForm);
  }

  if (updateProfileForm) {
    updateProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newDisplayName = document.getElementById('new-display-name').value;
      const newPassword = document.getElementById('new-password').value;
      const user = auth.currentUser;

      if (newDisplayName && user) {
        updateProfile(user, { displayName: newDisplayName }).then(() => {
          alert('Nom mis à jour');
          handleAuthStateChange();
        }).catch((error) => {
          console.error('Erreur de mise à jour du nom:', error);
        });
      }

      if (newPassword && user) {
        updatePassword(user, newPassword).then(() => {
          alert('Mot de passe mis à jour');
        }).catch((error) => {
          console.error('Erreur de mise à jour du mot de passe:', error);
        });
      }
    });
  }
};

const handleAuthStateChange = () => {
  auth.onAuthStateChanged((user) => {
    if (window.location.hash.substring(1) === 'account') {
      document.getElementById('content').innerHTML = renderAccountPage(user);
      attachEventListeners();
      if (!user) {
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
        handleAuthStateChange(); // Re-render the auth UI with the logged-in user
      }
    })
    .catch((error) => {
      console.error('Erreur de connexion:', error);
    });

  handleAuthStateChange(); // Initial call to handle the current auth state
});

export default handleAuthStateChange;

import { auth, signInWithEmailAndPassword, getRedirectResult, updateProfile, updatePassword } from "firebase/auth";
import { ui, uiConfig } from '../firebaseConfig';

let isUpdateFormVisible = false;

const toggleUpdateForm = () => {
  isUpdateFormVisible = !isUpdateFormVisible;
  handleAuthStateChange();
};

const renderUserInfo = (user) => `
  <div id="user-info">
    <p>Bienvenue, ${user.displayName || user.email}</p>
    <p><strong>Email vérifié:</strong> ${user.emailVerified ? 'Oui' : 'Non'}</p>
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

const renderLoginForm = () => `
  <form id="login-form">
    <input type="email" id="login-email" placeholder="Email" required />
    <input type="password" id="login-password" placeholder="Mot de passe" required />
    <button type="submit">Se connecter</button>
  </form>
  <div id="login-error"></div>
`;

const renderAuthUI = () => `
  <div id="account-container">
    <div id="firebaseui-auth-container"></div>
    ${renderLoginForm()}
    <p id="already-have-account">
      Déjà un compte ? <a href="#" id="login-link">Se connecter</a>
    </p>
  </div>
`;

const renderAccountPage = (user) => `
  <div id="account">
    <h2>${user ? 'Compte' : 'Connexion'}</h2>
    ${user ? renderUserInfo(user) : renderAuthUI()}
  </div>
`;

const attachEventListeners = () => {
  const logoutButton = document.getElementById('logout-button');
  const updateProfileButton = document.getElementById('update-profile-button');
  const updateProfileForm = document.getElementById('update-profile-form');
  const loginForm = document.getElementById('login-form');

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      auth.signOut().then(() => {
        alert('Déconnexion réussie');
        window.location.hash = 'home';  // Rediriger vers la page d'accueil après déconnexion
        handleAuthStateChange();  // Re-rendre l'interface après déconnexion
      }).catch((error) => {
        console.error('Erreur de déconnexion:', error);
      });
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

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log('Connexion réussie:', userCredential.user);
          handleAuthStateChange(); // Re-rendre l'interface avec l'utilisateur connecté
        })
        .catch((error) => {
          console.error('Erreur de connexion:', error);
          document.getElementById('login-error').innerText = 'Erreur de connexion: ' + error.message;
        });
    });
  }
};

const handleAuthStateChange = () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Si l'utilisateur est connecté, afficher la page de compte
      window.location.hash = 'account';
    }

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
        handleAuthStateChange(); // Re-rendre l'interface avec l'utilisateur connecté
      }
    })
    .catch((error) => {
      console.error('Erreur de connexion:', error);
    });

  handleAuthStateChange(); // Appel initial pour gérer l'état d'authentification actuel
});

export default handleAuthStateChange;

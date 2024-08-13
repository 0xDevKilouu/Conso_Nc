import { auth, ui, uiConfig } from '../firebaseConfig';
import { getRedirectResult } from "firebase/auth";

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

const renderAuthUI = () => `
  <div id="account-container">
    <div id="firebaseui-auth-container"></div>
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

// Ajout du script de remplacement de texte pour la traduction en français
const replaceFirebaseUIText = () => {
  // Remplacer la phrase "By continuing, you are indicating that you accept our Terms of Service and Privacy Policy."
  const termsElement = document.querySelector('.firebaseui-card-footer');
  if (termsElement) {
    termsElement.innerHTML = `
      En continuant, vous indiquez que vous acceptez nos 
      <a href="<your-terms-of-service-url>" target="_blank">Conditions d'utilisation</a> 
      et notre 
      <a href="<your-privacy-policy-url>" target="_blank">Politique de confidentialité</a>.
    `;
  }

  // Remplacer les autres éléments qui restent en anglais
  document.querySelectorAll('.firebaseui-id-submit').forEach(button => {
    if (button.innerText.toLowerCase() === 'next') {
      button.innerText = 'Suivant';
    }
    if (button.innerText.toLowerCase() === 'cancel') {
      button.innerText = 'Annuler';
    }
    if (button.innerText.toLowerCase() === 'back') {
      button.innerText = 'Retour';
    }
  });

  document.querySelectorAll('.firebaseui-id-secondary-link').forEach(link => {
    if (link.innerText.toLowerCase().includes('trouble getting email')) {
      link.innerText = 'Problème pour recevoir l\'email ?';
    }
  });

  document.querySelectorAll('.firebaseui-id-page-sign-in').forEach(signInText => {
    if (signInText.innerText.toLowerCase().includes('sign-in email sent')) {
      signInText.innerText = 'Email de connexion envoyé';
    }
  });
};

const handleAuthStateChange = () => {
  auth.onAuthStateChanged((user) => {
    if (window.location.hash.substring(1) === 'account') {
      document.getElementById('content').innerHTML = renderAccountPage(user);
      attachEventListeners();
      if (!user) {
        ui.start('#firebaseui-auth-container', uiConfig).then(replaceFirebaseUIText);
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

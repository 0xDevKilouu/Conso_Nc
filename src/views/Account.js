import { auth, ui, uiConfig } from '../firebaseConfig';
import { getRedirectResult, signInWithEmailAndPassword, updateProfile, updatePassword } from "firebase/auth";

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
    <p id="already-have-account">
      Déjà un compte ? <a href="#" id="login-link">Se connecter</a>
    </p>
  </div>
`;

const renderLoginModal = () => `
  <div id="login-modal" class="modal">
    <div class="modal-content">
      <span id="close-modal" class="close">&times;</span>
      <h2>Connexion</h2>
      <form id="login-form">
        <input type="email" id="login-email" placeholder="Email" required />
        <input type="password" id="login-password" placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
      </form>
    </div>
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
  const loginLink = document.getElementById('login-link');

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

  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Ajouter la modale au DOM
      document.getElementById('content').insertAdjacentHTML('beforeend', renderLoginModal());
      
      // Afficher la modale
      const modal = document.getElementById('login-modal');
      modal.style.display = 'block';
      
      // Fermer la modale lorsque l'utilisateur clique sur le "x"
      const closeModal = document.getElementById('close-modal');
      closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        modal.remove(); // Supprime la modale du DOM pour éviter l'accumulation
      });

      // Gestion de la soumission du formulaire de connexion
      const loginForm = document.getElementById('login-form');
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Authentification avec Firebase
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            alert('Connexion réussie');
            modal.style.display = 'none';
            modal.remove(); // Supprime la modale après la connexion
            handleAuthStateChange(); // Réafficher la page de compte après connexion
          })
          .catch((error) => {
            console.error('Erreur de connexion:', error);
            alert('Erreur de connexion: ' + error.message);
          });
      });
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
        handleAuthStateChange(); // Re-rendre l'interface avec l'utilisateur connecté
      }
    })
    .catch((error) => {
      console.error('Erreur de connexion:', error);
    });

  handleAuthStateChange(); // Appel initial pour gérer l'état d'authentification actuel
});

export default handleAuthStateChange;

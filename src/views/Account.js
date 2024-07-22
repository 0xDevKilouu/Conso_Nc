import { auth } from '../data/firebaseConfig';

const Account = () => {
  const renderUserInfo = (user) => `
    <div id="user-info">
      <p>Bienvenue, ${user.email}</p>
      <button id="logout-button">Déconnexion</button>
    </div>
  `;

  const renderLoginForm = () => `
    <form id="login-form">
      <input type="email" id="email" placeholder="Email" required>
      <input type="password" id="password" placeholder="Mot de passe" required>
      <button type="button" id="login-button">Connexion</button>
      <button type="button" id="show-signup-form-button">Inscription</button>
    </form>
  `;

  const renderSignupForm = () => `
    <form id="signup-form">
      <input type="email" id="signup-email" placeholder="Email" required>
      <input type="password" id="signup-password" placeholder="Mot de passe" required>
      <button type="button" id="signup-button">S'inscrire</button>
      <button type="button" id="show-login-form-button">Retour</button>
    </form>
  `;

  const renderAccountPage = (user) => `
    <div id="account">
      <h2>Compte</h2>
      ${user ? renderUserInfo(user) : renderLoginForm()}
    </div>
  `;

  const attachEventListeners = () => {
    const user = auth.currentUser;
    if (user) {
      const logoutButton = document.getElementById('logout-button');
      if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
      }
    } else {
      const loginButton = document.getElementById('login-button');
      const signupFormButton = document.getElementById('show-signup-form-button');
      if (loginButton && signupFormButton) {
        loginButton.addEventListener('click', handleLogin);
        signupFormButton.addEventListener('click', showSignupForm);
      }
    }
  };

  const handleAuthStateChange = () => {
    auth.onAuthStateChanged((user) => {
      document.getElementById('content').innerHTML = renderAccountPage(user);
      attachEventListeners();
    });
  };

  const handleLogin = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      await auth.signInWithEmailAndPassword(email, password);
      alert('Connexion réussie');
      handleAuthStateChange();
    } catch (error) {
      alert('Erreur de connexion: ' + error.message);
    }
  };

  const handleSignup = async () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      alert('Inscription réussie');
      handleAuthStateChange();
    } catch (error) {
      alert('Erreur d\'inscription: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert('Déconnexion réussie');
      handleAuthStateChange();
    } catch (error) {
      alert('Erreur de déconnexion: ' + error.message);
    }
  };

  const showSignupForm = () => {
    document.getElementById('content').innerHTML = renderSignupForm();
    const signupButton = document.getElementById('signup-button');
    const showLoginFormButton = document.getElementById('show-login-form-button');
    if (signupButton && showLoginFormButton) {
      signupButton.addEventListener('click', handleSignup);
      showLoginFormButton.addEventListener('click', showLoginForm);
    }
  };

  const showLoginForm = () => {
    document.getElementById('content').innerHTML = renderLoginForm();
    const loginButton = document.getElementById('login-button');
    const signupFormButton = document.getElementById('show-signup-form-button');
    if (loginButton && signupFormButton) {
      loginButton.addEventListener('click', handleLogin);
      signupFormButton.addEventListener('click', showSignupForm);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    handleAuthStateChange();
  });

  return renderAccountPage(auth.currentUser);
};

export default Account;

import { auth } from './firebaseConfig';
import { handleLogin, handleSignup, handleGoogleLogin, handleLogout } from './auth';

const Account = () => {
  const renderUserInfo = (user) => `
    <div id="user-info">
      <p>Bienvenue, ${user.displayName || user.email}</p>
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
    <div id="google-login-button">
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
      <span>Se connecter avec Google</span>
    </div>
  `;

  const renderSignupForm = () => `
    <form id="signup-form">
      <input type="text" id="signup-name" placeholder="Nom" required>
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
      const googleLoginButton = document.getElementById('google-login-button');
      if (loginButton && signupFormButton && googleLoginButton) {
        loginButton.addEventListener('click', handleLogin);
        signupFormButton.addEventListener('click', showSignupForm);
        googleLoginButton.addEventListener('click', handleGoogleLogin);
      }
    }
  };

  const handleAuthStateChange = () => {
    auth.onAuthStateChanged((user) => {
      document.getElementById('content').innerHTML = renderAccountPage(user);
      attachEventListeners();
    });
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
    const googleLoginButton = document.getElementById('google-login-button');
    if (loginButton && signupFormButton && googleLoginButton) {
      loginButton.addEventListener('click', handleLogin);
      signupFormButton.addEventListener('click', showSignupForm);
      googleLoginButton.addEventListener('click', handleGoogleLogin);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    handleAuthStateChange();
  });

  return renderAccountPage(auth.currentUser);
};

export default Account;

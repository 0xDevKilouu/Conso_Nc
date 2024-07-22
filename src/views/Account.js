import { auth, googleProvider } from '../data/firebaseConfig';

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
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    if (password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({
        displayName: name,
      });
      alert('Inscription réussie');
      handleAuthStateChange();
    } catch (error) {
      alert('Erreur d\'inscription: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await auth.signInWithPopup(googleProvider);
      alert('Connexion avec Google réussie');
      handleAuthStateChange();
    } catch (error) {
      alert('Erreur de connexion avec Google: ' + error.message);
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

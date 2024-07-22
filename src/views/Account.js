import { auth } from '../data/firebaseConfig';

const Account = () => {
  const renderUserInfo = (user) => `
    <div id="user-info">
      <p>Bienvenue, ${user.email}</p>
      <button id="logout-button">Déconnexion</button>
    </div>
  `;

  const renderLoginForm = () => `
    <div id="login-form">
      <input type="email" id="email" placeholder="Email" required>
      <input type="password" id="password" placeholder="Mot de passe" required>
      <button id="login-button">Connexion</button>
      <button id="show-signup-form-button">Inscription</button>
    </div>
  `;

  const renderSignupForm = () => `
    <div id="signup-form">
      <input type="email" id="signup-email" placeholder="Email" required>
      <input type="password" id="signup-password" placeholder="Mot de passe" required>
      <button id="signup-button">S'inscrire</button>
      <button id="show-login-form-button">Retour</button>
    </div>
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
      console.log('Attaching event listener to logout button');
      const logoutButton = document.getElementById('logout-button');
      if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
      } else {
        console.log('Logout button not found');
      }
    } else {
      console.log('Attaching event listeners to login and signup buttons');
      const loginButton = document.getElementById('login-button');
      const signupFormButton = document.getElementById('show-signup-form-button');
      if (loginButton && signupFormButton) {
        loginButton.addEventListener('click', handleLogin);
        signupFormButton.addEventListener('click', showSignupForm);
      } else {
        console.log('Login or signup form button not found');
      }
    }
  };

  const handleAuthStateChange = () => {
    auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user);
      document.getElementById('content').innerHTML = renderAccountPage(user);
      attachEventListeners();
    });
  };

  const handleLogin = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Login Attempt:', { email, password });
    try {
      await auth.signInWithEmailAndPassword(email, password);
      alert('Connexion réussie');
      handleAuthStateChange();
    } catch (error) {
      alert('Erreur de connexion: ' + error.message);
      console.error('Login Error:', error);
    }
  };

  const handleSignup = async () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    console.log('Signup Attempt:', { email, password });
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      alert('Inscription réussie');
      handleAuthStateChange();
    } catch (error) {
      alert('Erreur d\'inscription: ' + error.message);
      console.error('Signup Error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert('Déconnexion réussie');
      handleAuthStateChange();
    } catch (error) {
      alert('Erreur de déconnexion: ' + error.message);
      console.error('Logout Error:', error);
    }
  };

  const showSignupForm = () => {
    console.log('Showing signup form');
    document.getElementById('content').innerHTML = renderSignupForm();
    const signupButton = document.getElementById('signup-button');
    const showLoginFormButton = document.getElementById('show-login-form-button');
    if (signupButton && showLoginFormButton) {
      signupButton.addEventListener('click', handleSignup);
      showLoginFormButton.addEventListener('click', showLoginForm);
    } else {
      console.log('Signup button or show login form button not found');
    }
  };

  const showLoginForm = () => {
    console.log('Showing login form');
    document.getElementById('content').innerHTML = renderLoginForm();
    const loginButton = document.getElementById('login-button');
    const signupFormButton = document.getElementById('show-signup-form-button');
    if (loginButton && signupFormButton) {
      loginButton.addEventListener('click', handleLogin);
      signupFormButton.addEventListener('click', showSignupForm);
    } else {
      console.log('Login button or signup form button not found');
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded');
    handleAuthStateChange();
  });

  return renderAccountPage(auth.currentUser);
};

export default Account;

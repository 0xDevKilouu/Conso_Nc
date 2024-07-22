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

  const attachEventListeners = () => {
    const user = auth.currentUser;
    if (user) {
      document.getElementById('logout-button').addEventListener('click', handleLogout);
    } else {
      document.getElementById('login-button').addEventListener('click', handleLogin);
      document.getElementById('show-signup-form-button').addEventListener('click', showSignupForm);
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
      alert(error.message);
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
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert('Déconnexion réussie');
      handleAuthStateChange();
    } catch (error) {
      alert(error.message);
    }
  };

  const showSignupForm = () => {
    document.getElementById('content').innerHTML = renderSignupForm();
    document.getElementById('signup-button').addEventListener('click', handleSignup);
    document.getElementById('show-login-form-button').addEventListener('click', showLoginForm);
  };

  const showLoginForm = () => {
    document.getElementById('content').innerHTML = renderLoginForm();
    document.getElementById('login-button').addEventListener('click', handleLogin);
    document.getElementById('show-signup-form-button').addEventListener('click', showSignupForm);
  };

  document.addEventListener('DOMContentLoaded', handleAuthStateChange);

  return renderAccountPage(auth.currentUser);
};

export default Account;

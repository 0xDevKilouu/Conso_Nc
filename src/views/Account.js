import { auth } from '../data/firebaseConfig';

const Account = () => {
  const user = auth.currentUser;
  const isLoggedIn = user !== null;

  const renderUserInfo = (user) => `
    <div id="user-info">
      <p>Bienvenue, ${user.email}</p>
      <button id="logout-button">Déconnexion</button>
    </div>
  `;

  const renderLoginForm = () => `
    <div id="login-form">
      <input type="email" id="email" placeholder="Email">
      <input type="password" id="password" placeholder="Mot de passe">
      <button id="login-button">Connexion</button>
      <button id="signup-button">Inscription</button>
    </div>
  `;

  const renderAccountPage = () => `
    <div id="account">
      <h2>Compte</h2>
      ${isLoggedIn ? renderUserInfo(user) : renderLoginForm()}
    </div>
  `;

  const handleAuthStateChange = () => {
    auth.onAuthStateChanged((user) => {
      document.getElementById('content').innerHTML = renderAccountPage();
      if (user) {
        document.getElementById('logout-button').addEventListener('click', handleLogout);
      } else {
        document.getElementById('login-button').addEventListener('click', handleLogin);
        document.getElementById('signup-button').addEventListener('click', handleSignup);
      }
    });
  };

  const handleLogin = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      await auth.signInWithEmailAndPassword(email, password);
      alert('Connexion réussie');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignup = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      alert('Inscription réussie');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert('Déconnexion réussie');
    } catch (error) {
      alert(error.message);
    }
  };

  document.addEventListener('DOMContentLoaded', handleAuthStateChange);

  return renderAccountPage();
};

export default Account;

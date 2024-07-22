import { auth, db } from '../data/firebaseConfig';

const Account = () => {
  // Event listener for the add promo button
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'add-promo-button') {
      document.getElementById('promo-form-wrapper').classList.toggle('hidden');
    }
  });

  // Check user authentication state
  auth.onAuthStateChanged(user => {
    const userInfo = document.getElementById('user-info');
    if (user) {
      userInfo.innerHTML = `
        <p>Bienvenue, ${user.email}</p>
        <button id="logout-button">Déconnexion</button>
      `;
      document.getElementById('login-form').style.display = 'none';
    } else {
      userInfo.innerHTML = '';
      document.getElementById('login-form').style.display = 'block';
    }
  });

  // Add event listeners for login and signup
  document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');

    loginButton.addEventListener('click', async () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        await auth.signInWithEmailAndPassword(email, password);
        alert('Connexion réussie');
      } catch (error) {
        alert(error.message);
      }
    });

    signupButton.addEventListener('click', async () => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert('Inscription réussie');
      } catch (error) {
        alert(error.message);
      }
    });
  });

  // Event listener for logout button
  document.addEventListener('click', event => {
    if (event.target && event.target.id === 'logout-button') {
      auth.signOut();
    }
  });

  return `
    <div id="account">
      <h2>Compte</h2>
      <div id="user-info"></div>
      <div id="login-form">
        <input type="email" id="email" placeholder="Email">
        <input type="password" id="password" placeholder="Mot de passe">
        <button id="login-button">Connexion</button>
        <button id="signup-button">Inscription</button>
      </div>
    </div>
  `;
};

export default Account;

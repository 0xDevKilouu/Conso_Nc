import { auth, db } from './data/firebaseConfig';

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

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('content').innerHTML = renderAccountPage();

    if (isLoggedIn) {
      document.getElementById('logout-button').addEventListener('click', () => {
        auth.signOut().then(() => {
          alert('Déconnexion réussie');
          document.getElementById('content').innerHTML = renderLoginForm();
        });
      });
    } else {
      const loginButton = document.getElementById('login-button');
      const signupButton = document.getElementById('signup-button');

      loginButton.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
          await auth.signInWithEmailAndPassword(email, password);
          alert('Connexion réussie');
          document.getElementById('content').innerHTML = renderUserInfo(auth.currentUser);
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
          document.getElementById('content').innerHTML = renderUserInfo(auth.currentUser);
        } catch (error) {
          alert(error.message);
        }
      });
    }
  });

  return renderAccountPage();
};

export default Account;

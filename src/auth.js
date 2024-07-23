import { auth, googleProvider } from '../src/firebaseConfig';

export const handleLogin = async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await auth.signInWithEmailAndPassword(email, password);
    alert('Connexion réussie');
  } catch (error) {
    console.error('Erreur de connexion:', error);
    alert('Erreur de connexion: ' + error.message);
  }
};

export const handleSignup = async () => {
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  if (password.length < 6) {
    alert('Le mot de passe doit contenir au moins 6 caractères.');
    return;
  }
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName: name });
    alert('Inscription réussie');
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    alert('Erreur d\'inscription: ' + error.message);
  }
};

export const handleGoogleLogin = async () => {
  try {
    await auth.signInWithPopup(googleProvider);
    alert('Connexion avec Google réussie');
  } catch (error) {
    console.error('Erreur de connexion avec Google:', error);
    alert('Erreur de connexion avec Google: ' + error.message);
  }
};

export const handleLogout = async () => {
  try {
    await auth.signOut();
    alert('Déconnexion réussie');
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    alert('Erreur de déconnexion: ' + error.message);
  }
};

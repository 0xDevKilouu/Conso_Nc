import { ui, uiConfig } from '../firebaseConfig';


// Fonction pour remplacer le texte de l'interface Firebase UI par du texte en français
const replaceFirebaseUIText = () => {
  const termsElement = document.querySelector('.firebaseui-card-footer');
  if (termsElement) {
    termsElement.innerHTML = `
      En continuant, vous indiquez que vous acceptez nos 
      <a href="<your-terms-of-service-url>" target="_blank">Conditions d'utilisation</a> 
      et notre 
      <a href="<your-privacy-policy-url>" target="_blank">Politique de confidentialité</a>.
    `;
  }

  document.querySelectorAll('.firebaseui-id-submit').forEach(button => {
    if (button.innerText.toLowerCase() === 'next') {
      button.innerText = 'Suivant';
    }
    if (button.innerText.toLowerCase() === 'cancel') {
      button.innerText = 'Annuler';
    }
    if (button.innerText.toLowerCase() === 'back') {
      button.innerText = 'Retour';
    }
  });

  document.querySelectorAll('.firebaseui-id-secondary-link').forEach(link => {
    if (link.innerText.toLowerCase().includes('trouble getting email')) {
      link.innerText = 'Problème pour recevoir l\'email ?';
    }
  });

  document.querySelectorAll('.firebaseui-id-page-sign-in').forEach(signInText => {
    if (signInText.innerText.toLowerCase().includes('sign-in email sent')) {
      signInText.innerText = 'Email de connexion envoyé';
    }
  });
};

export const startFirebaseUI = () => {
  ui.start('#firebaseui-auth-container', uiConfig);
  replaceFirebaseUIText(); // Remplace le texte par du français après le rendu de l'interface

  // Observer pour réappliquer les traductions après tout changement dans le DOM
  const observer = new MutationObserver(() => {
    replaceFirebaseUIText();
  });
  observer.observe(document.getElementById('firebaseui-auth-container'), {
    childList: true,
    subtree: true,
  });
};

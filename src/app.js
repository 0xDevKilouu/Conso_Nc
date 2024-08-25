import Navbar from './components/Navbar';
import Home from './views/Home';
import Scanner, { initializeScanner } from './views/Scanner';
import { Promo, attachPromoEvents } from './views/Promo';
import Compare from './views/Compare';
import handleAuthStateChange from './views/Account';
import { auth } from './firebaseConfig'; 

const routes = {
  home: Home,
  scanner: Scanner,
  promo: Promo,
  compare: Compare,
  account: handleAuthStateChange,
};

const loadView = async (view) => {
  console.log(`Loading view: ${view}`);
  const content = document.getElementById('content');

  // Ajout du header sur toutes les vues
  const header = `
    <header id="header">
      <h1>Conso Nc</h1>
    </header>
  `;
  content.innerHTML = header;

  if (routes[view]) {
    if (view === 'account') {
      handleAuthStateChange();
    } else {
      const viewContent = await routes[view]();
      content.innerHTML += viewContent;  // Ajouter la vue après le header
      if (view === 'scanner') {
        initializeScanner();
      }
      if (view === 'promo') {
        attachPromoEvents();
      }
      console.log('View content loaded:', viewContent);
    }
  } else {
    const viewContent = await Home();
    content.innerHTML += viewContent;
  }

  // Mise à jour de l'état actif de la barre de navigation
  updateNavbarState(view);
};

const updateNavbarState = (view) => {
  const listItems = document.querySelectorAll('.list');
  listItems.forEach(item => item.classList.remove('active'));

  const mapViewToButtonId = {
    'home': 'homeButton',
    'scanner': 'scanButton',
    'promo': 'promoButton',
    'account': 'accountButton'
  };

  const activeButton = document.getElementById(mapViewToButtonId[view]);
  if (activeButton) {
    activeButton.parentElement.classList.add('active');
  }
};

const setupNavbar = () => {
  document.getElementById('navbar').innerHTML = Navbar();

  document.getElementById('homeButton').addEventListener('click', () => {
    console.log('Home button clicked');
    loadView('home');
    window.location.hash = 'home';
  });
  document.getElementById('scanButton').addEventListener('click', () => {
    console.log('Scan button clicked');
    loadView('scanner');
    window.location.hash = 'scanner';
  });
  document.getElementById('promoButton').addEventListener('click', () => {
    console.log('Promo button clicked');
    loadView('promo');
    window.location.hash = 'promo';
  });
  document.getElementById('accountButton').addEventListener('click', () => {
    console.log('Account button clicked');
    loadView('account');
    window.location.hash = 'account';
  });

  // Activer l'état correct lors de l'initialisation
  const initialView = window.location.hash.substring(1) || 'home';
  updateNavbarState(initialView);
};

const checkAuthState = () => {
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log('User is logged in:', user);
    } else {
      console.log('User is not logged in');
    }
  });
};

const initApp = () => {
  setupNavbar();
  const hash = window.location.hash.substring(1);
  loadView(hash || 'home');  // Charge la vue actuelle ou 'home' par défaut
  checkAuthState();  // Vérifie l'état d'authentification, mais sans redirection
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  initApp();

  // Load Ionicons
  const script1 = document.createElement('script');
  script1.type = 'module';
  script1.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js';
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.noModule = true;
  script2.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js';
  document.head.appendChild(script2);
});

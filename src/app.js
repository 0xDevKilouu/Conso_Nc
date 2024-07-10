import Navbar from './components/Navbar';
import Home from './views/Home';
import Scanner, { initializeScanner } from './views/Scanner';
import Promo from './views/Promo';
import Compare from './views/Compare';
import Account from './views/Account';

// Routes configuration
const routes = {
  home: Home,
  scanner: Scanner,
  promo: Promo,
  compare: Compare,
  account: Account,
};

// Function to load a specific view
const loadView = (view) => {
  document.getElementById('content').innerHTML = routes[view]();
  if (view === 'scanner') {
    initializeScanner();
  }
};

// Function to setup the navbar
const setupNavbar = () => {
  document.getElementById('navbar').innerHTML = Navbar();

  // Add event listeners to navbar buttons
  document.getElementById('homeButton').addEventListener('click', () => loadView('home'));
  document.getElementById('scanButton').addEventListener('click', () => loadView('scanner'));
  document.getElementById('promoButton').addEventListener('click', () => loadView('promo'));
  document.getElementById('accountButton').addEventListener('click', () => loadView('account'));

  // Activate the correct navbar item
  const listItems = document.querySelectorAll('.list');
  function activateLink() {
    listItems.forEach(item => item.classList.remove('active'));
    this.classList.add('active');
  }
  listItems.forEach(item => item.addEventListener('click', activateLink));
};

// Initialize the app
const initApp = () => {
  setupNavbar();
  loadView('home'); // Load the home view initially
};

// Wait for the DOM to load before initializing the app
document.addEventListener('DOMContentLoaded', () => {
  // Load Ionicons
  const script1 = document.createElement('script');
  script1.type = 'module';
  script1.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js';
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.noModule = true;
  script2.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js';
  document.head.appendChild(script2);

  initApp();
});

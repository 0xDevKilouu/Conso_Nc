import Navbar from './components/Navbar';
import Home from './views/Home';
import Scanner, { initializeScanner } from './views/Scanner';
import Promo from './views/Promo';
import Compare from './views/Compare';
import Account from './views/Account';

const routes = {
  home: Home,
  scanner: Scanner,
  promo: Promo,
  compare: Compare,
  account: Account,
};

const loadView = (view) => {
  document.getElementById('content').innerHTML = routes[view]();
  if (view === 'scanner') {
    initializeScanner();
  }
};

const setupNavbar = () => {
  document.getElementById('navbar').innerHTML = Navbar();

  document.getElementById('homeButton').addEventListener('click', () => loadView('home'));
  document.getElementById('scanButton').addEventListener('click', () => loadView('scanner'));
  document.getElementById('promoButton').addEventListener('click', () => loadView('promo'));
  document.getElementById('accountButton').addEventListener('click', () => loadView('account'));
};

const initApp = () => {
  setupNavbar();
  loadView('home'); // Load the home view initially
};

document.addEventListener('DOMContentLoaded', initApp);

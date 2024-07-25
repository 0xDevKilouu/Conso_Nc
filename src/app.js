import Navbar from './components/Navbar';
import Home from './views/Home';
import Scanner, { initializeScanner } from './views/Scanner';
import Promo from './views/Promo';
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

const loadView = (view) => {
  console.log(`Loading view: ${view}`);
  const content = document.getElementById('content');

  if (routes[view]) {
    if (view === 'account') {
      handleAuthStateChange();
    } else {
      content.innerHTML = routes[view]();
      if (view === 'scanner') {
        initializeScanner();
      }
    }
  } else {
    content.innerHTML = Home();
  }
};

const setupNavbar = () => {
  document.getElementById('navbar').innerHTML = Navbar();

  document.getElementById('homeButton').addEventListener('click', () => {
    console.log('Home button clicked');
    loadView('home');
  });
  document.getElementById('scanButton').addEventListener('click', () => {
    console.log('Scan button clicked');
    loadView('scanner');
  });
  document.getElementById('promoButton').addEventListener('click', () => {
    console.log('Promo button clicked');
    loadView('promo');
  });
  document.getElementById('accountButton').addEventListener('click', () => {
    console.log('Account button clicked');
    loadView('account');
  });

  const listItems = document.querySelectorAll('.list');
  function activateLink() {
    listItems.forEach(item => item.classList.remove('active'));
    this.classList.add('active');
  }
  listItems.forEach(item => item.addEventListener('click', activateLink));
};

const initApp = () => {
  setupNavbar();
  const hash = window.location.hash.substring(1);
  loadView(hash || 'home');
};

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://conso-nc.vercel.app/secure-data')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Data received:', data);
      if (Array.isArray(data)) {
        console.log(data);
      } else {
        console.error('Received data is not an array:', data);
      }
    })
    .catch(error => console.error('Error:', error));

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

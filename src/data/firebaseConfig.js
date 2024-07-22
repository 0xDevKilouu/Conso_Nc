import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCenXl0HoRahcnsDZuHe_fw3dli97shei0",
  authDomain: "consonc-26043.firebaseapp.com",
  projectId: "consonc-26043",
  storageBucket: "consonc-26043.appspot.com",
  messagingSenderId: "347349604983",
  appId: "1:347349604983:web:8300836901a9bf62768472",
  measurementId: "G-BY69W74409"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

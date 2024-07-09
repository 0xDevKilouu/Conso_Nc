# -foodtest3

## CodeSpace : mettre a jour les modif : 'git push origin main --force' ##


Exempel de code pour la connexion Gooogle : 
"Configurer l'authentification avec Google :

Utilisez Firebase Authentication pour ajouter facilement l'authentification Google à votre application.
Créez un projet Firebase et configurez l'authentification Google.
Intégrer Firebase Authentication dans votre application :

# Installez les dépendances Firebase.
# Configurez Firebase dans votre application.
# Ajoutez des boutons de connexion et de déconnexion Google.
# Sauvegarder les données utilisateur :

# Utilisez Firebase Firestore pour sauvegarder les données des utilisateurs, telles que les favoris, les comparaisons et l'historique de recherche.
Étape 1 : Configurer Firebase
Créer un projet Firebase :

Rendez-vous sur Firebase Console et créez un nouveau projet.
Activez Firebase Authentication et ajoutez le fournisseur Google.
Installer Firebase :

# Ajoutez Firebase à votre projet en utilisant npm :
'npm install firebase'

# Étape 2 : Intégrer Firebase dans votre application
# Configurer Firebase :
# Créez un fichier firebaseConfig.js et ajoutez-y la configuration Firebase de votre projet :

'
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithPopup, signOut, db };
'

# Ajouter des boutons de connexion et de déconnexion :
# Dans votre fichier principal (par exemple, App.js), ajoutez les boutons de connexion et de déconnexion Google :

'
import { auth, provider, signInWithPopup, signOut } from './firebaseConfig';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Bienvenue, {user.displayName}</p>
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Connexion avec Google</button>
      )}
    </div>
  );
}

export default App;
'
# Étape 3 : Sauvegarder les données utilisateur
# Configurer Firestore :
# Ajoutez des fonctions pour sauvegarder et récupérer les données des utilisateurs dans Firestore :

' import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const saveFavorite = async (userId, product) => {
  try {
    await addDoc(collection(db, "favorites"), {
      userId,
      product,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const getFavorites = async (userId) => {
  const q = query(collection(db, "favorites"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
};

export { saveFavorite, getFavorites };
'

# Modifiez votre composant pour appeler saveFavorite et getFavorites selon les actions de l'utilisateur :

'import { saveFavorite, getFavorites } from './firebaseConfig';

function App() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        loadFavorites(result.user.uid);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setFavorites([]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loadFavorites = async (userId) => {
    const favs = await getFavorites(userId);
    setFavorites(favs);
  };

  const handleAddFavorite = async (product) => {
    if (user) {
      await saveFavorite(user.uid, product);
      loadFavorites(user.uid);
    } else {
      alert("Veuillez vous connecter pour ajouter aux favoris");
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Bienvenue, {user.displayName}</p>
          <button onClick={handleLogout}>Déconnexion</button>
          <div>
            <h2>Favoris</h2>
            <ul>
              {favorites.map((fav, index) => (
                <li key={index}>{fav.product.product_name}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <button onClick={handleLogin}>Connexion avec Google</button>
      )}
      {/* Remplacer cette partie avec le produit scanné */}
      <button onClick={() => handleAddFavorite(scannedProduct)}>Ajouter aux favoris</button>
    </div>
  );
}

export default App;
'

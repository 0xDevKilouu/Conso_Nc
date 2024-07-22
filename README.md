# -Conso NC
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Procédure / Logiques / Dépendances / HELP 

# Fichiers :
  - app.js => fichier .main
  - Scanner.js => Fonctions du Scanner
  - Promo.js => Fonctions des Promo
  - Home.js => Page d'acceuil 
  - Account.js => Fonctions et page Compte
  - Navbar.js => Fonctions et affichage NavigationBar
  - index.html =>
  - styles.css => Logique et affichage du l'Apps
  - manifest.json => Information + Identitée de l'Apps

# Scanner + Informations produits : 
  - Récupération information produit via la requête API (`https://world.openfoodfacts.org/api/v0/product/ '${barcode}.json' `)
  - '${barcode}.json' Ce fera remplacer automatiquement par le code EAN 13 du produit scanné 
  - Récupération du grade nutriscore en image avec lettrage "A,B,C,D,E" et couleur
  - Image du produit 
  - Marques
  - Nutriments
  - Nom du produit
  - Quantitées 
  - Ingrédients
  - Alergénes
  
  Récupérations de la nutritions :
      - Énergie en kcal
      - Graisses
      - Graisses saturées
      - Glucides
      - Sucres
      - Fibres
      - Protéines
      - Sel


# To do --> 
  - Logique de compte "Account" --> Google connexion, or user simple 
  - Mettre en place la BDD et logique de compte
  - Mettre en place "Ma liste" création liste de course
  - Création et mise en place du BACKEND ADMIN, pour toutes demandes de "PUBLICITE"
  - Mise en place du tunel de vente "ePaync" 
  - Voir pour API V2 et V3, (V3 en develloppement)


  - Voir l'UI / UX 
  



  // Votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCenXl0HoRahcnsDZuHe_fw3dli97shei0",
  authDomain: "consonc-26043.firebaseapp.com",
  projectId: "consonc-26043",
  storageBucket: "consonc-26043.appspot.com",
  messagingSenderId: "347349604983",
  appId: "1:347349604983:web:8300836901a9bf62768472",
  measurementId: "G-BY69W74409"
};
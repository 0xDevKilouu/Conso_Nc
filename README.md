# -Conso NC
---------------------------------------------------------------------------------------------------------------------------------------------

# Procédure / Logiques / Dépendances / HELP 

Fichiers :
  - app.js => fichier .main
  - Scanner.js => Fonctions du Scanner
  - Promo.js => Fonctions des Promo
  - Home.js => Page d'acceuil 
  - Account.js => Fonctions et page Compte
  - Navbar.js => Fonctions et affichage NavigationBar
  - index.html =>
  - styles.css => Logique et affichage du l'Apps
  - manifest.json => Information + Identitée de l'Apps


Scanner + Informations produits : 
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


  
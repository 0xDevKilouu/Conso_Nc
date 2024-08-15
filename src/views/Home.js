const Home = () => {
  return `
    <div id="home">
      <!-- En-tête fixe -->
      <header id="header">
        <h1>Conso Nc</h1>
      </header>

      <!-- Section : Informations sur l'application -->
      <div class="center-content">
        <div class="card">
          <h2>À propos de Conso Nc</h2>
          <p>Conso Nc est votre assistant personnel pour mieux comprendre ce que vous consommez. Scannez vos produits alimentaires pour obtenir des informations détaillées sur leur Nutri-Score, valeurs nutritionnelles, et bien plus encore.</p>
        </div>

        <!-- Section : Schéma de fonctionnement -->
        <div class="card">
          <h2>Comment ça fonctionne ?</h2>
          <p>Découvrez comment utiliser Conso Nc en trois étapes simples :</p>
          <div class="workflow">
            <div class="step">
              <img src="https://via.placeholder.com/100" alt="Étape 1">
              <h3>1. Scannez le produit</h3>
              <p>Utilisez l'appareil photo pour scanner le code-barres de votre produit.</p>
            </div>
            <div class="step">
              <img src="https://via.placeholder.com/100" alt="Étape 2">
              <h3>2. Analysez les informations</h3>
              <p>Consultez les informations nutritionnelles, le Nutri-Score, et les ingrédients.</p>
            </div>
            <div class="step">
              <img src="https://via.placeholder.com/100" alt="Étape 3">
              <h3>3. Prenez des décisions éclairées</h3>
              <p>Choisissez les produits qui correspondent à vos objectifs de santé.</p>
            </div>
          </div>
        </div>

        <!-- Section : Recommandations -->
        <div class="card">
          <h2>Nos recommandations</h2>
          <p>Basé sur vos précédents scans, voici quelques recommandations pour une alimentation plus saine :</p>
          <ul class="recommendation-list">
            <li>Essayez de réduire la consommation de produits avec un Nutri-Score D ou E.</li>
            <li>Favorisez les produits riches en fibres et faibles en sucres ajoutés.</li>
            <li>Consultez les étiquettes pour éviter les additifs artificiels.</li>
          </ul>
        </div>
      </div>
    </div>
  `;
};

export default Home;

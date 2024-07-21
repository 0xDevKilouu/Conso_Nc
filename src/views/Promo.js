const Promo = () => {
  const isLoggedIn = checkUserLoggedIn();
  const promoItems = getPromoItems();

  const renderPromoForm = () => `
    <div class="promo-form-container">
      <h3>Ajouter une promotion</h3>
      <form id="promo-form">
        <input type="text" id="product-name" name="product-name" placeholder="Nom du produit" required>
        <textarea id="promo-details" name="promo-details" placeholder="Détails de la promotion" required></textarea>
        <input type="file" id="product-image" name="product-image" accept="image/*" required>
        <input type="file" id="company-logo" name="company-logo" accept="image/*" required>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  `;

  return `
    <div id="promo">
      <h2>Promo</h2>
      <p>Liste de toutes les promotions à venir.</p>
      ${isLoggedIn ? `<button id="add-promo-button">Ajouter une promo</button>` : `<p>Connectez-vous pour ajouter des promotions.</p>`}
      <ul class="promo-list">
        ${promoItems.map(item => `
          <li class="promo-item">
            <img src="${item.image}" alt="${item.name}" class="promo-product-image">
            <div class="promo-details">
              <h3>${item.name}</h3>
              <p>${item.details}</p>
              <img src="${item.companyLogo}" alt="Logo de la société" class="company-logo">
            </div>
          </li>
        `).join('')}
      </ul>
      <div id="promo-form-wrapper" class="hidden">
        ${renderPromoForm()}
      </div>
    </div>
  `;
};

// Example functions for demonstration
const checkUserLoggedIn = () => {
  return true; // Implement your logic to check if user is logged in
};

const getPromoItems = () => {
  return [
    { name: 'Produit A', details: '50% de réduction', image: 'path/to/imageA.jpg', companyLogo: 'path/to/logoA.png' },
    { name: 'Produit B', details: 'Achetez-en 1, obtenez-en 1 gratuit', image: 'path/to/imageB.jpg', companyLogo: 'path/to/logoB.png' }
  ]; // Fetch promo items from your backend or database
};

// Event listener for the add promo button
document.addEventListener('click', function(event) {
  if (event.target && event.target.id === 'add-promo-button') {
    document.getElementById('promo-form-wrapper').classList.toggle('hidden');
  }
});

export default Promo;

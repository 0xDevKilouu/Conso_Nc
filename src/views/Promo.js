//* Logique pour les PROMO + page PROMO *//

const Promo = () => {
  // Assuming we have a function to check if a user is logged in and a function to fetch promo items
  const isLoggedIn = checkUserLoggedIn(); 
  const promoItems = getPromoItems(); 

  return `
    <div id="promo">
      <h2>Promo</h2>
      <p>Liste de toutes les promotions à venir.</p>
      ${isLoggedIn ? `
      <div class="add-promo">
        <h3>Ajouter une promotion</h3>
        <form id="promo-form">
          <input type="text" id="product-name" name="product-name" placeholder="Nom du produit" required>
          <input type="text" id="promo-details" name="promo-details" placeholder="Détails de la promotion" required>
          <button type="submit">Ajouter</button>
        </form>
      </div>` : `<p>Connectez-vous pour ajouter des promotions.</p>`}
      <ul class="promo-list">
        ${promoItems.map(item => `
          <li class="promo-item">
            <h3>${item.name}</h3>
            <p>${item.details}</p>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
};

// Example functions for demonstration
const checkUserLoggedIn = () => {
  // Implement your logic to check if user is logged in
  return true;
};

const getPromoItems = () => {
  // Fetch promo items from your backend or database
  return [
    { name: 'Produit A', details: '50% de réduction' },
    { name: 'Produit B', details: 'Achetez-en 1, obtenez-en 1 gratuit' }
  ];
};

export default Promo;

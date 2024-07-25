import { auth, firestore, storage } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

const checkUserLoggedIn = () => {
  return auth.currentUser != null; // Utilise Firebase auth pour vérifier si l'utilisateur est connecté
};

const getPromoItems = () => {
  return [
    { name: 'Produit A', details: '50% de réduction', image: 'path/to/imageA.jpg', companyLogo: 'path/to/logoA.png' },
    { name: 'Produit B', details: 'Achetez-en 1, obtenez-en 1 gratuit', image: 'path/to/imageB.jpg', companyLogo: 'path/to/logoB.png' }
  ]; // Récupère les éléments de promotion de ton backend ou base de données
};

document.addEventListener('click', function(event) {
  if (event.target && event.target.id === 'add-promo-button') {
    document.getElementById('promo-form-wrapper').classList.toggle('hidden');
  }
});

document.addEventListener('submit', async function(event) {
  if (event.target && event.target.id === 'promo-form') {
    event.preventDefault();
    const form = event.target;
    const productName = form['product-name'].value;
    const promoDetails = form['promo-details'].value;
    const productImage = form['product-image'].files[0];
    const companyLogo = form['company-logo'].files[0];

    if (!productName || !promoDetails || !productImage || !companyLogo) {
      alert('Tous les champs sont obligatoires.');
      return;
    }

    try {
      const productImageRef = ref(storage, `product-images/${productImage.name}`);
      const companyLogoRef = ref(storage, `company-logos/${companyLogo.name}`);

      const productImageSnapshot = await uploadBytes(productImageRef, productImage);
      const companyLogoSnapshot = await uploadBytes(companyLogoRef, companyLogo);

      const productImageUrl = await getDownloadURL(productImageSnapshot.ref);
      const companyLogoUrl = await getDownloadURL(companyLogoSnapshot.ref);

      await addDoc(collection(firestore, 'promotions'), {
        name: productName,
        details: promoDetails,
        image: productImageUrl,
        companyLogo: companyLogoUrl,
        createdBy: auth.currentUser.uid,
        createdAt: new Date(),
      });

      alert('Promotion ajoutée avec succès!');
      form.reset();
      document.getElementById('promo-form-wrapper').classList.add('hidden');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la promotion:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }
});

export default Promo;

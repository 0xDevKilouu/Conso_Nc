import { auth, firestore, storage } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Promo = async () => {
  const promoItems = await getPromoItems();

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
      ${auth.currentUser ? `<button id="add-promo-button" class="btn btn-primary">Ajouter une promo</button>` : `<p>Connectez-vous pour ajouter des promotions.</p>`}
      ${promoItems.length > 0 ? `
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
      ` : `<p>Aucune promotion disponible pour le moment. Soyez le premier à ajouter une promotion !</p>`}
      <div id="promo-form-wrapper" class="hidden">
        ${renderPromoForm()}
      </div>
    </div>
  `;
};

const getPromoItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'promotions'));
    const promos = [];
    querySnapshot.forEach((doc) => {
      promos.push({ id: doc.id, ...doc.data() });
    });
    return promos;
  } catch (error) {
    console.error('Erreur lors de la récupération des promotions:', error);
    return [];
  }
};

// Ajout de la vérification de l'état de connexion
const checkAuthState = () => {
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log('User is logged in:', user);
      const addPromoButton = document.getElementById('add-promo-button');
      const promoFormWrapper = document.getElementById('promo-form-wrapper');
      if (addPromoButton && promoFormWrapper) {
        addPromoButton.style.display = 'block';
        promoFormWrapper.classList.add('hidden');
      }
    } else {
      console.log('User is not logged in');
      const addPromoButton = document.getElementById('add-promo-button');
      if (addPromoButton) {
        addPromoButton.style.display = 'none';
      }
    }
  });
};

document.addEventListener('click', function(event) {
  if (event.target && event.target.id === 'add-promo-button') {
    console.log('Add promo button clicked');
    const promoFormWrapper = document.getElementById('promo-form-wrapper');
    console.log('Promo form wrapper element:', promoFormWrapper);
    if (promoFormWrapper) {
      console.log('Current class list before toggle:', promoFormWrapper.classList);
      promoFormWrapper.classList.toggle('hidden');
      console.log('Current class list after toggle:', promoFormWrapper.classList);
      // Forcing reflow to ensure the toggle effect works properly
      promoFormWrapper.offsetHeight;
    } else {
      console.error('Promo form wrapper not found');
    }
  }
});

document.addEventListener('submit', async function(event) {
  if (event.target && event.target.id === 'promo-form') {
    event.preventDefault();
    console.log('Promo form submitted');
    const form = event.target;
    const productName = form['product-name'].value;
    const promoDetails = form['promo-details'].value;
    const productImage = form['product-image'].files[0];
    const companyLogo = form['company-logo'].files[0];

    console.log('Form values:', { productName, promoDetails, productImage, companyLogo });

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

      console.log('Image URLs:', { productImageUrl, companyLogoUrl });

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

import { auth, firestore, storage } from '../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

const createFormToken = async (amount, orderId, email) => {
  const response = await fetch('https://epaync.nc/api-payment/V4/Charge/CreatePayment', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa('52213364:testpassword_NUfojbKEuSRUXgt4vVlWVAmJ28dO2X4TtZrVM0U0sJN2G'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amount,
      currency: 'XPF',
      orderId: orderId,
      customer: { email: email }
    })
  });

  const data = await response.json();
  return data.answer.formToken;
};

const renderPromoForm = () => `
  <div class="promo-form-container hidden">
    <h3>Ajouter une promotion</h3>
    <form id="promo-form">
      <input type="text" id="product-name" name="product-name" placeholder="Nom du produit" required>
      <textarea id="promo-details" name="promo-details" placeholder="Détails de la promotion" required></textarea>
      <input type="file" id="product-image" name="product-image" accept="image/*" required>
      <input type="file" id="company-logo" name="company-logo" accept="image/*" required>
      <input type="text" id="promo-expiry" name="promo-expiry" placeholder="Date d'expiration" required>
      <input type="text" id="promo-location" name="promo-location" placeholder="Localisation (ex: Kenu-in DUMBEA Mall)" required>
      <input type="text" id="promo-contact" name="promo-contact" placeholder="Contact du promoteur" required>
      <button type="submit">Ajouter</button>
    </form>
    <div id="payment-form-container"></div>
  </div>
`;

const Promo = async () => {
  const promoItems = await getPromoItems();
  const promoItemsHTML = promoItems.length > 0 ? `
    <ul class="promo-list">
      ${promoItems.map(item => `
        <li class="promo-item">
          <div class="promo-item-content">
            <img src="${item.image}" alt="${item.name}" class="promo-product-image">
            <div class="promo-details">
              <h3>${item.name}</h3>
              <p>${item.details}</p>
              <div class="promo-info">
                <img src="${item.companyLogo}" alt="Logo de la société" class="company-logo">
                <div class="promo-location">${item.location}</div>
                <div class="promo-expiry">${item.expiry}</div>
              </div>
            </div>
            <div class="promo-price">${item.contact}</div>
          </div>
        </li>
      `).join('')}
    </ul>
  ` : `<p>Aucune promotion disponible pour le moment. Soyez le premier à ajouter une promotion !</p>`;

  return `
    <div id="promo">
      <h2>Promotions</h2>
      <p>Vous retrouverez la liste de nos promotions actuels</p>
      ${auth.currentUser ? `<button id="add-promo-button" class="btn btn-primary">Ajouter une promo</button>` : `<p>Connectez-vous pour ajouter des promotions.</p>`}
      ${promoItemsHTML}
      <div id="promo-form-wrapper" class="hidden">
        ${renderPromoForm()}
      </div>
    </div>
  `;
};

const attachPromoEvents = () => {
  if (auth.currentUser) {
    const addPromoButton = document.getElementById('add-promo-button');
    const promoFormWrapper = document.getElementById('promo-form-wrapper');
    if (addPromoButton && promoFormWrapper) {
      addPromoButton.addEventListener('click', () => {
        promoFormWrapper.classList.toggle('hidden');
      });
    }

    document.getElementById('promo-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.target;
      const productName = form['product-name'].value;
      const promoDetails = form['promo-details'].value;
      const productImage = form['product-image'].files[0];
      const companyLogo = form['company-logo'].files[0];
      const promoExpiry = form['promo-expiry'].value;
      const promoLocation = form['promo-location'].value;
      const promoContact = form['promo-contact'].value;

      if (!productName || !promoDetails || !productImage || !companyLogo || !promoExpiry || !promoLocation || !promoContact) {
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

        const formToken = await createFormToken(1000, 'promoOrder-' + new Date().getTime(), 'sample@example.com');

        document.getElementById('payment-form-container').innerHTML = `
          <div class="kr-embedded" kr-form-token="${formToken}"></div>
        `;

        sessionStorage.setItem('promoData', JSON.stringify({
          name: productName,
          details: promoDetails,
          image: productImageUrl,
          companyLogo: companyLogoUrl,
          expiry: promoExpiry,
          location: promoLocation,
          contact: promoContact,
          createdBy: auth.currentUser.uid,
          createdAt: new Date()
        }));
      } catch (error) {
        console.error('Erreur lors de la création du formToken ou de l\'upload des images:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    });
  }
};

const finalizePromotion = async () => {
  const promoData = JSON.parse(sessionStorage.getItem('promoData'));
  if (promoData) {
    try {
      await addDoc(collection(firestore, 'promotions'), promoData);
      alert('Promotion ajoutée avec succès!');
      sessionStorage.removeItem('promoData');
      document.getElementById('promo-form').reset();
      document.getElementById('payment-form-container').innerHTML = '';
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la promotion:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }
};

window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('payment') === 'success') {
    finalizePromotion();
  }
  attachPromoEvents(); // Assurez-vous que les événements sont attachés lors du chargement
});

export { Promo, attachPromoEvents };

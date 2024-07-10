import { BrowserBarcodeReader, NotFoundException } from '@zxing/library';
import axios from 'axios';

let codeReader = null;
let scanning = false;
let videoElement = null;
let scannerFrame = null;

const Scanner = () => {
  return `
    <div id="scanner">
      <div id="scannerFrame">
        <!-- Coins du cadre du scanner -->
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
        <!-- Animation de la ligne de balayage -->
        <div class="scan-line"></div>
        <!-- Conteneur de la vidéo -->
        <div id="video-container">
          <video id="video" autoplay playsinline></video>
        </div>
      </div>
      <!-- Contenu des informations du produit -->
      <div id="content"></div>
    </div>
  `;
};

export const initializeScanner = () => {
  videoElement = document.getElementById('video');
  scannerFrame = document.getElementById('scannerFrame');
  videoElement.style.display = 'none';
  scannerFrame.style.display = 'none';

  requestCameraAccess().then(() => {
    startScanning();
  }).catch((error) => {
    console.error('Error accessing camera:', error);
    alert('Erreur d\'accès à la caméra : ' + error.message);
  });
};

function requestCameraAccess() {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function startScanning() {
  scanning = true;
  showScannerUI();

  if (!codeReader) {
    codeReader = new BrowserBarcodeReader();
  }

  codeReader.decodeFromVideoDevice(undefined, videoElement, (result, err) => {
    if (result) {
      console.log(result);
      stopScanning(false);  // Don't stop video stream
      fetchProductInfo(result.text);
    }
    if (err && !(err instanceof NotFoundException)) {
      console.error(err);
      stopScanning(false);  // Don't stop video stream
    }
  });
}

function stopScanning(stopStream = true) {
  scanning = false;
  if (codeReader) {
    codeReader.reset();
  }
  hideScannerUI();

  if (stopStream && videoElement.srcObject) {
    let stream = videoElement.srcObject;
    let tracks = stream.getTracks();

    tracks.forEach(function(track) {
      track.stop();
    });

    videoElement.srcObject = null;
  }
}

function showScannerUI() {
  videoElement.style.display = 'block';
  scannerFrame.style.display = 'block';
}

function hideScannerUI() {
  videoElement.style.display = 'none';
  scannerFrame.style.display = 'none';
}

function resetUI() {
  const content = document.getElementById('content');
  content.innerHTML = '';
  showScannerUI();
}

function fetchProductInfo(barcode) {
  axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    .then(response => {
      console.log(response.data);
      if (response.data.status === 1) {
        displayProductInfo(response.data.product);
      } else {
        displayErrorMessage('Produit non trouvé.');
      }
    })
    .catch(error => {
      console.error('Error fetching product data:', error);
      displayErrorMessage('Erreur lors de la récupération des données du produit. Veuillez vérifier votre connexion Internet ou réessayer plus tard.');
    });
}

function displayProductInfo(product) {
  const content = document.getElementById('content');
  const nutriScoreHTML = getNutriScoreHTML(product.nutrition_grade_fr);
  const labelsHTML = getLabelsHTML(product.labels_old);
  const nutritionFactsHTML = getNutritionFactsHTML(product.nutriments);

  content.innerHTML = `
    <div class="card">
      ${product.image_url ? `<img src="${product.image_url}" alt="Product Image">` : ''}
      <h2 class="bubble-title">${product.product_name}</h2>
      <p><strong>Marque:</strong> ${product.brands}</p>
      <p><strong>Quantité:</strong> ${product.quantity}</p>
      <p><strong>Ingrédients:</strong> ${product.ingredients_text || 'Non spécifié'}</p>
      <p><strong>Allergènes:</strong> ${product.allergens || 'Non spécifié'}</p>
      ${nutriScoreHTML}
      ${labelsHTML}
      ${nutritionFactsHTML}
    </div>
  `;
}

function getNutriScoreHTML(nutrition_grade_fr) {
  if (!nutrition_grade_fr) {
    return `<p>Le Nutri-Score de ce produit n'est pas encore disponible.</p>`;
  }

  const nutriScoreImages = {
    'a': 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-a-new-fr.svg',
    'b': 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-b-new-fr.svg',
    'c': 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-c-new-fr.svg',
    'd': 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-d-new-fr.svg',
    'e': 'https://static.openfoodfacts.org/images/attributes/dist/nutriscore-e-new-fr.svg'
  };

  const nutriScoreImageUrl = nutriScoreImages[nutrition_grade_fr.toLowerCase()] || 'https://static.openfoodfacts.org/images/attributes/dist/unknown.svg';

  return `
    <div class="nutriscore">
      <p><strong>Nutri-Score:</strong></p>
      <img src="${nutriScoreImageUrl}" alt="Nutri-Score Plate">
    </div>
  `;
}

function getLabelsHTML(labels_old) {
  if (!labels_old || !Array.isArray(labels_old)) {
    return '';
  }

  return `
    <div class="labels">
      <p><strong>Labels:</strong></p>
      <ul>
        ${labels_old.map(tag => `<li>${tag}</li>`).join('')}
      </ul>
    </div>
  `;
}

function getNutritionFactsHTML(nutriments) {
  if (!nutriments) {
    return '';
  }

  return `
    <div class="nutrition-facts">
      <p><strong>Nutrition:</strong></p>
      <ul>
        <li><strong>Énergie:</strong> ${nutriments['energy-kcal']} kcal</li>
        <li><strong>Graisses:</strong> ${nutriments['fat']} g</li>
        <li><strong>Graisses saturées:</strong> ${nutriments['saturated-fat']} g</li>
        <li><strong>Glucides:</strong> ${nutriments['carbohydrates']} g</li>
        <li><strong>Sucres:</strong> ${nutriments['sugars']} g</li>
        <li><strong>Fibres:</strong> ${nutriments['fiber']} g</li>
        <li><strong>Protéines:</strong> ${nutriments['proteins']} g</li>
        <li><strong>Sel:</strong> ${nutriments['salt']} g</li>
      </ul>
    </div>
  `;
}

function displayErrorMessage(message) {
  const content = document.getElementById('content');
  content.innerHTML = `<p class="error">${message}</p>`;
}

export default Scanner;

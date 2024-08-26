//*Navbar.js *//

const Navbar = () => {
  return `
    <div class="navigation">
      <ul class="listWrap">
        <li class="list active">
          <a href="javascript:void(0);" id="homeButton">
            <i class="icon">
              <ion-icon name="home-outline"></ion-icon>
            </i>
            <span class="text">Accueil</span>
          </a>
        </li>
        <li class="list">
          <a href="javascript:void(0);" id="scanButton">
            <i class="icon">
              <ion-icon name="barcode-outline"></ion-icon>
            </i>
            <span class="text">Scanner</span>
          </a>
        </li>
        <li class="list">
          <a href="javascript:void(0);" id="promoButton">
            <i class="icon">
              <ion-icon name="star-outline"></ion-icon>
            </i>
            <span class="text">Promo</span>
          </a>
        </li>
        <li class="list">
          <a href="javascript:void(0);" id="accountButton">
            <i class="icon">
              <ion-icon name="person-outline"></ion-icon>
              <!-- Indicateur de statut sera ajouté ici dynamiquement -->
            </i>
            <span class="text">Compte</span>
          </a>
        </li>
        <li class="indicator"></li>
      </ul>
    </div>
  `;
};

export default Navbar;

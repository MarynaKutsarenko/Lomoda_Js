const headerCityButton = document.querySelector('.header__city-button');
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';

headerCityButton.addEventListener('click', () => {
   const city = prompt("Какой у Вачс город ?", "Харьков");

   headerCityButton.textContent = city;
   localStorage.setItem('lomoda-location', city);
});
//scroll blocked 
const disableScroll = () => {
   const widthScroll = window.innerWidth - document.body.offsetWidth;
   document.body.dbScrollY = window.scrollY;

   document.body.style.cssText = `
      position: fixed;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      padding-right: ${widthScroll}px;
      top: ${-document.body.dbScrollY}px;
      left: 0;
   `
};

const enableScroll = () => {
   document.body.style.cssText = '';
   window.scroll({
      top: document.body.dbScrollY
   })
}

//dialog 
const cartModalOpen = () => {
   cartOverlay.classList.add('cart-overlay-open');
   disableScroll();
};

const cartModalClose = () => {
   cartOverlay.classList.remove('cart-overlay-open');
   enableScroll();
};

subheaderCart.addEventListener('click',  cartModalOpen);

cartOverlay.addEventListener('click', event => {
   const target = event.target;

   if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
      cartModalClose();
   }
});


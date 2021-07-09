const headerCityButton = document.querySelector('.header__city-button');
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');
let hash = location.hash.substring(1);

//getInfo from localStorage 
headerCityButton.textContent = localStorage.getItem('lomoda-location') || headerCityButton.textContent;

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
//
//dialog 
const cartModalOpen = () => {
   cartOverlay.classList.add('cart-overlay-open');
   disableScroll();
};

const cartModalClose = () => {
   cartOverlay.classList.remove('cart-overlay-open');
   enableScroll();
};
//
// request to db
const getData = async () => {
   const data = await fetch('db.json');

   if (data.ok) {
      return data.json();
   } else {
      throw new Error(`Произошла ошибка ${data.status} ${data.statusText}`);
   }
}

const getGoods = (callback, value) => {
   getData()
      .then((data) => {
         if (value) {
            callback(data.filter(item => item.category === value));
         } else {
            callback(data);
         }
      })
      .catch((err) => {
         console.log(err);
      })
}


subheaderCart.addEventListener('click', cartModalOpen);
cartOverlay.addEventListener('click', event => {
   const target = event.target;

   if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
      cartModalClose();
   }
});

//setInfo to localStorage 
headerCityButton.addEventListener('click', () => {
   const city = prompt("Какой у Вас город ?", "Харьков");

   headerCityButton.textContent = city;
   localStorage.setItem('lomoda-location', city);
});

try {
   const goodsLists = document.querySelector('.goods__list');

   if (!goodsLists) {
      throw ('This is not a goods page');
   }

   const createCard = ({id, name, preview, cost, brand, sizes}) => {
      const li = document.createElement('li');
      li.classList.add('goods__item');

      li.innerHTML = `
         <article class="good">
            <a class="good__link-img" href="card-good.html#${id}">
               <img class="good__img" src="goods-image/${preview}" alt="">
            </a>
            <div class="good__description">
               <p class="good__price">${cost} &#8381;</p>
               <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name} </span></h3>
               ${sizes ? `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` : ''}
               <a class="good__link" href="card-good.html#${id}">Подробнее</a>
            </div>
         </article>
      `;

      return li;
   };

   const renderGoodsList = data => {
      goodsLists.innerHTML = '';

      data.forEach((item) => {
         const card = createCard(item);
         goodsLists.append(card);
      })

   };

   window.addEventListener('hashchange', () => {
      hash = hash.location.substring(1);
      getGoods(renderGoodsList, hash);
   })

   getGoods(renderGoodsList, hash);

} catch (error) {
   console.log(error);
}
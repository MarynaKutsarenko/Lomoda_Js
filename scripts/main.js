const headerCityButton = document.querySelector('.header__city-button');
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartListGoods = document.querySelector('.cart__list-goods');
const cartTotalCost = document.querySelector('.cart__total-cost');

let hash = location.hash.substring(1);

//getInfo from localStorage 
headerCityButton.textContent = localStorage.getItem('lomoda-location') || headerCityButton.textContent;

const getLocalStorage = () => JSON?.parse(localStorage.getItem('card-lomoda')) || [];
const setLocalStorage = data => localStorage.setItem('card-lomoda', JSON.stringify(data));

const renderCart = () => {
   cartListGoods.textContent = '';

   const cartItems = getLocalStorage();
   let totalPrice = 0;

   cartItems.forEach((item, index) => {
      
      const tr = document.createElement('tr');

      tr.innerHTML = `
         <td>${index + 1}</td>
         <td>${item.brand} ${item.name}</td>
         ${item.color ? `<td>${item.color}</td>` : '<td>-</td>'}
         ${item.size ? `<td>${item.size}</td>` : '<td>-</td>'}
         <td>${item.cost} &#8381;</td>
         <td><button class="btn-delete" data-id="${item.id}">&times;</button></td>
      `;

      totalPrice += item.cost;

      cartListGoods.append(tr);
   });

   cartTotalCost.textContent = totalPrice + '₽';

};

//delete item
const deleteItemCart = id => {
   const cartItems = getLocalStorage();
   const newCartItems = cartItems.filter(item => item.id !== id);
   setLocalStorage(newCartItems);
}

cartListGoods.addEventListener('click', (e) => {
   if (e.target.matches('.btn-delete')) {
      deleteItemCart(e.target.dataset.id);
      renderCart();
   }
})
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
   renderCart();
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

const getGoods = (callback, prop, value) => {
   getData()
      .then((data) => {
         if (value) {
            callback(data.filter(item => item[prop] === value));
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
   const city = prompt("Какой у Вас город ?");

   headerCityButton.textContent = city;
   localStorage.setItem('lomoda-location', city);
});

//categories page 
try {
   const goodsLists = document.querySelector('.goods__list');

   if (!goodsLists) {
      throw ('This is not a categories page');
   }

   const goodsTitle = document.querySelector('.goods__title');

   const changeTitle = () => {
      goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;
   };

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
               ${ sizes ? `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${ sizes.join(' ')}</span></p>` : '' }
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
      hash = location.hash.substring(1);
      getGoods(renderGoodsList, 'category', hash);
      changeTitle();
   })

   changeTitle();
   getGoods(renderGoodsList, 'category', hash);

} catch (error) {
   console.log(error);
}

//goods page
try {

   if (!document.querySelector('.card-good')) {
      throw ('This is not a goods page!')
   }

   const cardGoodImage = document.querySelector('.card-good__image');
   const cardGoodBrand = document.querySelector('.card-good__brand');
   const cardGoodTitle = document.querySelector('.card-good__title');
   const cardGoodPrice = document.querySelector('.card-good__price');
   const cardGoodoClor = document.querySelector('.card-good__color');
   const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');
   const cardGoodoClorList = document.querySelector('.card-good__color-list');
   const cardGoodSizes = document.querySelector('.card-good__sizes');
   const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
   const cardGoodBuy = document.querySelector('.card-good__buy');

   const generateList = data => data.reduce((html, item, index) => html + 
      `<li class="card-good__select-item" data-id="${index}">${item}</li>`, '');

   const renderCardGood = ([{ id, name, cost, brand, sizes, color, photo }]) => {

      const data = { brand, name, cost, id };

      cardGoodImage.src = `goods-image/${photo}`;
      cardGoodImage.alt = `${brand} ${name}`;
      cardGoodBrand.textContent = brand;
      cardGoodTitle.textContent = name;
      cardGoodPrice.textContent = `${cost} ₽`;

      if (color) {
         cardGoodoClor.textContent = color[0];
         cardGoodoClor.dataset.id = 0;
         cardGoodoClorList.innerHTML = generateList(color);
      } else {
         cardGoodoClor.style.display = 'none';
      }

      if (sizes) {
         cardGoodSizes.textContent = sizes[0];
         cardGoodSizes.dataset.id = 0;
         cardGoodSizesList.innerHTML = generateList(sizes);
      } else {
         cardGoodSizes.style.display = 'none';
      }

      cardGoodBuy.addEventListener('click', () => {
         if (color) data.color = cardGoodoClor.textContent;
         if (sizes) data.size = cardGoodSizes.textContent;

         const cardData = getLocalStorage();
         cardData.push(data);
         setLocalStorage(cardData);
      });

   };

   cardGoodSelectWrapper.forEach(item => {
      item.addEventListener('click', e => {
         const target = e.target;

         if (target.closest('.card-good__select')) {
            target.classList.toggle('card-good__select__open');
         }
         
         if (target.closest('.card-good__select-item')) {
            const cardGoodSelect = item.querySelector('.card-good__select');
            cardGoodSelect.textContent = target.textContent;
            cardGoodSelect.dataset.id = target.dataset.id;
            cardGoodSelect.classList.remove('card-good__select__open');
         }
      });
   });


   getGoods(renderCardGood, 'id', hash);
   
} catch (error) {
   console.log(error);
}
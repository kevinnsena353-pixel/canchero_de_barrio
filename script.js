// ---------- Datos de productos ----------
  const products = [
    {
      num:"09", name:"Camisa Potrero", price:"$89.900",
      colorA:"#2e59a5", colorB:"#0a1442",
      story:"Ilorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      num:"07", name:"Camisa Cable", price:"$94.900",
      colorA:"#0a0a0a", colorB:"#2e59a5",
      story:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      num:"10", name:"Camisa Taller", price:"$99.900",
      colorA:"#ffd400", colorB:"#0a0a0a",
      story:"lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      num:"11", name:"Camisa Final", price:"$104.900",
      colorA:"#f4f2ea", colorB:"#2e59a5",
      story:"lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }
  ];

  const grid = document.getElementById('productGrid');
  products.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front">
          <span class="card-tag">#${p.num}</span>
          <div class="jersey-wrap">
            <svg width="130" height="140" viewBox="0 0 130 140" aria-hidden="true">
              <path d="M20 20 L45 8 L65 20 L85 8 L110 20 L118 40 L100 50 L100 132 L30 132 L30 50 L12 40 Z" fill="${p.colorA}" stroke="${p.colorB}" stroke-width="3"/>
              <text x="65" y="90" font-family="Anton, sans-serif" font-size="34" fill="${p.colorB}" text-anchor="middle">${p.num}</text>
            </svg>
          </div>
          <div class="card-bottom">
            <div>
              <div class="card-name">${p.name}</div>
              <div class="flip-hint">TOCA PARA VER LA HISTORIA →</div>
            </div>
            <div class="card-price">${p.price}</div>
          </div>
        </div>
        <div class="card-face card-back">
          <div>
            <span class="eyebrow">La historia</span>
            <h4>${p.name}</h4>
            <p>${p.story}</p>
          </div>
          <button class="add-btn" data-name="${p.name}">Agregar al carrito</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // ---------- Carrito ----------
  let cartCount = 0;
  const cartCountEl = document.getElementById('cartCount');
  const toast = document.getElementById('toast');
  const cartPanel = document.getElementById('cartPanel');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartClose = document.getElementById('cartClose');
  const checkoutBtn = document.getElementById('checkoutBtn');
  let toastTimer;
  const cartProducts = [];

  const formatPrice = (value) => `$${value.toLocaleString('es-CO')}`;

  const renderCart = () => {
    cartItems.innerHTML = '';
    if (cartProducts.length === 0) {
      cartItems.innerHTML = '<div class="cart-item"><div class="cart-item-name">Tu carrito está vacío</div><div class="cart-item-price">Elige una camisa para comenzar</div></div>';
      cartTotal.textContent = formatPrice(0);
      cartCountEl.textContent = '0';
      return;
    }

    let total = 0;
    cartProducts.forEach((product, index) => {
      total += product.price;
      const item = document.createElement('div');
      item.className = 'cart-item';
      item.innerHTML = `
        <div class="cart-item-name">${product.name}</div>
        <div class="cart-item-price">${formatPrice(product.price)}</div>
        <button class="cart-remove-btn" data-index="${index}" type="button">Borrar</button>
      `;
      cartItems.appendChild(item);
    });

    cartTotal.textContent = formatPrice(total);
    cartCountEl.textContent = cartProducts.length;
  };

  document.body.addEventListener('click', (e) => {
    if(e.target.classList.contains('add-btn')){
      const name = e.target.dataset.name;
      const product = products.find((p) => p.name === name);
      if (product) {
        const priceValue = Number(product.price.replace(/[^\d]/g, ''));
        cartProducts.push({name: product.name, price: priceValue});
        cartCount = cartProducts.length;
        renderCart();
        toast.textContent = `${product.name} agregada al carrito ⚽`;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(()=> toast.classList.remove('show'), 2400);
      }
    }

    if (e.target.classList.contains('cart-remove-btn')) {
      const index = Number(e.target.dataset.index);
      cartProducts.splice(index, 1);
      renderCart();
      toast.textContent = 'Camisa eliminada del carrito';
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(()=> toast.classList.remove('show'), 2400);
    }
  });

  document.getElementById('cartBtn').addEventListener('click', () => {
    cartPanel.classList.toggle('open');
    cartPanel.setAttribute('aria-hidden', String(!cartPanel.classList.contains('open')));
    if (cartPanel.classList.contains('open')) {
      renderCart();
    }
  });

  checkoutBtn.addEventListener('click', () => {
    if (cartProducts.length === 0) {
      toast.textContent = 'Agrega una camisa antes de pagar';
    } else {
      toast.textContent = '¡Gracias! El pago se realizará pronto';
    }
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> toast.classList.remove('show'), 2400);
  });

  cartClose.addEventListener('click', () => {
    cartPanel.classList.remove('open');
    cartPanel.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('click', (e) => {
    if (cartPanel.classList.contains('open') && !cartPanel.contains(e.target) && e.target.id !== 'cartBtn' && !e.target.closest('#cartBtn')) {
      cartPanel.classList.remove('open');
      cartPanel.setAttribute('aria-hidden', 'true');
    }
  });

  document.getElementById('searchBtn').addEventListener('click', () => {
    document.getElementById('colecciones').scrollIntoView({behavior:'smooth'});
  });

  const contactToggle = document.getElementById('contactToggle');
  const socialLinks = document.getElementById('socialLinks');
  if (contactToggle && socialLinks) {
    const toggleSocialLinks = () => {
      const isExpanded = contactToggle.getAttribute('aria-expanded') === 'true';
      contactToggle.setAttribute('aria-expanded', String(!isExpanded));
      socialLinks.hidden = isExpanded;
      socialLinks.style.display = isExpanded ? 'none' : 'flex';
    };

    contactToggle.addEventListener('click', toggleSocialLinks);

    document.addEventListener('click', (event) => {
      if (!contactToggle.contains(event.target) && !socialLinks.contains(event.target)) {
        contactToggle.setAttribute('aria-expanded', 'false');
        socialLinks.hidden = true;
        socialLinks.style.display = 'none';
      }
    });
  }

  // ---------- Menú móvil ----------
  const nav = document.getElementById('mainNav');
  const burger = document.getElementById('burgerBtn');
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
  });
  document.querySelectorAll('.nav a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
    });
  });

  // ---------- Newsletter ----------
  document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const message = document.getElementById('messageInput').value.trim();
    const msg = document.getElementById('formMsg');
    msg.textContent = `¡Gracias ${name || 'por tu interés'}! Hemos recibido tu mensaje y te contactaremos pronto`;
  });

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

// ---------- Colección ----------
const grid = document.getElementById('productGrid');

if (grid) {
  products.forEach((p, i) => {
    const priceValue = Number(p.price.replace(/[^\d]/g, ''));
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
          <button
            class="add-btn"
            type="button"
            data-name="${p.name}"
            data-product-index="${i}">
            Agregar al carrito
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ---------- Carrito: SIEMPRE usa CancheroCart compartido ----------
let toastTimer;
const toast = document.getElementById('toast');

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

document.body.addEventListener('click', (e) => {
  const addBtn = e.target.closest('.add-btn');
  if (!addBtn) return;

  const index = Number(addBtn.dataset.productIndex);
  const product = products[index];
  if (!product || !window.CancheroCart) return;

  const priceValue = Number(product.price.replace(/[^\d]/g, ''));

  window.CancheroCart.add({
    type: 'catalog',
    key: `catalog-${product.num}`,
    name: product.name,
    price: priceValue,
    qty: 1,
    details: 'Prenda de colección',
    modelName: product.name,
    image: null
  });

  showToast(`${product.name} agregada al carrito ⚽`);
});

// ---------- Buscar colección ----------
const searchBtn = document.getElementById('searchBtn');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    document.getElementById('colecciones')?.scrollIntoView({behavior:'smooth'});
  });
}

// ---------- Contacto / redes ----------
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
if (nav && burger) {
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
}

// ---------- Newsletter ----------
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('nameInput')?.value.trim();
    const msg = document.getElementById('formMsg');
    if (msg) {
      msg.textContent = `¡Gracias ${name || 'por tu interés'}! Hemos recibido tu mensaje y te contactaremos pronto`;
    }
  });
}

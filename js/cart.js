/* Canchero de Barrio - carrito compartido entre index y configurador */
(function(){
  const KEY='canchero_cart_v1';
  const CART=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return[]}};
  const save=c=>{localStorage.setItem(KEY,JSON.stringify(c)); render();};
  const money=n=>'$'+Number(n||0).toLocaleString('es-CO')+' COP';
  const esc=s=>String(s??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
  function add(item){
    const c=CART();
    const key=item.key||[item.type,item.modelId,item.designId,item.size,item.color].join('|');
    const found=c.find(x=>x.key===key);
    if(found) found.qty += Number(item.qty||1); else c.push({...item,key,qty:Number(item.qty||1)});
    save(c); openCart();
  }
  function remove(i){const c=CART();c.splice(i,1);save(c)}
  function change(i,d){const c=CART();c[i].qty=Math.max(1,c[i].qty+d);save(c)}
  function total(c){return c.reduce((s,x)=>s+(Number(x.price)||0)*(Number(x.qty)||1),0)}
  function render(){
    const c=CART(), count=c.reduce((s,x)=>s+Number(x.qty||1),0);
    document.querySelectorAll('#cartCount').forEach(e=>e.textContent=count);
    const box=document.getElementById('cartItems'), t=document.getElementById('cartTotal');
    if(box){box.innerHTML=c.length?c.map((x,i)=>`<div class="cart-item">
      ${x.designImage?`<div class="cart-item-thumb"><img src="${esc(x.designImage)}" alt="Diseño seleccionado" onerror="this.parentElement.style.display='none'"></div>`:''}
      <div class="cart-item-main"><strong>${esc(x.name)}</strong>
      ${x.type==='custom'?`<div class="cart-specs">
        ${x.modelName?`<span><b>Prenda:</b> ${esc(x.modelName)}</span>`:''}
        ${x.size?`<span><b>Talla:</b> ${esc(x.size)}</span>`:''}
        ${x.color?`<span><i class="color-dot" style="background:${esc(x.color)}"></i><b>Color:</b> ${esc(x.colorName||x.color)}</span>`:''}
        ${x.designName?`<span><b>Diseño:</b> ${esc(x.designName)}</span>`:''}
      </div>`:`<small>${esc(x.details||'')}</small>`}
      <b>${money(x.price)} c/u</b></div>
      <div class="cart-item-actions"><button data-cart-dec="${i}">−</button><span>${x.qty}</span><button data-cart-inc="${i}">+</button><button class="cart-remove" data-cart-remove="${i}">Eliminar</button></div></div>`).join(''):'<div class="cart-empty">Tu carrito está vacío.<br><small>Diseña una camisa o agrega una prenda desde la tienda.</small></div>';}
    if(t)t.textContent=money(total(c));
  }
  function openCart(){const p=document.getElementById('cartPanel');if(p){p.classList.add('open');p.setAttribute('aria-hidden','false');}}
  function closeCart(){const p=document.getElementById('cartPanel');if(p){p.classList.remove('open');p.setAttribute('aria-hidden','true');}}
  function checkout(){ if(!CART().length){alert('Tu carrito está vacío.');return;} if(window.CancheroInlineCheckout){ window.CancheroInlineCheckout.open(); return; } location.href='index.html#checkout'; }
  window.CancheroCart={add,remove,change,openCart,closeCart,get:CART,total,money};
  document.addEventListener('click',e=>{
    const a=e.target.closest('[data-add-cart]'); if(a){e.preventDefault();add(JSON.parse(a.dataset.addCart));}
    const r=e.target.closest('[data-cart-remove]'); if(r)remove(+r.dataset.cartRemove);
    const inc=e.target.closest('[data-cart-inc]'); if(inc)change(+inc.dataset.cartInc,1);
    const dec=e.target.closest('[data-cart-dec]'); if(dec)change(+dec.dataset.cartDec,-1);
    if(e.target.closest('#cartBtn, #configCartBtn'))openCart();
    if(e.target.closest('#cartClose'))closeCart();
    if(e.target.closest('#checkoutBtn'))checkout();
    if(e.target.closest('#continueShopping'))closeCart();
  });
  // Captura cualquier botón de la sección Colección, incluso si otra versión de script.js
  // lo generó sin usar data-add-cart. Así todos los productos usan ESTE mismo carrito.
  document.addEventListener('click',e=>{
    const btn=e.target.closest('#productGrid button, #productGrid [role=button]');
    if(!btn || btn.hasAttribute('data-add-cart')) return;
    const card=btn.closest('.product-card, article, .product');
    if(!card) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const name=(card.querySelector('h3,h4,.product-name,.product-title')?.textContent||'Prenda de colección').trim();
    const priceText=(card.querySelector('.price,.product-price,p')?.textContent||'').replace(/[^0-9]/g,'');
    const price=Number(priceText)||0;
    const img=card.querySelector('img')?.getAttribute('src')||null;
    const id=card.dataset.id||card.dataset.productId||name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    add({type:'catalog',key:'catalog-'+id,name,price,qty:1,details:'Prenda de colección',image:img});
  }, true);

  document.addEventListener('DOMContentLoaded',()=>{
    render();
    const grid=document.getElementById('productGrid');
    if(grid && !grid.children.length){
      const products=[
        {name:'Camiseta Canchero Clásico',price:68000,details:'Camiseta · talla M',image:'designs/future.jpg'},
        {name:'Camiseta La Pelota No Se Mancha',price:68000,details:'Camiseta · talla M',image:'designs/king_kong.jpg'},
        {name:'Camiseta Fútbol Revolución',price:68000,details:'Camiseta · talla M',image:'designs/rana.jpg'}
      ];
      grid.innerHTML=products.map((p,i)=>`<article class="product-card"><div class="product-image">${p.image?`<img src="${p.image}" alt="${esc(p.name)}" onerror="this.style.display='none'">`:''}</div><div class="product-card-body"><h3>${esc(p.name)}</h3><p>${money(p.price)}</p><button class="btn btn-primary" data-add-cart='${JSON.stringify({type:'catalog',name:p.name,price:p.price,details:p.details,key:'catalog-'+i}).replace(/'/g,'&#39;')}'>Agregar al carrito</button></div></article>`).join('');
    }
  });
})();

// State
  const cartState = [
    { id: 3, name: 'Leche Entera Vita 1L (Funda)', price: 0.95, qty: 2 },
    { id: 1, name: 'Café Lojano Molido 250g', price: 3.80, qty: 1 },
    { id: 4, name: 'Galletas Amor Vainilla Pack 4', price: 1.20, qty: 1 }
  ];

  function addToCart(id, name, price) {
    const existing = cartState.find(item => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cartState.push({ id, name, price, qty: 1 });
    }
    renderCart();
    // Micro interaction feedback
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<svg class="inline-block shrink-0 w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>Listo</span>`;
    setTimeout(() => { btn.innerHTML = originalText; }, 900);
  }

  function updateQty(id, delta) {
    const item = cartState.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeItem(id);
      return;
    }
    renderCart();
  }

  function removeItem(id) {
    const index = cartState.findIndex(i => i.id === id);
    if (index !== -1) {
      cartState.splice(index, 1);
    }
    renderCart();
  }

  function renderCart() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('items-badge');
    const subtotalEl = document.getElementById('subtotal-val');
    const shippingEl = document.getElementById('shipping-val');
    const totalEl = document.getElementById('total-val');
    const waBtnText = document.getElementById('whatsapp-btn-text');
    const progressBar = document.getElementById('free-shipping-bar');

    if (!container) return;

    if (cartState.length === 0) {
      container.innerHTML = `
        <div class="py-8 text-center text-on-surface-variant">
          <svg class="inline-block shrink-0 w-[36px] h-[36px] text-outline-variant block mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          <p class="font-label-md text-label-md">Tu carrito está vacío</p>
          <p class="font-label-sm text-label-sm">Haz clic en "Agregar" en cualquier producto</p>
        </div>
      `;
      badge.textContent = '0 productos';
      subtotalEl.textContent = '$0.00';
      shippingEl.textContent = '$0.00';
      totalEl.textContent = '$0.00 USD';
      waBtnText.textContent = 'Canasta vacía';
      progressBar.style.width = '0%';
      updateWhatsappPreview();
      return;
    }

    let subtotal = 0;
    let totalItems = 0;

    container.innerHTML = cartState.map(item => {
      const itemSub = item.price * item.qty;
      subtotal += itemSub;
      totalItems += item.qty;
      return `
        <div class="cart-item bg-surface-container-low/70 p-space-sm rounded-lg flex items-center justify-between gap-2" data-cart-id="${item.id}">
          <div class="min-w-0 flex-1">
            <h5 class="font-label-md text-label-md text-on-surface truncate">${item.name}</h5>
            <p class="font-label-sm text-label-sm text-on-surface-variant">$${item.price.toFixed(2)} c/u</p>
          </div>
          <div class="flex items-center gap-1.5">
            <button data-on-click="updateQty(${item.id}, -1)" class="w-7 h-7 rounded bg-surface-container text-on-surface flex items-center justify-center font-bold hover:bg-surface-dim transition-colors">-</button>
            <span class="w-6 text-center font-label-md text-label-md text-on-surface qty-val">${item.qty}</span>
            <button data-on-click="updateQty(${item.id}, 1)" class="w-7 h-7 rounded bg-surface-container text-on-surface flex items-center justify-center font-bold hover:bg-surface-dim transition-colors">+</button>
          </div>
          <div class="text-right min-w-[50px]">
            <span class="font-label-md text-label-md text-on-surface font-bold item-total">$${itemSub.toFixed(2)}</span>
            <button data-on-click="removeItem(${item.id})" class="text-error block text-label-sm hover:underline ml-auto">Quitar</button>
          </div>
        </div>
      `;
    }).join('');

    const shipping = subtotal >= 15.00 ? 0 : 1.50;
    const finalTotal = subtotal + shipping;

    badge.textContent = `${totalItems} producto${totalItems > 1 ? 's' : ''}`;
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`;
    totalEl.textContent = `$${finalTotal.toFixed(2)} USD`;
    waBtnText.textContent = `Enviar pedido por WhatsApp ($${finalTotal.toFixed(2)})`;

    const progressPct = Math.min(100, Math.round((subtotal / 15) * 100));
    progressBar.style.width = `${progressPct}%`;

    updateWhatsappPreview(subtotal, shipping, finalTotal);
  }

  function updateWhatsappPreview(subtotalVal, shippingVal, finalTotalVal) {
    const previewEl = document.getElementById('wa-preview');
    if (!previewEl) return;

    if (cartState.length === 0) {
      previewEl.textContent = 'Elige productos para armar el mensaje.';
      return;
    }

    const name = document.getElementById('cust-name')?.value || 'Cliente';
    const address = document.getElementById('cust-address')?.value || 'Por definir con la tienda';
    const payment = document.getElementById('cust-payment')?.value || 'Efectivo';

    let sub = 0;
    const lines = cartState.map(i => {
      const lineCost = i.price * i.qty;
      sub += lineCost;
      return `- ${i.qty}x ${i.name} ($${lineCost.toFixed(2)})`;
    });

    const ship = sub >= 15 ? 0 : 1.50;
    const grand = sub + ship;

    const message = 
`Hola Dulce Hogar, quiero hacer este pedido:
${lines.join('\n')}
---------------------
Subtotal: $${sub.toFixed(2)}
Envío en moto: ${ship === 0 ? 'Gratis' : '$' + ship.toFixed(2)}
TOTAL: $${grand.toFixed(2)} USD
Método de Pago: ${payment}
Cliente: ${name}
Dirección: ${address}`;

    previewEl.textContent = message;
  }

function triggerWhatsappSend() {
  if (cartState.length === 0) {
    alert("Por favor agrega al menos un producto al pedido.");
    return;
  }
  var previewText = document.getElementById("wa-preview") ? document.getElementById("wa-preview").textContent : "";
  // Un solo numero de WhatsApp en todo el sitio (visible como +593 99 137 1570).
  window.open("https://wa.me/593991371570?text=" + encodeURIComponent(previewText), "_blank", "noopener");
  agregarPedidoDesdeCarrito();
}

  // Filter Categories
  document.addEventListener('DOMContentLoaded', () => {
    const pills = document.querySelectorAll('.cat-pill');
    const items = document.querySelectorAll('.product-item');
    const countLabel = document.getElementById('product-count-label');

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => {
          p.classList.remove('active', 'bg-primary', 'text-on-primary');
          p.classList.add('bg-surface-container-low', 'text-on-surface');
        });
        pill.classList.add('active', 'bg-primary', 'text-on-primary');
        pill.classList.remove('bg-surface-container-low', 'text-on-surface');

        const cat = pill.getAttribute('data-cat');
        let visibleCount = 0;

        items.forEach(item => {
          const itemCat = item.getAttribute('data-cat');
          if (cat === 'all' || itemCat === cat) {
            item.classList.remove('hidden');
            visibleCount++;
          } else {
            item.classList.add('hidden');
          }
        });

        if (countLabel) countLabel.textContent = `Mostrando ${visibleCount} productos`;
      });
    });

    // Real-time search
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        let visibleCount = 0;

        items.forEach(item => {
          const name = item.getAttribute('data-name') || '';
          if (name.includes(query)) {
            item.classList.remove('hidden');
            visibleCount++;
          } else {
            item.classList.add('hidden');
          }
        });

        if (countLabel) countLabel.textContent = `Mostrando ${visibleCount} productos`;
      });
    }

    renderCart();
  });



/* Eventos del diseño original (onclick, onsubmit...): el HTML los lleva como
   data-on-click="funcion('arg')" y aquí se re-adjuntan, sin 'unsafe-inline'. */
(function () {
  "use strict";
  var TIPOS = {
    "data-on-click": "click",
    "data-on-submit": "submit",
    "data-on-keyup": "keyup",
    "data-on-change": "change",
    "data-on-input": "input"
  };

  function partirArgumentos(txt) {
    var partes = [], actual = "", comilla = null;
    for (var i = 0; i < txt.length; i++) {
      var c = txt.charAt(i);
      if (comilla) {
        actual += c;
        if (c === comilla) comilla = null;
      } else if (c === "'" || c === '"') {
        comilla = c;
        actual += c;
      } else if (c === ",") {
        partes.push(actual.trim());
        actual = "";
      } else {
        actual += c;
      }
    }
    if (actual.trim()) partes.push(actual.trim());
    return partes;
  }

  function valor(parte, evento, elemento) {
    if (parte === "event") return evento;
    if (parte === "this") return elemento;
    var m = /^'([\s\S]*)'$/.exec(parte) || /^"([\s\S]*)"$/.exec(parte);
    if (m) return m[1];
    if (/^-?\d+(\.\d+)?$/.test(parte)) return Number(parte);
    return parte;
  }

  function ejecutar(evento, elemento, expr) {
    var i = expr.indexOf("(");
    var j = expr.lastIndexOf(")");
    if (i < 0 || j < i) return;
    var fn = window[expr.slice(0, i).trim()];
    if (typeof fn !== "function") return;
    var args = partirArgumentos(expr.slice(i + 1, j)).map(function (p) {
      return valor(p, evento, elemento);
    });
    fn.apply(elemento, args);
  }

  Object.keys(TIPOS).forEach(function (attr) {
    document.addEventListener(TIPOS[attr], function (evento) {
      var t = evento.target;
      var el = t && t.closest ? t.closest("[" + attr + "]") : null;
      if (!el) return;
      var expr = el.getAttribute(attr);
      if (expr) ejecutar(evento, el, expr);
    });
  });
})();

/* ---------- Panel de estados del pedido (Nuevo -> Preparando -> Entregado) ---------- */
var CLAVE_PEDIDOS = "reukev-demo1-pedidos";
var ESTADOS_PEDIDO = ["Nuevo", "Preparando", "Entregado"];

function leerPedidos() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PEDIDOS)) || [];
  } catch (e) {
    return [];
  }
}

function guardarPedidos(lista) {
  try {
    localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(lista));
  } catch (e) { /* navegador sin almacenamiento: la demo sigue funcionando */ }
}

function sembrarPedidos() {
  if (leerPedidos().length) return;
  guardarPedidos([
    { id: "DH-1001", cliente: "Mariela Q.", total: 18.5, estado: 0 },
    { id: "DH-1002", cliente: "Carlos E.", total: 24.0, estado: 1 }
  ]);
}

function etiquetaEstado(i) {
  var clases = ["bg-primary text-on-primary", "bg-primary-container text-on-primary-container", "bg-secondary-container text-on-secondary-container"];
  return '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ' + clases[i] + '">' + ESTADOS_PEDIDO[i] + "</span>";
}

function pintarPanel() {
  var cont = document.getElementById("panel-estados");
  var vacio = document.getElementById("panel-vacio");
  if (!cont) return;
  var pedidos = leerPedidos();
  sembrarPedidos();
  pedidos = leerPedidos();
  if (vacio) vacio.classList.toggle("hidden", pedidos.length > 0);
  cont.innerHTML = pedidos.map(function (p, idx) {
    var puedeAvanzar = p.estado < ESTADOS_PEDIDO.length - 1;
    return '<div class="grid grid-cols-2 sm:grid-cols-12 gap-space-sm items-center px-space-md py-space-sm">' +
      '<span class="col-span-2 font-label-md text-label-md text-on-surface">' + p.id + "</span>" +
      '<span class="col-span-4 font-body-md text-body-md text-on-surface-variant">' + p.cliente + "</span>" +
      '<span class="col-span-2 font-label-md text-label-md text-on-surface sm:text-right">$' + p.total.toFixed(2) + "</span>" +
      '<span class="col-span-4 flex flex-wrap items-center gap-2">' + etiquetaEstado(p.estado) +
      (puedeAvanzar ? '<button type="button" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-container text-on-surface font-label-sm text-label-sm border border-outline-variant transition-colors" data-avanzar="' + idx + '">Avanzar</button>' : "") +
      '<button type="button" class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-on-surface-variant hover:text-error font-label-sm text-label-sm transition-colors" data-quitar="' + idx + '">Quitar</button>' +
      "</span></div>";
  }).join("");

  cont.querySelectorAll("[data-avanzar]").forEach(function (b) {
    b.addEventListener("click", function () {
      var lista = leerPedidos();
      var i = Number(b.getAttribute("data-avanzar"));
      if (lista[i] && lista[i].estado < ESTADOS_PEDIDO.length - 1) lista[i].estado++;
      guardarPedidos(lista);
      pintarPanel();
    });
  });
  cont.querySelectorAll("[data-quitar]").forEach(function (b) {
    b.addEventListener("click", function () {
      var lista = leerPedidos();
      lista.splice(Number(b.getAttribute("data-quitar")), 1);
      guardarPedidos(lista);
      pintarPanel();
    });
  });
}

function agregarPedidoDesdeCarrito() {
  var lista = leerPedidos();
  var total = 0;
  cartState.forEach(function (i) { total += i.price * i.qty; });
  var numero = 1003 + lista.length;
  lista.unshift({
    id: "DH-" + numero,
    cliente: (document.getElementById("cust-name") || {}).value || "Cliente demo",
    total: total,
    estado: 0
  });
  guardarPedidos(lista);
  pintarPanel();
}

var botonVaciar = document.getElementById("btn-vaciar-panel");
if (botonVaciar) {
  botonVaciar.addEventListener("click", function () {
    guardarPedidos([]);
    pintarPanel();
  });
}

document.addEventListener("DOMContentLoaded", pintarPanel);

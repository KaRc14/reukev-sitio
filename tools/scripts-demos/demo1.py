#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Demo 1: catálogo de Dulce Hogar con pedidos por WhatsApp."""

import re, sys

import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_demos import transform, BASE

PANEL_HTML = """
<!-- ================= ESTADO DE PEDIDO (demo con localStorage) ================= -->
<section id="estado-pedido" class="w-full bg-surface-container-low py-space-xl border-t border-outline-variant/30">
<div class="max-w-[1200px] mx-auto px-margin">
<div class="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-md">
<div>
<span class="font-label-md text-label-md text-primary uppercase tracking-wider">Panel de pedidos</span>
<h2 class="font-headline-sm text-headline-sm text-on-surface mt-1">Estado de mi pedido</h2>
<p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">Cada pedido pasa por Nuevo, Preparando y Entregado. En esta demo los datos se guardan en tu propio navegador (localStorage): no se envían a ningún servidor.</p>
</div>
<button type="button" class="self-start md:self-auto inline-flex items-center gap-2 px-space-md py-2 rounded-lg bg-surface hover:bg-surface-container text-on-surface font-label-md text-label-md border border-outline-variant transition-colors" id="btn-vaciar-panel">
<svg class="inline-block shrink-0 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
<span>Vaciar la demo</span>
</button>
</div>
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
<div class="hidden sm:grid grid-cols-12 gap-space-sm px-space-md py-space-xs bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
<span class="col-span-2">Pedido</span><span class="col-span-4">Cliente</span><span class="col-span-2 text-right">Total</span><span class="col-span-4">Estado</span>
</div>
<div id="panel-estados" class="divide-y divide-outline-variant/40"></div>
<p id="panel-vacio" class="hidden px-space-md py-space-lg text-center font-body-md text-body-md text-on-surface-variant">Todavía no hay pedidos guardados. Envía uno desde el carrito y aparecerá aquí.</p>
</div>
</div>
</section>
"""

PANEL_JS = """
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
"""

NUEVO_ENVIO = """function triggerWhatsappSend() {
  if (cartState.length === 0) {
    alert("Por favor agrega al menos un producto al pedido.");
    return;
  }
  var previewText = document.getElementById("wa-preview") ? document.getElementById("wa-preview").textContent : "";
  // Un solo numero de WhatsApp en todo el sitio (visible como +593 99 137 1570).
  window.open("https://wa.me/593991371570?text=" + encodeURIComponent(previewText), "_blank", "noopener");
  agregarPedidoDesdeCarrito();
}"""

cfg = {
    "src": "demo_1_cat_logo_de_pedidos_por_whatsapp_dulce_hogar",
    "dst": "sitio-web/demos/demo1-catalogo-pedidos/index.html",
    "slug": "demo1-catalogo-pedidos",
    "js": "sitio-web/assets/js/demo1.js",
    "titulo": "Demo · Dulce Hogar: catálogo con pedidos por WhatsApp | ReuKev",
    "desc": "Demo funcional de ReuKev: catálogo de minimarket con buscador, categorías, carrito y envío del pedido por WhatsApp. Datos de ejemplo.",
    "msg_barra": "Hola Kevin, vi la demo del catálogo de Dulce Hogar y quiero uno así para mi negocio.",
    "imagenes": [
        "demo1/prod-cafe.webp",
        "demo1/prod-aceite.webp",
        "demo1/prod-leche.webp",
        "demo1/prod-galletas.webp",
        "demo1/prod-arroz.webp",
        "demo1/prod-papas.webp",
        "demo1/prod-chocolate.webp",
        "demo1/prod-detergente.webp",
        "demo1/prod-combo.webp",
    ],
    "alts": [
        "Caf\u00e9 molido de la tienda de ejemplo",
        "Aceite comestible de la tienda de ejemplo",
        "Leche fresca de la tienda de ejemplo",
        "Galletas de la tienda de ejemplo",
        "Arroz de la tienda de ejemplo",
        "Papas fritas de la tienda de ejemplo",
        "Chocolates de la tienda de ejemplo",
        "Detergente de la tienda de ejemplo",
        "Combo de productos de la tienda de ejemplo",
    ],
    "fixes": [
        (
            "Abierto hoy hasta las 20:00 · Envíos en moto Quito/Guayaquil",
            "Abierto hoy hasta las 20:00 · Envíos a domicilio",
        ),
        # --- navegación: anclas reales en vez de href="#" ---
        (
            'data-path="catalogo-de-productos" href="#"',
            'data-path="catalogo-de-productos" href="#catalog-title"',
        ),
        (
            '<aside class="lg:col-span-4 sticky top-28 space-y-space-md">',
            '<aside class="lg:col-span-4 sticky top-28 space-y-space-md" id="resumen-del-pedido">',
        ),
        (
            'data-path="resumen-del-pedido" href="#"',
            'data-path="resumen-del-pedido" href="#resumen-del-pedido"',
        ),
        # el nav apuntaba a una sección que no existe: se quita el enlace
        (
            '<a class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors py-space-xs px-space-sm rounded" data-path="ofertas-y-combos" href="#">Combos del Día</a>',
            "",
        ),
        # --- CTA sin destino -> data-wa (número único vía wa.js) ---
        (
            '<a class="px-space-sm py-1 bg-primary text-on-primary rounded font-semibold hover:bg-primary-hover transition-colors shadow-sm flex items-center gap-1" href="#">',
            '<a class="px-space-sm py-1 bg-primary text-on-primary rounded font-semibold hover:bg-primary-hover transition-colors shadow-sm flex items-center gap-1" href="#" data-wa="Hola Kevin, vi la demo del catálogo con pedidos por WhatsApp y quiero el Plan Básico de $250 para mi negocio.">',
        ),
        (
            '<a class="px-space-md py-space-xs bg-inverse-surface text-inverse-on-surface rounded-lg font-label-md text-label-md hover:bg-on-surface transition-all whitespace-nowrap shadow-sm" href="#">',
            '<a class="px-space-md py-space-xs bg-inverse-surface text-inverse-on-surface rounded-lg font-label-md text-label-md hover:bg-on-surface transition-all whitespace-nowrap shadow-sm" href="#" data-wa="Hola Kevin, vi la demo del catálogo con pedidos por WhatsApp y quiero el Plan Básico de $250 para mi negocio.">',
        ),
        (
            "Entregas directas en moto en Quito Norte, La Carolina, Mariana de Jesús y Valles.",
            "Entregas directas en moto en los sectores de tu ciudad.",
        ),
        (
            "Cobertura local en sectores seleccionados (Quito &amp; Guayaquil)",
            "Cobertura local en sectores seleccionados de tu ciudad",
        ),
        (
            'data-path="seguimiento-de-pedido" href="#"',
            'data-path="seguimiento-de-pedido" href="#estado-pedido"',
        ),
        (
            '<div class="bg-primary h-full rounded-full transition-all" id="free-shipping-bar" style="width: 46%;"></div>',
            '<div class="bg-primary h-full rounded-full transition-all w-[46%]" id="free-shipping-bar"></div>',
        ),
    ],
    "ctas": [],
    "js_extra": "",
}

transform(cfg)

# --- retoques sobre el HTML: panel de estados antes del cierre de main ---
p = BASE + "sitio-web/demos/demo1-catalogo-pedidos/index.html"
h = open(p, encoding="utf-8").read()
assert "</main>" in h
h = h.replace("</main>", PANEL_HTML.strip() + "\n</main>", 1)
open(p, "w", encoding="utf-8").write(h)

# --- retoques sobre el JS: numero unico + envio que ademas guarda el pedido ---
j = BASE + "sitio-web/assets/js/demo1.js"
js = open(j, encoding="utf-8").read()
js = js.replace(
    'const storeNumber = "593998241092";',
    'const storeNumber = "593991371570"; // numero unico de ReuKev',
)
js = re.sub(
    r"  function triggerWhatsappSend\(\) \{.*?\n  \}\n",
    NUEVO_ENVIO + "\n",
    js,
    count=1,
    flags=re.S,
)
assert "agregarPedidoDesdeCarrito" in js
assert "593998241092" not in js
js += PANEL_JS
open(j, "w", encoding="utf-8").write(js)
print("demo1: panel de estados + numero unico OK")

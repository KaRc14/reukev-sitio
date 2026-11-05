#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Demo 3: inventario y reportes para PYMEs (Kardex Pro, negocio ficticio)."""

import re, sys

import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_demos import transform, BASE

# Foto pendiente de generar (límite de créditos hasta 2026-11-06): cuadro gris con icono.
ICONO_FOTO = (
    '<svg class="inline-block shrink-0 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/>'
    '<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'
)
PLACEHOLDER_FOTO = (
    '<div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center '
    'text-outline shrink-0" role="img" aria-label="Foto de producto pendiente">'
    + ICONO_FOTO
    + "</div>"
)

NOTA_ALCANCE = (
    '<p class="max-w-[1200px] mx-auto px-gutter pb-space-xl font-label-sm text-label-sm '
    'text-on-surface-variant">Alcance de los planes: el Estándar ($490) cubre un local con los '
    "módulos de esta demo; el Avanzado ($1.150) agrega multi-sucursal y conciliación. La inducción "
    "del personal, la carga inicial del inventario y la conexión con la facturación electrónica "
    "del SRI se cotizan como extras.</p>"
)

NAV_JS = r"""
/* Navegación del encabezado:Inventario, Movimientos, Reportes y Alertas. */
(function () {
  var enlaces = document.querySelectorAll("header nav a[data-path]");
  function marcar(activo) {
    enlaces.forEach(function (n) {
      n.classList.remove("bg-primary-container", "text-on-primary-container", "rounded-lg");
      n.removeAttribute("aria-current");
    });
    if (activo) {
      activo.classList.add("bg-primary-container", "text-on-primary-container", "rounded-lg");
      activo.setAttribute("aria-current", "page");
    }
  }
  enlaces.forEach(function (a) {
    a.addEventListener("click", function (evento) {
      evento.preventDefault();
      var path = a.getAttribute("data-path");
      marcar(a);
      if (path === "movimientos") {
        if (typeof openQuickMovementModal === "function") openQuickMovementModal();
        return;
      }
      if (path === "alertas-de-stock") {
        if (typeof filterCriticalStockOnly === "function") filterCriticalStockOnly();
        return;
      }
      var id = path === "reportes-semanales" ? "reporte-preview" : "inventoryTable";
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
"""

VISTA_JS = r"""
/* Vista alternativa: tarjetas en lugar de la tabla (botón "Cambiar vista"). */
(function () {
  var tabla = document.getElementById("tarjeta-tabla");
  var tarjetas = document.getElementById("vista-tarjetas");
  if (!tabla || !tarjetas) return;

  function texto(nodo) {
    return nodo.innerText.split("\n").map(function (t) { return t.trim(); }).filter(Boolean);
  }

  function construir() {
    var html = "";
    document.querySelectorAll("tr.item-row").forEach(function (fila) {
      var td = fila.querySelectorAll("td");
      if (td.length < 7) return;
      var nombre = texto(td[1])[0] || "";
      var marca = texto(td[1])[1] || "";
      var sku = texto(td[0])[0] || "";
      var pildora = td[5].querySelector("span");
      var botones = "";
      td[7].querySelectorAll("button").forEach(function (b) {
        botones += b.outerHTML;
      });
      html +=
        '<div class="item-row flex items-center justify-between gap-space-sm px-space-md py-space-sm border-t border-outline-variant/40" ' +
        'data-category="' + fila.getAttribute("data-category") + '" ' +
        'data-stock-status="' + fila.getAttribute("data-stock-status") + '">' +
        '<div class="min-w-0">' +
        '<p class="font-label-md text-label-md text-on-surface truncate">' + nombre + '</p>' +
        '<p class="font-label-sm text-label-sm text-on-surface-variant">' + sku + '</p>' +
        '<p class="font-label-sm text-label-sm text-on-surface-variant">' + texto(td[2])[0] + ' · stock ' + texto(td[3])[0] + ' (mín. ' + texto(td[4])[0] + ')' + (marca ? ' · ' + marca : '') + '</p>' +
        '</div>' +
        '<div class="flex items-center gap-space-sm shrink-0">' +
        (pildora ? pildora.outerHTML : '') +
        '<span class="font-label-md text-label-md text-on-surface">' + texto(td[6])[0] + '</span>' +
        botones +
        '</div></div>';
    });
    tarjetas.innerHTML = html;
  }

  window.cambiarVista = function () {
    var quiereTarjetas = tarjetas.classList.contains("hidden");
    if (quiereTarjetas) construir();
    tarjetas.classList.toggle("hidden", !quiereTarjetas);
    tabla.classList.toggle("hidden", quiereTarjetas);
  };

  construir();
})();
"""

cfg = {
    "src": "demo_3_inventario_y_reportes_para_pymes_kardex_pro",
    "dst": "sitio-web/demos/demo3-inventario-reportes/index.html",
    "slug": "demo3-inventario-reportes",
    "js": "sitio-web/assets/js/demo3.js",
    "titulo": "Demo · Kardex Pro: inventario y reportes para PYMEs | ReuKev",
    "desc": "Demo funcional de ReuKev: control de inventario (kardex) con movimientos, alertas de stock y reportes semanales para ferreterías y bodegas. Negocio ficticio.",
    "msg_barra": "Hola Kevin, vi la demo del sistema de inventario y reportes para PYMEs y quiero una así para mi negocio.",
    "imagenes": [
        "demo3/cemento.webp",
        "demo3/varilla.webp",
        "demo3/pintura.webp",
        "demo3/taladro.webp",
        "demo3/cable.webp",
        "demo3/discos.webp",
        "demo3/breaker.webp",
    ],
    "alts": [
        "Saco de cemento de 50 kg (producto de ejemplo)",
        "Varillas de acero corrugado de 12 mm (producto de ejemplo)",
        "Balde de pintura de un galón (producto de ejemplo)",
        "Taladro percutor de 650 W (producto de ejemplo)",
        "Rollo de cable eléctrico gemelo (producto de ejemplo)",
        "Disco de corte para amoladora (producto de ejemplo)",
        "Disyuntor breaker de 20 A (producto de ejemplo)",
    ],
    "fixes": [
        (
            "Sucursal Matriz · Quito Norte",
            "Sucursal Matriz · negocio ficticio",
        ),
        (
            ">Pymes Verificadas</span>",
            ">Datos simulados</span>",
        ),
        (
            ' href="https://wa.me/593900000000?text=Hola%20ReuKev,%20quiero%20cotizar%20el%20sistema%20de%20inventario%20de%20la%20demo"',
            ' href="#" data-wa="Hola Kevin, vi la demo del sistema de inventario y reportes para PYMEs y quiero una así para mi negocio."',
        ),
        (
            "Destinatario: +593 98 421 90XX",
            "Destinatario: propietario de la distribuidora (simulado)",
        ),
        (
            "Enviado por Sistema Kardex Pro · Pymes Quito",
            "Enviado por Kardex Pro (simulado) · negocio ficticio",
        ),
        (
            "© 2024 Kardex Pro · Distribuidora Morales. Todos los derechos reservados.",
            "© 2026 Kardex Pro · Distribuidora Morales (negocio ficticio). Todos los derechos reservados.",
        ),
    ],
    "ctas": [],
    "js_extra": VISTA_JS,
}

transform(cfg)

# --- HTML: nota de alcance en el pie ---
p = BASE + "sitio-web/demos/demo3-inventario-reportes/index.html"
h = open(p, encoding="utf-8").read()
viejo = "Desarrollado con ReuKev Systems</span></div></div></footer>"
assert viejo in h, "pie de demo3 no encontrado"
h = h.replace(
    viejo,
    "Desarrollado y respaldado por ReuKev Systems</span></div>\n"
    + NOTA_ALCANCE
    + "</footer>",
    1,
)

# --- HTML: botón "Cambiar vista" y contenedor de la vista de tarjetas ---
viejo_boton = (
    '<button class="hidden sm:flex items-center gap-space-xs px-space-md py-space-xs rounded-lg '
    "bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors "
    'text-label-sm font-label-sm" type="button">'
)
assert viejo_boton in h, "botón 'Cambiar vista' no encontrado"
h = h.replace(
    viejo_boton,
    viejo_boton[:-1] + ' data-on-click="cambiarVista()">',
    1,
)
viejo_wrap = '<div class="overflow-x-auto rounded-lg">'
assert h.count(viejo_wrap) == 1, "envoltorio de la tabla no único"
h = h.replace(
    viejo_wrap, '<div class="overflow-x-auto rounded-lg" id="tarjeta-tabla">', 1
)
marca_pie = "<!-- Table Footer / Quick Summary Stats -->"
assert marca_pie in h, "marca del pie de tabla no encontrada"
h = h.replace(
    marca_pie,
    '<div id="vista-tarjetas" class="hidden"></div>\n' + marca_pie,
    1,
)
open(p, "w", encoding="utf-8").write(h)

# --- HTML: las 2 fotos sin generar quedan como cuadro con icono ---
h, n = re.subn(
    r'<img[^>]*src="\.\./\.\./assets/img/demos/demo3/(?:varilla|breaker)\.webp"[^>]*/>',
    lambda m: PLACEHOLDER_FOTO,
    h,
)
assert n == 2, "se esperaban 2 fotos pendientes, encontradas: %d" % n
assert "varilla.webp" not in h and "breaker.webp" not in h
open(p, "w", encoding="utf-8").write(h)

# --- JS: mensajes simulados honestos + navegación del encabezado ---
j = BASE + "sitio-web/assets/js/demo3.js"
js = open(j, encoding="utf-8").read()
reemplazos = [
    (
        'encodeURIComponent("Estimado Proveedor Adelca / Indeco:',
        'encodeURIComponent("[Demo · mensaje simulado] Estimado Proveedor Adelca / Indeco:',
    ),
    (
        'alert("✅ Notificación enviada con éxito al WhatsApp del Propietario (+593 98 421 90XX). Incluye desglose de ventas y stock crítico de seguridad.");',
        'alert("✅ Notificación preparada (simulado): el resumen de ventas y el stock crítico de seguridad quedan listos para el WhatsApp del propietario.");',
    ),
]
for old, new in reemplazos:
    assert old in js, "reemplazo no encontrado en demo3.js: %r" % old[:70]
    js = js.replace(old, new)
assert "593 98 421" not in js and "593900000000" not in js
js += NAV_JS
open(j, "w", encoding="utf-8").write(js)
print("demo3: nota de alcance, fotos pendientes, mensajes simulados y navegación OK")

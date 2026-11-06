/* ReuKev — scripts de la portada: menú móvil y formulario que arma el mensaje.
   Depende de assets/js/wa.js (se carga antes): waLink() arma el enlace de WhatsApp
   con el único número del sitio. Sin scripts inline: CSP estricta. */
"use strict";

// --- Menú móvil ---
var boton = document.getElementById("boton-menu");
var menu = document.getElementById("menu-movil");
if (boton && menu) {
  boton.addEventListener("click", function () {
    var abierto = menu.classList.toggle("hidden") === false;
    boton.setAttribute("aria-expanded", String(abierto));
    boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    boton.innerHTML = abierto
      ? '<svg class="inline-block shrink-0 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
      : '<svg class="inline-block shrink-0 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';
  });
  menu.querySelectorAll("a").forEach(function (enlace) {
    enlace.addEventListener("click", function () {
      menu.classList.add("hidden");
      boton.setAttribute("aria-expanded", "false");
    });
  });
}

// --- Formulario: solo arma el mensaje de WhatsApp (no hay servidor) ---
var form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nombre = (document.getElementById("client-name") || {}).value || "";
    var negocio = (document.getElementById("client-business") || {}).value || "";
    var necesidad = (document.getElementById("client-need") || {}).value || "";
    var texto = "[Web · Formulario] Hola Kevin, soy " + nombre.trim() + ' de "' + negocio.trim() + '". Necesito: ' + necesidad.trim();
    window.open(waLink(texto), "_blank", "noopener");
  });
}

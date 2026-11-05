/* ReuKev — WhatsApp: un solo número en todo el sitio.
   Se usa desde las demos y desde cualquier página que necesite armar mensajes. */
const WHATSAPP = "593991371570";
const WA_VISIBLE = "+593 99 137 1570";

function waLink(mensaje) {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(mensaje);
}

/* Marca todos los enlaces data-wa="mensaje" con el número real al cargar. */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.setAttribute("href", waLink(el.getAttribute("data-wa")));
    el.setAttribute("rel", "noopener noreferrer");
    el.setAttribute("target", "_blank");
  });
});

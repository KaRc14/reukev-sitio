/* ReuKev — analítica de Vercel (Web Analytics), solo si está activa.
   El script vive en el mismo origen (/_vercel/insights/script.js), así que respeta la
   CSP estricta ('self') y no mete recursos de terceros.
   Solo se sondea en producción: en local esa ruta no existe y el sondeo dejaría un 404
   en consola. Si la analítica no está activada en el proyecto, el 404 queda en una
   petición única y el sitio sigue funcionando igual. */
"use strict";

(function () {
  var local = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if (local) return;

  fetch("/_vercel/insights/script.js", { method: "HEAD" })
    .then(function (respuesta) {
      if (!respuesta.ok) throw new Error("analítica no activada");
    })
    .then(function () {
      var script = document.createElement("script");
      script.defer = true;
      script.src = "/_vercel/insights/script.js";
      document.head.appendChild(script);
    })
    .catch(function () {
      /* Sin analítica no se rompe nada: el sitio funciona igual. */
    });
})();

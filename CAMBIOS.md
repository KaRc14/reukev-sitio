# CAMBIOS — registro de la reconstrucción del sitio

Reinicio del sitio (`F0`) y trabajo posterior, sesión a sesión. Los imports de Stitch
originales quedan en `stitch_sitio_web_freelance_reukev/` como referencia: el sitio publicado
se genera desde `sitio-web/` con las herramientas de `tools/`.

## F0 — Base local (7f5ee79)
- `tailwind.config.js` con la paleta ReuKev (#FFFFFF / #F8FAFC / acento #059669 / #0F172A / #475569).
- `src/tailwind.css` + CSS compilado en `sitio-web/assets/css/site.css`.
- Inter WOFF2 autoalojada en `sitio-web/assets/fonts/`, favicon completo, manifiesto, `assets/js/wa.js`.
- Sitios eliminados y reconstruidos desde cero; imports de Stitch conservados como fuente.

## F1 — Portada (1dd79b3)
- `sitio-web/index.html` reconstruida: 57 iconos Material Symbols → SVG inline (Lucide),
  imágenes remotas → locales, servicio, demos, precios, Programa Fundadores, FAQ,
  pie con el número real.

## F3 — Demos 1, 2 y 3 (esta sesión)
- **demo1** (`demos/demo1-catalogo-pedidos/`): catálogo Dulce Hogar migrado (34 iconos SVG,
  9 fotos propias con alt en español, textos ≥14 px, barra fija) + sección nueva
  "Estado de mi pedido" con panel Nuevo → Preparando → Entregado en localStorage.
- **demo2** (`demos/demo2-clinica-dental/`): clínica dental migrada (48 iconos SVG, 4 fotos,
  teléfono ficticio reemplazado, dirección rotulada como ficticia) + sección nueva
  "Confirmación y recordatorio por WhatsApp".
- **demo3** (`demos/demo3-inventario-reportes/`): **nueva** — kardex de Distribuidora Morales
  (ferretería ficticia) con 52 iconos SVG, filtros por buscador/categoría/stock crítico,
  modal de movimientos, simulación de reportes y navegación interna funcional.
  Nota de alcance "Estándar vs. Avanzado vs. extras" en el pie.
- Fotos de `assets/img/demos/`: 18 fotos WebP propias (457 KB).
  **Pendiente:** varilla y breaker no se pudieron generar por límite de créditos de la API de
  imágenes (se restablece 2026-11-06): quedan 2 cuadros con icono en la tabla y los
  `alt` ya escritos; al crear `demo3/varilla.webp` y `demo3/breaker.webp` se quitan los
  marcadores `PLACEHOLDER_FOTO` en `tools/scripts-demos/demo3.py`.

## F4 — Pulido y CSP (esta sesión)
- **Corregida la ruta de los JS de las demos**: apuntaba a `../../assets/sitio-web/assets/...`
  (no cargaban). Ahora `../../assets/js/demoN.js`.
- **Eventos inline convertidos** (`onclick`/`onsubmit`/`onkeyup`/`onchange`/`oninput` →
  `data-on-*` + despachador propio en el JS): necesario para una CSP sin `'unsafe-inline'`.
- Script inline de la portada movido a `sitio-web/assets/js/home.js` (usa `waLink()` de `wa.js`).
- Único `style=` inline eliminado (barra de envío gratis de demo1).
- Números falsos reemplazados por el número real (+593 99 137 1570) o por texto de ejemplo.

## F5 — Legal y publicación (esta sesión)
- `sitio-web/privacidad.html` (sin cookies ni rastreadores; demos con localStorage;
  enlaces a WhatsApp son de terceros), `sitio-web/404.html` amable.
- `sitio-web/robots.txt` y `sitio-web/sitemap.xml` (con `[DOMINIO]` por reemplazar).
- `netlify.toml`: publicación de `sitio-web` con **CSP estricta**
  (`default-src 'self'`, sin `'unsafe-inline'`/`'unsafe-eval'`), `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy` y `COOP`.

## F6 — Verificación y documentación (esta sesión)
- `tools/verify.mjs`: comprobaciones estáticas + Playwright con Chromium a 390 y 1440 px
  (sin desbordes, sin errores de consola, textos ≥14 px, archivos locales existentes) y
  pruebas funcionales de las 3 demos y de la portada. Resultado: **todo OK**.
- `tools/capturas.mjs`: capturas WebP (390 px, 1440 px y portada para `og:image`).
- `tools/scripts-demos/`: scripts reproducibles que regeneran las demos desde los imports
  de Stitch (`icons.py`, `build_demos.py`, `demo1.py`, `demo2.py`, `demo3.py`).
- `LEEME-como-publicar-y-editar.md`: cómo publicar en Netlify, cómo editar precios y textos,
  y los pendientes conocidos.

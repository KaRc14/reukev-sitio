# LEEME — cómo publicar y cómo editar este sitio

Sitio estático de ReuKev. No hay base de datos ni backend: solo HTML, CSS compilado,
imágenes y JS propios. Nada se carga desde CDN ni de Google.

## Publicar (Netlify, configuración ya incluida)

1. Reemplaza `[DOMINIO]` por tu dominio real en:
   - `sitio-web/index.html`, `sitio-web/privacidad.html`,
     `sitio-web/demos/*/index.html` (canonical, `og:url`, `og:image`),
   - `sitio-web/robots.txt` y `sitio-web/sitemap.xml`.
   `grep -rn "\[DOMINIO\]" sitio-web` los lista todos.
2. Sube el repositorio a GitHub y conecta Netlify al repo: toma `netlify.toml`
   (directorio publicado: `sitio-web`) y añade las cabeceras de seguridad (CSP incluida).
   No hace falta build en Netlify.
3. Verificación rápida antes de publicar: `node tools/verify.mjs` (ve más abajo).

> La CSP publicada es estricta (`script-src 'self'`, sin `'unsafe-inline'`). Si añades
> código nuevo, mantenlo en archivos `.js` dentro de `sitio-web/assets/js/` y usa
> eventos con `addEventListener`: un `<script>` inline o un `onclick=` se romperían en
> producción aunque en local parezcan funcionar.

## Editar el sitio

- **CSS**: edita tokens (colores, tamaños) en `tailwind.config.js` y ejecuta
  `npm run build:css` para recompilar `sitio-web/assets/css/site.css`. Para cambios
  puntuales de una página, añade la clase al HTML correspondiente (Tailwind la detecta solo
  si el archivo está en `content`).
- **Textos, precios y secciones**: edita directamente el HTML de la página
  (`sitio-web/index.html`, `sitio-web/privacidad.html`, `sitio-web/demos/*/index.html`).
  Las demos se pueden regenerar desde los imports de Stitch con
  `python3 tools/scripts-demos/demo1.py` (y `demo2.py`, `demo3.py`) — pero **esas
  regeneraciones pisan la edición manual**: haz los cambios puntuales dentro de esos
  scripts o en el HTML final.
- **Número de WhatsApp**: existe en un único lugar, la constante `WHATSAPP` de
  `sitio-web/assets/js/wa.js`. Los botones usan `data-wa="mensaje"` y el archivo arma el
  enlace al cargar. El número visible (+593 99 137 1570) está escrito a mano en la portada
  y en el pie.
- **Imágenes**: añade los WebP en `sitio-web/assets/img/` y referencia desde el HTML.
  Las capturas de las demos están en `sitio-web/assets/img/capturas/`.

## Comandos útiles

```
npm run build:css     # recompila el CSS con Tailwind
node tools/verify.mjs # verificación completa (estática + funcional en Chromium)
node tools/capturas.mjs# regenera las capturas WebP
npm run serve         # servidor local en http://localhost:8080 (sitio-web/)
```

`tools/verify.mjs` revisa: recursos externos, scripts/estilos inline, iconos sin migrar,
textos menores de 14 px, número de WhatsApp único, archivos referenciados que existan,
ausencia de desbordes y errores de consola a 390 y 1440 px, y el funcionamiento del menú
móvil, el formulario, el carrito de demo1, la agenda de demo2 y el kardex de demo3.

## Pendientes conocidos

- **2 fotos de demo3** (varilla y breaker) sin generar por límite de créditos de la API de
  imágenes; quedan cuadros con icono en su lugar. Cuando se restablezca el acceso
  (aprox. 2026-11-06), genera las fotos como `sitio-web/assets/img/demos/demo3/varilla.webp`
  y `breaker.webp` (700×700, ≤40 KB) y quita el bloque `PLACEHOLDER_FOTO` de
  `tools/scripts-demos/demo3.py` antes de regenerar.
- Dominio real para canonical/robots/sitemap.
- Revisar si se quiere página de "créditos" de las demos (se eliminó en el reinicio F0).

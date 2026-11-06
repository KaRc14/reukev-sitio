# LEEME — cómo publicar y cómo editar este sitio

Sitio estático de ReuKev. No hay base de datos ni backend: solo HTML, CSS compilado,
imágenes y JS propios. Nada se carga desde CDN ni de Google.

## Publicar (Vercel, configuración ya incluida)

El dominio ya está definido y puesto en todo el sitio: **`https://reukev.vercel.app`**
(index, privacidad, las 3 demos, `robots.txt` y `sitemap.xml`). Si algún día cambias a un
dominio propio, se reemplaza en una línea (incluye la barra final, que es lo que esperan
canonical y sitemap):

```
grep -rl "https://reukev.vercel.app" sitio-web | xargs sed -i 's|https://reukev.vercel.app|https://TU-NUEVO-DOMINIO|g'
```

### Pasos para publicar en Vercel

1. **Crea el repositorio en GitHub** (no existe todavía) y sube el proyecto:
   ```
   git remote add origin https://github.com/TU-USUARIO/reukev-sitio.git
   git push -u origin main
   ```
   (En la web de GitHub: *New repository* → Nombre, p. ej. `reukev-sitio` → *Create repository*;
   sin README ni `.gitignore` para no pisar los existentes.)
2. **Importa el repo en Vercel**: [vercel.com/new](https://vercel.com/new) →
   *Import Git Repository* → elige el repo.
   - Framework: **Other** (no hace falta ninguno).
   - **Build Command**: vacío. **Output Directory**: `sitio-web`
     (lo detecta solo desde `vercel.json`, que ya fija `outputDirectory`).
   - Instala solo en el primer deploy; los siguientes se publican solos con cada `git push`.
3. Verificación antes de publicar: `node tools/verify.mjs` (ve más abajo).

`vercel.json` lleva las mismas cabeceras de seguridad que `netlify.toml` (CSP estricta
incluida). `netlify.toml` se conserva por si algún día se publica también en Netlify.

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
- **Color de acento**: se define por página en `src/tailwind.css` con variables CSS. El verde
  por defecto vive en `:root` (portada y demo1); la demo2 usa `[data-tema="azul"]` y la demo3
  `[data-tema="grafito"]`, que se activan con `data-tema="..."` en el `<body>`
  (lo escribe `demo2.py`/`demo3.py` vía `cfg["tema"]`). Superficies y textos son fijos; para
  cambiar el acento toca las variables, no `tailwind.config.js`, y luego `npm run build:css`.
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
node tools/og.mjs     # regenera la imagen social og:image (4 JPG de 1200x630)
npm run serve         # servidor local en http://localhost:8080 (sitio-web/)
```

`npm run og` corre `tools/og.mjs`, que captura el hero con Playwright y lo pasa por
`tools/og.py` (PIL) para recortarlo a 1200×630 y guardarlo como JPEG en
`sitio-web/assets/img/og/`. Los 3 JPG de las demos salen de las capturas existentes con el
mismo `tools/og.py`. Debe ser **JPG/PNG**: WhatsApp y Facebook no pintan vistas previas
en WebP.

## Medir visitas y consultas
- **Vercel Web Analytics** (activar una sola vez): proyecto `reukev-sitio` en Vercel →
  pestaña *Analytics* → *Enable*. Es first-party (mismo origen), sin cookies y no rompe la
  CSP. Lo carga `sitio-web/assets/js/insights.js`, que solo sondea en producción y no
  inserta nada si la analítica está desactivada.
- **Consultas de WhatsApp**: cada botón manda el origen dentro del mensaje
  (`[Web · Precios]`, `[Web · Formulario]`, `[Demo 2 · Clínica]`…), así que en la bandeja de
  entrada se ve de qué sección o demo llegó cada cliente. Si añades un botón nuevo, pon la
  etiqueta al principio del `data-wa`.

## Estructura SEO (para añadir o quitar servicios)

- **Landing por servicio**: `sitio-web/servicios/<slug>/index.html`. Cada una lleva
  title/description/H1 con keyword + Ecuador, `rel=canonical` propio, JSON-LD
  (`ProfessionalService` + `Service` + `FAQPage` + `BreadcrumbList`) y og:image
  propia en `assets/img/og/servicio-<slug>.jpg`.
- Al crear una landing nueva hay que tocar 5 sitios: (1) crear el HTML,
  (2) `tailwind.config.js` (glob de contenido, si no las clases nuevas no existen en
  el CSS compilado), (3) `tools/estatico.mjs` y `tools/verify.mjs` (lista de
  páginas verificadas), (4) `sitemap.xml` (URL + `lastmod`), (5) `tools/og.mjs`
  (entrada en `VISTAS` para generar su imagen social).
- **Las 3 landings viven en `/servicios/<slug>/`** y sus enlaces internos usan `../`
  para volver al hub. La portada enlaza a cada servicio con texto descriptivo.
- Las demos se mantienen indexables con titles "Demo gratis: …" para no competir con
  las landings por la misma búsqueda.

`tools/verify.mjs` revisa: recursos externos, scripts/estilos inline, iconos sin migrar,
textos menores de 14 px, número de WhatsApp único, archivos referenciados que existan,
ausencia de desbordes y errores de consola a 390 y 1440 px, y el funcionamiento del menú
móvil, el formulario, el carrito de demo1, la agenda de demo2 y el kardex de demo3.

## Pendientes conocidos

- **2 fotos de demo3** (varilla y breaker): la API de imágenes no tiene créditos, así que
  se decidió dejar los cuadros con icono (funcionales y honestos) en la tabla. Si en el
  futuro se añaden créditos, genera las fotos como
  `sitio-web/assets/img/demos/demo3/varilla.webp` y `breaker.webp` (700×700, ≤40 KB) y
  quita el bloque `PLACEHOLDER_FOTO` de `tools/scripts-demos/demo3.py` antes de regenerar.
- **Dominio real**: definido y aplicado (`https://reukev.vercel.app`). Si se compra un
  dominio propio después, usa el `sed` de una línea del principio de este LEEME y
  actualiza también `Sitemap:` de `robots.txt`.
- Revisar si se quiere página de "créditos" de las demos (se eliminó en el reinicio F0).

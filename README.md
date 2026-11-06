# ReuKev · sitio freelance

Sitio portafolio de **ReuKev** (Kevin Ruiz): desarrollo web a medida para negocios de
Latinoamérica (Ecuador primero). Estático, sin base de datos ni backend: HTML, Tailwind
compilado, JS propio y WebP. Nada se carga desde CDN ni de Google.

**En línea:** https://reukev.vercel.app

## Qué hay dentro

| Sección | Qué es |
|---|---|
| Portada | Servicios, 3 demos funcionando, precios base, metodología y FAQ |
| `demos/demo1-catalogo-pedidos/` | Dulce Hogar — minimarket con catálogo, carrito y pedido armado para WhatsApp |
| `demos/demo2-clinica-dental/` | ProSonrisa — clínica dental con agenda de citas y confirmación/recordatorio |
| `demos/demo3-inventario-reportes/` | Kardex Pro — inventario (kardex) con movimientos, alertas de stock y reportes |
| `privacidad.html` | Política de privacidad: sin cookies ni rastreadores |

Las demos son **datos de ejemplo** (negocios ficticios) y muestran funciones reales:
el carrito suma, la agenda bloquea horarios, el kardex calcula existencias.

## Precios

Precios **base** en USD + IVA: Básico desde \$250 · Estándar desde \$490 · Avanzado desde
\$1.150. No son precios finales: cada proyecto se cotiza a medida por escrito antes de
empezar (ver [reukev.vercel.app/#precios-section](https://reukev.vercel.app/#precios-section)).

## Stack

- HTML estático + CSS compilado con Tailwind (`npm run build:css`)
- JavaScript propio, sin librerías ni `onclick` (requisito de la CSP estricta)
- Inter autoalojada (WOFF2), iconos SVG inline, imágenes WebP
- Fuente de verdad del sitio: `sitio-web/`. Las demos se reconstruyen desde
  `tools/scripts-demos/` (ojo: regenerar pisa ediciones manuales, ver LEEME)
- Publicación: **Vercel** (`vercel.json`: `outputDirectory: sitio-web` + cabeceras CSP);
  `netlify.toml` se conserva con las mismas cabeceras

## Comandos

```bash
npm run build:css      # recompila sitio-web/assets/css/site.css
node tools/verify.mjs  # verificación completa (estática + Chromium 390/1440 px)
node tools/capturas.mjs  # regenera las capturas WebP del sitio y las demos
node tools/og.mjs      # regenera la imagen social og:image (1200x630 JPG)
npm run serve          # servidor local en http://localhost:8080
```

## Estructura

```
sitio-web/            # sitio publicado (es lo que sirve Vercel)
  assets/css/         # CSS compilado (no editar, se genera desde src/)
  assets/js/          # wa.js (número único), home.js, demo1-3.js
  assets/img/         # logo, favicons, og/, capturas/, demos/
  demos/              # demo1, demo2, demo3 (cada una, una página completa)
src/tailwind.css      # hoja de entrada de Tailwind (tokens y variables de tema)
tailwind.config.js    # paleta y tipografías
tools/                # verificación, capturas, og:image y scripts de las demos
vercel.json           # publicación y cabeceras de seguridad (CSP estricta)
```

## Medición

- **Visitas:** Vercel Web Analytics (first-party, sin cookies, compatible con la CSP).
- **Consultas:** cada CTA de WhatsApp lleva el origen en el texto (`[Web · Header]`,
  `[Demo 2 · Clínica]`, …), así que cada mensaje que llega se sabe de dónde vino.

## Contacto

WhatsApp: +593 99 137 1570 · Kevin Ruiz (ReuKev) · atención remota en Latinoamérica.

Detalles de edición y publicación: [LEEME-como-publicar-y-editar.md](LEEME-como-publicar-y-editar.md).
Registro de cambios: [CAMBIOS.md](CAMBIOS.md).

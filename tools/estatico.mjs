/* ReuKev — comprobaciones estáticas sobre el HTML publicado.
   Reglas del proyecto: cero recursos externos, cero scripts/estilos inline,
   cero iconos Material Symbols, ningún texto por debajo de 14 px y un solo
   número de WhatsApp. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NUMERO = "593991371570";
const HOY = "2026-11-06";

function paginas() {
  return [
    "index.html",
    "privacidad.html",
    "404.html",
    "demos/demo1-catalogo-pedidos/index.html",
    "demos/demo2-clinica-dental/index.html",
    "demos/demo3-inventario-reportes/index.html",
  ];
}

function locales(h, archivo) {
  const faltan = [];
  const dir = path.dirname(path.join(RAIZ, "sitio-web", archivo));
  const refs = [...h.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
  for (const r of refs) {
    if (!/^(\.\.?\/|assets\/)/.test(r)) continue;
    const p = path.normalize(path.join(dir, r.split(/[?#]/)[0]));
    if (!fs.existsSync(p)) faltan.push(r);
  }
  return faltan;
}

/* Devuelve { ok, errores: [...], avisos: [...] } */
export function comprobar(archivo) {
  const errores = [];
  const avisos = [];
  const h = fs.readFileSync(path.join(RAIZ, "sitio-web", archivo), "utf-8");

  if (/material-symbols-outlined/.test(h)) errores.push("quedan iconos Material Symbols");
  if (/lh3\.googleusercontent|googleapis|gstatic|unpkg|jsdelivr|cdnjs/.test(h))
    errores.push("hay recursos externos remotos");
  if (/<script(?![^>]*src=)[^>]*>/.test(h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "")))
    errores.push("hay <script> sin src (inline)");
  if (/\son(click|submit|keyup|change|input)\s*=/.test(h))
    errores.push("hay eventos inline (onclick/onsubmit/...)");
  if (/\sstyle="/.test(h)) errores.push("hay atributos style= inline");
  const chicos = h.match(/(?<![-\w])(text-xs|text-sm|text-\[(?:9|10|11|12|13)px\])(?![-\w])/g);
  if (chicos) errores.push("textos por debajo de 14 px: " + [...new Set(chicos)].join(", "));
  for (const m of h.matchAll(/wa\.me\/(\d+)/g)) {
    if (m[1] !== NUMERO) errores.push("número de WhatsApp distinto: " + m[1]);
  }
  for (const m of h.matchAll(/<(?:script|link)[^>]*(?:src|href)="(https?:)?\/\/[^"]+"/g)) {
    if (/rel="canonical"/.test(m[0])) continue; // canonical: URL absoluta obligatoria, no carga nada
    errores.push("recurso remoto incrustado: " + m[0].slice(0, 80));
  }
  const faltan = locales(h, archivo);
  if (faltan.length) errores.push("archivos locales inexistentes: " + faltan.join(", "));

  const dominio = (h.match(/\[DOMINIO\]/g) || []).length;
  if (dominio) avisos.push(dominio + " [DOMINIO] por reemplazar al publicar");

  return { ok: errores.length === 0, errores, avisos, bytes: h.length };
}

export function comprobarTodo() {
  const filas = [];
  for (const p of paginas()) {
    const r = comprobar(p);
    filas.push({ pagina: p, ...r });
  }
  const extras = [
    ["robots.txt", "sitio-web/robots.txt"],
    ["sitemap.xml", "sitio-web/sitemap.xml"],
    ["netlify.toml", "netlify.toml"],
    ["vercel.json", "vercel.json"],
  ];
  for (const [nombre, rutaRel] of extras) {
    if (!fs.existsSync(path.join(RAIZ, rutaRel)))
      filas.push({ pagina: nombre, ok: false, errores: ["falta el archivo"], avisos: [] });
  }
  return filas;
}

export const NUMERO_WA = NUMERO;
export const FECHA = HOY;

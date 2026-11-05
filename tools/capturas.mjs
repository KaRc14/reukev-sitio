/* ReuKev — capturas de pantalla del sitio para el README y para og:image.
   Guarda PNG temporales y las convierte a WebP con Python (PIL).
   Uso: node tools/capturas.mjs */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { iniciarServidor, detenerServidor } from "./servidor.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = path.join(RAIZ, "sitio-web", "assets", "img", "capturas");
const ANCHOS = [390, 1440];
const VISTAS = [
  { url: "/", nombre: "home", og: "home-hero" },
  { url: "/demos/demo1-catalogo-pedidos/", nombre: "demo1-catalogo-pedidos", og: "demo1-catalogo-pedidos" },
  { url: "/demos/demo2-clinica-dental/", nombre: "demo2-clinica-dental", og: "demo2-clinica-dental" },
  { url: "/demos/demo3-inventario-reportes/", nombre: "demo3-inventario-reportes", og: "demo3-inventario-reportes" },
];

(async () => {
  const { srv, base } = await iniciarServidor();
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
  try {
    for (const vista of VISTAS) {
      for (const ancho of ANCHOS) {
        const ctx = await browser.newContext({ viewport: { width: ancho, height: 900 }, locale: "es-EC" });
        const page = await ctx.newPage();
        await page.goto(base + vista.url, { waitUntil: "networkidle" });
        await page.waitForTimeout(300);
        const png = path.join(DESTINO, "__tmp-" + vista.nombre + "-" + ancho + ".png");
        await page.screenshot({ path: png, fullPage: true });
        await ctx.close();
        console.log("captura " + vista.nombre + " @" + ancho);
      }
      // vista de portada para og:image (lo que se ve al entrar)
      const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "es-EC" });
      const p2 = await ctx2.newPage();
      await p2.goto(base + vista.url, { waitUntil: "networkidle" });
      await p2.waitForTimeout(300);
      await p2.screenshot({ path: path.join(DESTINO, "__tmp-" + vista.og + ".png") });
      await ctx2.close();
      console.log("captura " + vista.og + " (portada)");
    }
  } finally {
    await browser.close();
    detenerServidor(srv);
  }
  const py = spawnSync("python3", [path.join(RAIZ, "tools", "png_a_webp.py"), DESTINO], { stdio: "inherit" });
  if (py.status !== 0) process.exit(1);
})();

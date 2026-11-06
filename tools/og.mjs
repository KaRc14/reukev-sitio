/* ReuKev — imágenes sociales (og:image) 1200x630 JPG.
   Facebook y WhatsApp no pintan siempre la vista previa en WebP, así que se
   exporta a JPG con PIL (tools/og.py).

   Genera 5 imágenes: la portada (hero), el hub de servicios y las 3 landings.
   Cada CTA de la portada y de cada landing apunta a su propio JPG, así que al
   compartir un enlace concreto se ve su pantalla, no una imagen genérica.

   Uso: node tools/og.mjs */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import os from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { iniciarServidor, detenerServidor } from "./servidor.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = path.join(RAIZ, "sitio-web", "assets", "img", "og");
const TMP = path.join("/tmp", "opencode", "og-hero.png");

// selector -> nombre del JPG
const VISTAS = [
  { url: "/", selector: "#inicio", jpg: "reukev-og.jpg" },
  { url: "/servicios/", selector: "section", jpg: "servicios-hub.jpg" },
  { url: "/servicios/catalogo-whatsapp/", selector: "main section:first-of-type", jpg: "servicio-catalogo-whatsapp.jpg" },
  { url: "/servicios/agenda-citas/", selector: "main section:first-of-type", jpg: "servicio-agenda-citas.jpg" },
  { url: "/servicios/inventario-pymes/", selector: "main section:first-of-type", jpg: "servicio-inventario-pymes.jpg" },
];

(async () => {
  os.mkdirSync(DESTINO, { recursive: true });
  const { srv, base } = await iniciarServidor();
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
  try {
    for (const vista of VISTAS) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "es-EC" });
      const page = await ctx.newPage();
      await page.goto(base + vista.url, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      // El hero de la página, sin el header fijo (los heroes empiezan bajo el header).
      await page.locator(vista.selector).first().screenshot({ path: TMP });
      await ctx.close();
      console.log("captura " + vista.url + " -> " + TMP);
      const jpg = path.join(DESTINO, vista.jpg);
      const py = spawnSync("python3", [path.join(RAIZ, "tools", "og.py"), TMP, jpg], { stdio: "inherit" });
      if (py.status !== 0) process.exit(1);
    }
  } finally {
    await browser.close();
    detenerServidor(srv);
    if (os.existsSync(TMP)) os.unlinkSync(TMP);
  }
})();

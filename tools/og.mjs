/* ReuKev — imagen social (og:image) del sitio: 1200x630 JPG.
   Facebook y WhatsApp no pintan siempre la vista previa en WebP, así que se
   exporta a JPG con PIL (tools/og.py).
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

(async () => {
  os.mkdirSync(DESTINO, { recursive: true });
  const { srv, base } = await iniciarServidor();
  const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "es-EC" });
    const page = await ctx.newPage();
    await page.goto(base + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    // El hero con su mockup, sin el header fijo (#inicio empieza bajo main).
    await page.locator("#inicio").screenshot({ path: TMP });
    await ctx.close();
    console.log("captura del hero -> " + TMP);
  } finally {
    await browser.close();
    detenerServidor(srv);
  }
  const jpg = path.join(DESTINO, "reukev-og.jpg");
  const py = spawnSync("python3", [path.join(RAIZ, "tools", "og.py"), TMP, jpg], { stdio: "inherit" });
  if (py.status !== 0) process.exit(1);
  os.unlinkSync(TMP);
})();

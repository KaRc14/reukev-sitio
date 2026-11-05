/* ReuKev — verificación completa del sitio antes de publicar.
   1) comprobaciones estáticas (herramientas/estatico.mjs)
   2) pruebas funcionales con Chromium a 390 px (móvil) y 1440 px (escritorio)

   Uso: node tools/verify.mjs   (necesita: python3 y /usr/bin/chromium) */
import { chromium } from "playwright";
import { iniciarServidor, detenerServidor } from "./servidor.mjs";
import { comprobarTodo } from "./estatico.mjs";

const PUERTOS = [390, 1440];
const PAGINAS = [
  { url: "/", nombre: "home" },
  { url: "/privacidad.html", nombre: "privacidad" },
  { url: "/demos/demo1-catalogo-pedidos/", nombre: "demo1" },
  { url: "/demos/demo2-clinica-dental/", nombre: "demo2" },
  { url: "/demos/demo3-inventario-reportes/", nombre: "demo3" },
];

const fallos = [];
function falla(donde, que) {
  fallos.push(donde + " -> " + que);
}

async function abrir(browser, url, ancho) {
  const ctx = await browser.newContext({
    viewport: { width: ancho, height: 900 },
    locale: "es-EC",
  });
  const page = await ctx.newPage();
  const errores = [];
  page.on("pageerror", (e) => errores.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errores.push("console: " + m.text());
  });
  page.on("dialog", (d) => d.accept());
  await page.addInitScript(() => {
    window.__wa = [];
    window.__alertas = [];
    window.open = (u) => {
      window.__wa.push(String(u));
      return null;
    };
    window.alert = (m) => window.__alertas.push(String(m));
  });
  await page.goto(url, { waitUntil: "networkidle" });
  return { ctx, page, errores };
}

async function revisar(browser, url, nombre, ancho) {
  const { ctx, page, errores } = await abrir(browser, url, ancho);

  // 1. sin desborde horizontal
  const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (desborde > 1) falla(nombre + "@" + ancho, "desborde horizontal de " + desborde + " px");

  // 2. ningún texto visible por debajo de 14 px
  const chicos = await page.evaluate(() => {
    const malos = [];
    document.querySelectorAll("body *").forEach((el) => {
      const propio = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
      if (!propio) return;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      const px = parseFloat(cs.fontSize);
      if (px && px < 14) malos.push("<" + el.tagName.toLowerCase() + "> " + cs.fontSize + " " + String(el.className).slice(0, 50));
    });
    return malos;
  });
  if (chicos.length) falla(nombre + "@" + ancho, "textos < 14 px: " + chicos.slice(0, 4).join(" | "));

  if (errores.length) falla(nombre + "@" + ancho, errores.slice(0, 3).join(" | "));
  await ctx.close();
  return page;
}

/* ---------------- pruebas funcionales ---------------- */

async function fnHome(browser, base) {
  const { ctx, page } = await abrir(browser, base + "/", 390);
  await page.click("#boton-menu");
  const menuVisible = await page.evaluate(() => !document.getElementById("menu-movil").classList.contains("hidden"));
  if (!menuVisible) falla("home 390", "el menú móvil no se abre");
  await page.click("#boton-menu");
  const cerrado = await page.evaluate(() => document.getElementById("menu-movil").classList.contains("hidden"));
  if (!cerrado) falla("home 390", "el menú móvil no se cierra");

  await page.fill("#client-name", "Ana pruebas");
  await page.fill("#client-business", "Bodega La Esquina");
  await page.fill("#client-need", "catálogo con pedidos por WhatsApp");
  await page.click('button[type="submit"]');
  const urls = await page.evaluate(() => window.__wa);
  if (!urls.some((u) => u.includes("wa.me/593991371570"))) falla("home", "el formulario no arma el enlace de WhatsApp");
  else if (!decodeURIComponent(urls[0]).includes("Ana pruebas")) falla("home", "el mensaje no incluye los datos del formulario");

  const faq = await page.evaluate(() => document.querySelectorAll("details").length);
  if (faq < 8) falla("home", "el FAQ no tiene sus 8 preguntas");
  await ctx.close();
}

async function fnDemo1(browser, base) {
  const { ctx, page } = await abrir(browser, base + "/demos/demo1-catalogo-pedidos/", 390);
  await page.click('[data-on-click^="addToCart"]');
  await page.click('[data-on-click="triggerWhatsappSend()"]');
  const urls = await page.evaluate(() => window.__wa);
  if (!urls.some((u) => u.includes("wa.me/593991371570"))) falla("demo1", "el carrito no abre WhatsApp");
  const pedidos = await page.evaluate(() => localStorage.getItem("reukev-demo1-pedidos"));
  if (!pedidos || !JSON.parse(pedidos).length) falla("demo1", "el pedido no quedó guardado en el panel de estados");
  const panel = await page.evaluate(() => document.querySelectorAll("#panel-estados > div").length);
  if (panel < 1) falla("demo1", "el panel de estados no pinta los pedidos");
  await ctx.close();
}

async function fnDemo2(browser, base) {
  const { ctx, page } = await abrir(browser, base + "/demos/demo2-clinica-dental/", 390);
  await page.click('[data-on-click^="selectTreatment"]');
  await page.click('[data-on-click="confirmAppointment()"]');
  const urls = await page.evaluate(() => window.__wa);
  if (!urls.some((u) => u.includes("wa.me/593991371570"))) falla("demo2", "la confirmación no abre WhatsApp");
  const msg = await page.evaluate(() => document.getElementById("mensaje-recordatorio").textContent || "");
  if (!msg.includes("RESERVA")) falla("demo2", "el mensaje de confirmación no se armó");
  await page.click("#btn-preparar-recordatorio");
  const rec = await page.evaluate(() => document.getElementById("mensaje-recordatorio").textContent || "");
  if (!rec.includes("RECORDATORIO")) falla("demo2", "el recordatorio no se prepara");
  await ctx.close();
}

async function fnDemo3(browser, base) {
  const { ctx, page } = await abrir(browser, base + "/demos/demo3-inventario-reportes/", 1440);
  await page.fill("#kardexSearch", "cemento");
  await page.keyboard.press("Space");
  await page.keyboard.press("Backspace");
  const visibles = await page.evaluate(() =>
    [...document.querySelectorAll("tr.item-row")].filter((r) => r.style.display !== "none").length
  );
  if (visibles !== 1) falla("demo3", "el buscador no filtra la tabla (visibles=" + visibles + ")");

  await page.fill("#kardexSearch", "");
  await page.keyboard.press("Space");
  await page.keyboard.press("Backspace");
  await page.click('[data-on-click="filterCategory(\'Construcción\')"]');
  const porCat = await page.evaluate(() =>
    [...document.querySelectorAll("tr.item-row")].filter((r) => r.style.display !== "none").length
  );
  if (porCat < 1) falla("demo3", "el filtro por categoría no deja filas visibles");

  await page.click('[data-path="movimientos"]');
  const modal = await page.evaluate(() => !document.getElementById("quickMovementModal").classList.contains("hidden"));
  if (!modal) falla("demo3", "la navegación a Movimientos no abre el modal");
  await page.click('button[type="submit"]');
  const alertas = await page.evaluate(() => window.__alertas);
  if (!alertas.some((a) => a.includes("Movimiento registrado"))) falla("demo3", "el movimiento no se registró");
  const cerrado = await page.evaluate(() => document.getElementById("quickMovementModal").classList.contains("hidden"));
  if (!cerrado) falla("demo3", "el modal no se cierra tras confirmar");

  await page.click('[data-path="reportes-semanales"]');
  await page.waitForTimeout(400);
  const y = await page.evaluate(() => window.scrollY);
  if (y < 100) falla("demo3", "la navegación a Reportes no desplaza la página");

  // vista de tarjetas
  await page.click('[data-on-click="cambiarVista()"]');
  const estado = await page.evaluate(() => ({
    tarjetas: !document.getElementById("vista-tarjetas").classList.contains("hidden"),
    tabla: !document.getElementById("tarjeta-tabla").classList.contains("hidden"),
    nTarjetas: document.querySelectorAll("#vista-tarjetas .item-row").length,
    nFilas: document.querySelectorAll("tr.item-row").length,
  }));
  if (!estado.tarjetas || estado.tabla) falla("demo3", "la vista de tarjetas no alterna con la tabla");
  if (estado.nTarjetas !== estado.nFilas) falla("demo3", "las tarjetas no cubren todas las filas (" + estado.nTarjetas + "/" + estado.nFilas + ")");
  await page.fill("#kardexSearch", "pintura");
  await page.evaluate(() =>
    document.getElementById("kardexSearch").dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }))
  );
  const enTarjetas = await page.evaluate(() =>
    [...document.querySelectorAll("#vista-tarjetas .item-row")].filter((r) => r.style.display !== "none").length
  );
  if (enTarjetas !== 1) falla("demo3", "el buscador no filtra en vista de tarjetas");
  await ctx.close();
}

async function fnComunes(browser, base) {
  for (const p of PAGINAS) {
    const { ctx, page } = await abrir(browser, base + p.url, 1440);
    const barra = p.nombre.startsWith("demo");
    if (barra) {
      const txt = await page.evaluate(() => document.body.innerText);
      if (!txt.includes("Demo de ReuKev")) falla(p.nombre, "falta la barra 'Demo de ReuKev'");
      if (!txt.includes("Volver al sitio")) falla(p.nombre, "falta el enlace 'Volver al sitio'");
    }
    await ctx.close();
  }
}

/* ---------------- main ---------------- */

(async () => {
  console.log("== Estático ==");
  for (const f of comprobarTodo()) {
    if (f.ok) {
      console.log("OK   " + f.pagina + (f.avisos.length ? "  (" + f.avisos.join("; ") + ")" : ""));
    } else {
      console.log("FALLA " + f.pagina + ": " + f.errores.join("; "));
      fallos.push(f.pagina + " (estático) -> " + f.errores.join("; "));
    }
  }

  const { srv, base } = await iniciarServidor();
  let browser;
  try {
    browser = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
    console.log("\n== Responsive y consola (390 y 1440 px) ==");
    for (const p of PAGINAS) {
      for (const ancho of PUERTOS) await revisar(browser, base + p.url, p.nombre, ancho);
    }
    console.log("revisadas " + PAGINAS.length * PUERTOS.length + " páginas");

    console.log("\n== Funcional ==");
    await fnComunes(browser, base);
    await fnHome(browser, base);
    await fnDemo1(browser, base);
    await fnDemo2(browser, base);
    await fnDemo3(browser, base);
    console.log("pruebas funcionales completadas");
  } finally {
    if (browser) await browser.close();
    detenerServidor(srv);
  }

  console.log("\n" + "=".repeat(50));
  if (fallos.length) {
    console.log("RESULTADO: " + fallos.length + " problema(s)");
    fallos.forEach((f, i) => console.log(" " + (i + 1) + ". " + f));
    process.exit(1);
  }
  console.log("RESULTADO: todo OK");
})();

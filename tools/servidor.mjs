/* ReuKev — servidor estático local para las verificaciones (no es parte del sitio). */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUERTO = process.env.PUERTO || "8099";

export function raizSitio() {
  return path.join(RAIZ, "sitio-web");
}

export async function iniciarServidor() {
  const srv = spawn("python3", ["-m", "http.server", PUERTO, "--directory", raizSitio()], {
    stdio: "ignore",
  });
  const base = "http://127.0.0.1:" + PUERTO;
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(base + "/index.html");
      if (r.ok) return { srv, base };
    } catch { /* aún no levanta */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  srv.kill();
  throw new Error("no arrancó el servidor local en " + base);
}

export function detenerServidor(srv) {
  srv.kill("SIGTERM");
}

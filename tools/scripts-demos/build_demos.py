#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Migra los exports de Stitch de las 3 demos al sitio local de ReuKev."""

import os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from icons import ICONS

BASE = (
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) + "/"
)
SRC = "stitch_sitio_web_freelance_reukev/%s/code.html"


def svg(cls, name):
    if name not in ICONS:
        raise SystemExit("icono sin mapear: %r" % name)
    keep, tamano = [], None
    for c in cls.split():
        if c == "material-symbols-outlined":
            continue
        m = re.fullmatch(r"text-\[(\d+)px\]", c)
        if m:
            tamano = m.group(1)
            continue
        keep.append(c)
    if not tamano:
        tamano = "20"
    clases = " ".join(
        ["inline-block", "shrink-0", "w-[%spx]" % tamano, "h-[%spx]" % tamano] + keep
    )
    return (
        '<svg class="%s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>'
        % (clases, ICONS[name])
    )


HEAD_PLANTILLA = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>%(titulo)s</title>
<meta name="description" content="%(desc)s"/>
<link rel="canonical" href="[DOMINIO]/demos/%(slug)s/"/>
<meta name="robots" content="index, follow"/>
<meta name="theme-color" content="%(theme_color)s"/>
<meta property="og:type" content="website"/>
<meta property="og:locale" content="es_LA"/>
<meta property="og:site_name" content="ReuKev"/>
<meta property="og:title" content="%(titulo)s"/>
<meta property="og:description" content="%(desc)s"/>
<meta property="og:image" content="[DOMINIO]/assets/img/capturas/%(slug)s.webp"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="icon" href="../../assets/img/favicon.svg" type="image/svg+xml"/>
<link rel="icon" href="../../assets/img/favicon.ico" sizes="any"/>
<link rel="apple-touch-icon" href="../../assets/img/favicon-192.png"/>
<link rel="stylesheet" href="../../assets/css/site.css"/>
<script src="../../assets/js/wa.js" defer></script>
<script src="../../%(src_js)s" defer></script>
</head>"""


DISPATCHER_JS = r"""
/* Eventos del diseño original (onclick, onsubmit...): el HTML los lleva como
   data-on-click="funcion('arg')" y aquí se re-adjuntan, sin 'unsafe-inline'. */
(function () {
  "use strict";
  var TIPOS = {
    "data-on-click": "click",
    "data-on-submit": "submit",
    "data-on-keyup": "keyup",
    "data-on-change": "change",
    "data-on-input": "input"
  };

  function partirArgumentos(txt) {
    var partes = [], actual = "", comilla = null;
    for (var i = 0; i < txt.length; i++) {
      var c = txt.charAt(i);
      if (comilla) {
        actual += c;
        if (c === comilla) comilla = null;
      } else if (c === "'" || c === '"') {
        comilla = c;
        actual += c;
      } else if (c === ",") {
        partes.push(actual.trim());
        actual = "";
      } else {
        actual += c;
      }
    }
    if (actual.trim()) partes.push(actual.trim());
    return partes;
  }

  function valor(parte, evento, elemento) {
    if (parte === "event") return evento;
    if (parte === "this") return elemento;
    var m = /^'([\s\S]*)'$/.exec(parte) || /^"([\s\S]*)"$/.exec(parte);
    if (m) return m[1];
    if (/^-?\d+(\.\d+)?$/.test(parte)) return Number(parte);
    return parte;
  }

  function ejecutar(evento, elemento, expr) {
    var i = expr.indexOf("(");
    var j = expr.lastIndexOf(")");
    if (i < 0 || j < i) return;
    var fn = window[expr.slice(0, i).trim()];
    if (typeof fn !== "function") return;
    var args = partirArgumentos(expr.slice(i + 1, j)).map(function (p) {
      return valor(p, evento, elemento);
    });
    fn.apply(elemento, args);
  }

  Object.keys(TIPOS).forEach(function (attr) {
    document.addEventListener(TIPOS[attr], function (evento) {
      var t = evento.target;
      var el = t && t.closest ? t.closest("[" + attr + "]") : null;
      if (!el) return;
      var expr = el.getAttribute(attr);
      if (expr) ejecutar(evento, el, expr);
    });
  });
})();
"""


def transform(cfg):
    h = open(BASE + SRC % cfg["src"], encoding="utf-8").read()

    # 1. cabecera propia (sin CDN ni Google Fonts)
    plantilla = dict(cfg)
    plantilla["src_js"] = cfg["js"].replace("sitio-web/", "")
    plantilla["theme_color"] = cfg.get("theme_color", "#FFFFFF")
    i = h.index("<body")
    h = HEAD_PLANTILLA % plantilla + "\n" + h[i:]
    if cfg.get("tema"):
        h = h.replace("<body", '<body data-tema="%s"' % cfg["tema"], 1)

    # 2. Material Symbols -> SVG inline
    def repl(m):
        return svg(m.group(1), m.group(2).strip())

    h, n_icon = re.subn(
        r'<span class="([^"]*\bmaterial-symbols-outlined\b[^"]*)"\s*>\s*([a-z_0-9]+)\s*</span>',
        repl,
        h,
    )

    # 3. imagenes remotas -> fotos propias (por orden de aparicion)
    urls = []
    for u in re.findall(r'https://lh3\.googleusercontent\.com/[^"\']+', h):
        if u not in urls:
            urls.append(u)
    assert len(urls) == len(cfg["imagenes"]), "%s: %d remotas vs %d locales" % (
        cfg["src"],
        len(urls),
        len(cfg["imagenes"]),
    )
    for u, loc in zip(urls, cfg["imagenes"]):
        local = "../../assets/img/demos/%s" % loc
        h = h.replace(u, local)
        # el export usa data-alt con prompts en inglés: se cambia por alt corto en español
        alt = cfg["alts"][cfg["imagenes"].index(loc)]
        pat = re.compile(r'<img\b[^>]*src="' + re.escape(local) + r'"[^>]*>')

        def _fija(m):
            etiqueta = m.group(0)
            nueva = re.sub(r'\s*(?:data-alt|alt)="[^"]*"', "", etiqueta)
            nueva = nueva.replace("<img", '<img alt="%s"' % alt, 1)
            if "loading=" not in nueva:
                nueva = nueva.replace("<img", '<img loading="lazy"', 1)
            if "decoding=" not in nueva:
                nueva = nueva.replace("<img", '<img decoding="async"', 1)
            return nueva

        h = pat.sub(_fija, h)

    # 4. hover del acento + textos por debajo de 14px
    h = h.replace("hover:bg-primary-container", "hover:bg-primary-hover")
    n_small = 0
    for bad in [
        "text-xs",
        "text-sm",
        "text-[9px]",
        "text-[10px]",
        "text-[11px]",
        "text-[12px]",
        "text-[13px]",
    ]:
        pat = re.compile(r"(?<![-\w])" + re.escape(bad) + r"(?![-\w])")
        n_small += len(pat.findall(h))
        h = pat.sub("text-label-sm", h)

    # 4b. eventos inline (onclick/onsubmit...) -> data-on-* (CSP sin 'unsafe-inline')
    n_handlers = 0
    for ev in ["click", "submit", "keyup", "change", "input"]:
        pat = re.compile(r"\s+on" + ev + r'="([^"]*)"')
        n_handlers += len(pat.findall(h))
        h = pat.sub(lambda m, ev=ev: ' data-on-%s="%s"' % (ev, m.group(1)), h)

    # 5. barra fija: "Demo de ReuKev · Volver al sitio · Quiero una así"
    for old, new in [
        ("Demo funcional creada por ReuKev", "Demo de ReuKev"),
        ("Demo creada por ReuKev", "Demo de ReuKev"),
        ("Demo 1 interactiva", "Demo de ReuKev"),
        ("Demo 2 interactiva", "Demo de ReuKev"),
        ("Demo 3 interactiva", "Demo de ReuKev"),
        (">Volver al sitio principal<", ">Volver al sitio<"),
        ("Volver a ReuKev", "Volver al sitio"),
        ("Volver al sitio principal", "Volver al sitio"),
    ]:
        h = h.replace(old, new)

    # 6. los enlaces de "volver" apuntan al home y los de "quiero" a WhatsApp
    h = re.sub(
        r'<a([^>]*?)href="#">(\s*Volver al sitio\s*)</a>',
        r'<a\1href="../../index.html">\2</a>',
        h,
    )
    h = re.sub(
        r'<a([^>]*?)href="#"([^>]*data-path="[^"]*"[^>]*)>(\s*Volver al sitio\s*)</a>',
        r'<a\1href="../../index.html"\2>\3</a>',
        h,
    )
    # 7. un solo numero de WhatsApp en todo el sitio
    h = cfg.get("numero_fix", lambda x: x)(h)

    # 8. CTA -> data-wa (wa.js arma el enlace con el numero real)
    def cta(m):
        clase, texto = m.group(1), m.group(2)
        if "data-wa" in clase:
            return m.group(0)
        return '<a class="%s" href="#" data-wa="%s">%s</a>' % (
            clase,
            cfg["msg_barra"],
            texto,
        )

    h = re.sub(r'<a class="([^"]*)" href="#">([^<]*[Qq]uiero[^<]*)</a>', cta, h)
    for old, new in cfg.get("ctas", []):
        assert old in h, "CTA no encontrada en %s: %s" % (cfg["src"], old[:70])
        h = h.replace(old, new)
    # 9. arreglos puntuales
    for old, new in cfg.get("fixes", []):
        if old not in h:
            raise SystemExit("fix no encontrado en %s: %r" % (cfg["src"], old[:70]))
        h = h.replace(old, new)

    # 10. JS inline -> archivo propio (CSP sin 'unsafe-inline')
    m = re.search(r"<script>(.*?)</script>", h, re.S)
    assert m, "sin JS inline en %s" % cfg["src"]
    js = m.group(1)
    h = h[: m.start()] + h[m.end() :]
    js += "\n" + cfg.get("js_extra", "") + "\n" + DISPATCHER_JS
    open(BASE + cfg["js"], "w", encoding="utf-8").write(js.strip() + "\n")

    open(BASE + cfg["dst"], "w", encoding="utf-8").write(h)
    print(
        "%-52s iconos=%-3d fotos=%-2d textos<14px=%-3d eventos=%-3d"
        % (cfg["src"], n_icon, len(urls), n_small, n_handlers)
    )

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Demo 2: clínica dental con agenda de citas (negocio y equipo ficticios)."""

import re, sys

import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_demos import transform, BASE

CONFIRMACION_HTML = """
<!-- ============ PASO SIMULADO: CONFIRMACION Y RECORDATORIO POR WHATSAPP ============ -->
<section id="confirmacion" class="w-full bg-surface-container-lowest py-space-xl border-t border-outline-variant/30">
<div class="max-w-[1200px] mx-auto px-margin">
<div class="bg-surface rounded-xl shadow-sm border border-outline-variant/60 p-space-lg grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-center">
<div>
<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold">
<svg class="inline-block shrink-0 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
Paso simulado
</span>
<h2 class="font-headline-sm text-headline-sm text-on-surface mt-2">Confirmación y recordatorio por WhatsApp</h2>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">Así se ve el paso final en una clínica real: al reservar, el sistema arma el mensaje de confirmación y deja listo el recordatorio. Tú solo eliges a quién enviarlo.</p>
<ul class="flex flex-col gap-2 mt-space-sm font-body-md text-body-md text-on-surface-variant">
<li class="flex items-start gap-2"><span class="text-primary font-bold">1.</span><span>El paciente reserva y ve su resumen en pantalla.</span></li>
<li class="flex items-start gap-2"><span class="text-primary font-bold">2.</span><span>Se prepara el mensaje de confirmación con fecha, hora y profesional.</span></li>
<li class="flex items-start gap-2"><span class="text-primary font-bold">3.</span><span>El recordatorio se arma con un botón, listo para enviar el día anterior.</span></li>
</ul>
</div>
<div class="bg-surface-container-low rounded-xl p-space-md">
<span class="font-label-md text-label-md text-on-surface">Mensaje preparado</span>
<pre id="mensaje-recordatorio" class="mt-2 whitespace-pre-wrap font-label-sm text-label-sm text-on-surface-variant bg-surface rounded-lg p-space-sm border border-outline-variant/60">Aún no has reservado. Elige tratamiento, profesional, fecha y hora, y confirma tu cita para ver el mensaje.</pre>
<div class="flex flex-col sm:flex-row gap-space-sm mt-space-sm">
<a id="btn-enviar-confirmacion" class="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-on-primary font-label-md text-label-md px-space-md py-2.5 rounded transition-colors" href="#" rel="noopener noreferrer" target="_blank">
<svg class="inline-block shrink-0 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 18 0 1 0 4 16.1L2 22Z"/></svg>
<span>Abrir en WhatsApp</span>
</a>
<button id="btn-preparar-recordatorio" type="button" class="inline-flex items-center justify-center gap-2 bg-surface hover:bg-surface-container text-on-surface font-label-md text-label-md px-space-md py-2.5 rounded border border-outline-variant transition-colors">
<svg class="inline-block shrink-0 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
<span>Preparar recordatorio</span>
</button>
</div>
<p class="font-label-sm text-label-sm text-on-surface-variant mt-2">Demo: nada se envía solo. El envío automático con la API oficial de WhatsApp se cotiza aparte.</p>
</div>
</div>
</div>
</section>
"""

NUEVO_CONFIRM = """function confirmAppointment() {
      if (!state.patientName || !state.patientPhone) {
        alert("Escribe tu nombre y tu teléfono para continuar.");
        return;
      }
      const msg =
        "🗓️ *RESERVA DE CITA (DEMO)*\\n" +
        "--------------------------------------\\n" +
        "• *Paciente:* " + state.patientName + " (" + state.patientPhone + ")\\n" +
        "• *Tratamiento:* " + state.treatment + " ($" + parseInt(state.price) + ")\\n" +
        "• *Profesional:* " + state.doctor + "\\n" +
        "• *Fecha:* " + state.date + " - " + state.time + "\\n" +
        "--------------------------------------\\n" +
        "🤖 *Estado:* turno pre-reservado. Pendiente de confirmación.";

      // Paso simulado: se arma el mensaje de confirmacion y se deja listo el recordatorio.
      const bloque = document.getElementById("mensaje-recordatorio");
      if (bloque) {
        bloque.textContent = msg;
        bloque.dataset.confirmacion = msg;
      }
      const boton = document.getElementById("btn-enviar-confirmacion");
      if (boton) boton.setAttribute("href", "https://wa.me/593991371570?text=" + encodeURIComponent(msg));
      const panel = document.getElementById("confirmacion");
      if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
      window.open("https://wa.me/593991371570?text=" + encodeURIComponent(msg), "_blank", "noopener");
    }

    document.getElementById("btn-preparar-recordatorio")?.addEventListener("click", function () {
      const bloque = document.getElementById("mensaje-recordatorio");
      if (!bloque || !bloque.dataset.confirmacion) return;
      bloque.textContent =
        "🔔 *RECORDATORIO DE CITA (DEMO)*\\n" +
        "Hola " + state.patientName.split(" ")[0] + ", te recordamos tu cita en ProSonrisa (negocio ficticio):\\n" +
        "• " + state.treatment + "\\n" +
        "• " + state.date + " a las " + state.time + "\\n" +
        "• Con " + state.doctor + "\\n" +
        "¿Podrás asistir? Responde SI o NO para liberar el horario.";
      const boton = document.getElementById("btn-enviar-confirmacion");
      if (boton) boton.setAttribute("href", "https://wa.me/593991371570?text=" + encodeURIComponent(bloque.textContent));
    });"""

ICONO_CHEV = (
    '<svg class="inline-block shrink-0 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>'
)
ICONO_CHECK = (
    '<svg class="inline-block shrink-0 w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>'
)
ICONO_CIRC = (
    '<svg class="inline-block shrink-0 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>'
)
ICONO_CHECKS = ICONO_CHECK.replace("w-[18px] h-[18px]", "w-6 h-6")

cfg = {
    "src": "demo_2_cl_nica_dental_con_agenda_de_citas_prosonrisa",
    "dst": "sitio-web/demos/demo2-clinica-dental/index.html",
    "slug": "demo2-clinica-dental",
    "js": "sitio-web/assets/js/demo2.js",
    "titulo": "Demo · ProSonrisa: clínica dental con agenda de citas | ReuKev",
    "desc": "Demo funcional de ReuKev: agenda de citas para clínica dental con selección de tratamiento, profesional, fecha y hora, más confirmación por WhatsApp. Negocio ficticio.",
    "msg_barra": "Hola Kevin, vi la demo de la clínica dental con agenda de citas y quiero una así para mi negocio.",
    "imagenes": [
        "demo2/doctora.webp",
        "demo2/doctor.webp",
        "demo2/resina.webp",
        "demo2/blanqueamiento.webp",
        "demo2/doctora.webp",
        "demo2/doctor.webp",
    ],
    "alts": [
        "Doctora de la clínica de ejemplo (negocio ficticio)",
        "Doctor de la clínica de ejemplo (negocio ficticio)",
        "Sala de atención de la clínica de ejemplo",
        "Equipo de la clínica de ejemplo",
        "Doctora de la clínica de ejemplo (negocio ficticio)",
        "Doctor de la clínica de ejemplo (negocio ficticio)",
    ],
    "fixes": [
        (
            "Atención Odontológica Garantizada • Quito Norte",
            "Atención odontológica garantizada · Negocio ficticio de demostración",
        ),
        (
            '<span class="font-semibold text-on-surface">+593 2 299 8000</span>',
            '<span class="font-semibold text-on-surface">+593 99 137 1570</span>',
        ),
        (
            "Eloy Alfaro, Edificio Corporativo Médico, Piso 3, Quito, Ecuador",
            "Dirección de ejemplo · negocio ficticio",
        ),
        ("Lun - Sáb: 08:30 - 18:30", "Lun a sáb: 08:30 - 18:30"),
        (
            "Atención personalizada en Quito Norte. Agenda tu cita",
            "Atención personalizada. Agenda tu cita",
        ),
    ],
    "ctas": [],
    "js_extra": "",
}

transform(cfg)

# --- HTML: CTA de la barra con icono SVG -> data-wa ---
p = BASE + "sitio-web/demos/demo2-clinica-dental/index.html"
h = open(p, encoding="utf-8").read()
h, n = re.subn(
    r'<a([^>]*?)href="#">(\s*Quiero[^<]*(?:<svg[^>]*>.*?</svg>[^<]*)*)</a>',
    lambda m: (
        '<a%shref="#" data-wa="%s">%s</a>' % (m.group(1), cfg["msg_barra"], m.group(2))
    ),
    h,
)
assert n >= 1, "CTA de la barra no encontrada"

# --- HTML: paso de confirmacion y recordatorio (mismo h, ya con el CTA) ---
assert "</main>" in h
h = h.replace("</main>", CONFIRMACION_HTML.strip() + "\n</main>", 1)
open(p, "w", encoding="utf-8").write(h)

# --- JS: iconos SVG, numero unico, confirmacion simulada ---
j = BASE + "sitio-web/assets/js/demo2.js"
js = open(j, encoding="utf-8").read()
reemplazos = [
    ("patientPhone: '+593 99 824 1092'", "patientPhone: '+593 99 137 1570'"),
]
js = re.sub(
    r"icon\.textContent = 'radio_button_unchecked';\n\s*icon\.className = 'doctor-check material-symbols-outlined text-surface-dim text-\[24px\]';",
    "icon.innerHTML = '"
    + ICONO_CIRC
    + "';\n        icon.className = 'doctor-check inline-block text-surface-dim';",
    js,
)
js = re.sub(
    r"activeIcon\.textContent = 'check_circle';\n\s*activeIcon\.className = 'doctor-check material-symbols-outlined text-primary text-\[24px\]';",
    "activeIcon.innerHTML = '"
    + ICONO_CHECKS
    + "';\n        activeIcon.className = 'doctor-check inline-block text-primary';",
    js,
)
for old, new in reemplazos:
    if old not in js:
        raise SystemExit("reemplazo no encontrado: %r" % old[:90])
    js = js.replace(old, new)

m = re.search(r"    function confirmAppointment\(\) \{.*?\n    \}\n", js, re.S)
assert m, "confirmAppointment no encontrada"
js = js[: m.start()] + NUEVO_CONFIRM + "\n" + js[m.end() :]
js = js.replace(
    "api.whatsapp.com/send?phone=593998241092", "https://wa.me/593991371570"
)
assert "593998241092" not in js and "material-symbols-outlined" not in js
open(j, "w", encoding="utf-8").write(js)
print("demo2: iconos SVG, numero unico y confirmacion simulada OK")

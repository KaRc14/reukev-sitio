let state = {
      treatment: 'Limpieza Dental Profunda & Profilaxis',
      duration: '45 min',
      price: '35.00',
      doctor: 'Dra. Valeria Paredes',
      date: 'Miércoles 16 de Octubre',
      time: '15:30 (Tarde)',
      patientName: 'Carlos Mendoza',
      patientPhone: '+593 99 137 1570'
    };

    function selectTreatment(name, duration, price, el) {
      state.treatment = name;
      state.duration = duration;
      state.price = price;

      // Update UI classes
      document.querySelectorAll('.treatment-card').forEach(card => {
        card.classList.remove('bg-primary/5', 'shadow-md');
        card.classList.add('shadow-sm');
        const btn = card.querySelector('button');
        if (btn) {
          btn.className = "w-full py-2 px-3 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md flex items-center justify-center gap-1 transition-all";
          btn.innerHTML = '<span>Seleccionar</span><svg class="inline-block shrink-0 w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
        }
      });

      el.classList.add('bg-primary/5', 'shadow-md');
      el.classList.remove('shadow-sm');
      const activeBtn = el.querySelector('button');
      if (activeBtn) {
        activeBtn.className = "w-full py-2 px-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-1 shadow-sm";
        activeBtn.innerHTML = '<svg class="inline-block shrink-0 w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg> Seleccionado';
      }

      updateSummary();
    }

    function selectDoctor(doctorName, el) {
      state.doctor = doctorName;

      document.querySelectorAll('.doctor-card').forEach(card => {
        card.classList.remove('bg-primary/5');
        const icon = card.querySelector('.doctor-check');
        if (icon) {
          icon.innerHTML = '<svg class="inline-block shrink-0 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>';
        icon.className = 'doctor-check inline-block text-surface-dim';
        }
      });

      el.classList.add('bg-primary/5');
      const activeIcon = el.querySelector('.doctor-check');
      if (activeIcon) {
        activeIcon.innerHTML = '<svg class="inline-block shrink-0 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>';
        activeIcon.className = 'doctor-check inline-block text-primary';
      }

      updateSummary();
    }

    function selectDate(dateString, el) {
      state.date = dateString;

      document.querySelectorAll('.date-btn').forEach(btn => {
        btn.className = "date-btn p-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-center transition-all flex flex-col items-center";
        const dayName = btn.querySelector('span:first-child');
        const dayNumber = btn.querySelector('span:nth-child(2)');
        const cupo = btn.querySelector('span:last-child');
        if (dayName) dayName.className = "font-label-sm text-label-sm text-outline uppercase font-semibold";
        if (dayNumber) dayNumber.className = "font-headline-sm text-headline-sm text-on-surface font-bold";
        if (cupo) cupo.className = "text-label-sm text-primary font-medium mt-1";
      });

      el.className = "date-btn p-3 rounded-lg bg-primary text-on-primary text-center transition-all flex flex-col items-center shadow-sm";
      const activeDay = el.querySelector('span:first-child');
      const activeNum = el.querySelector('span:nth-child(2)');
      const activeCupo = el.querySelector('span:last-child');
      if (activeDay) activeDay.className = "font-label-sm text-label-sm text-primary-fixed uppercase font-semibold";
      if (activeNum) activeNum.className = "font-headline-sm text-headline-sm text-on-primary font-bold";
      if (activeCupo) {
        activeCupo.className = "text-label-sm text-primary-fixed font-semibold mt-1";
        activeCupo.textContent = "¡Elegido!";
      }

      updateSummary();
    }

    function selectTime(timeString, el) {
      state.time = timeString;

      document.querySelectorAll('.time-btn').forEach(btn => {
        btn.className = "time-btn py-2.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container font-label-md text-label-md text-on-surface font-medium text-center transition-all";
        btn.innerHTML = btn.textContent.replace('check', '').trim();
      });

      el.className = "time-btn py-2.5 px-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold text-center transition-all shadow-sm flex items-center justify-center gap-1";
      el.innerHTML = '<svg class="inline-block shrink-0 w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg> ' + timeString.split(' ')[0];

      updateSummary();
    }

    function updateSummary() {
      const nameInput = document.getElementById('patient-name');
      const phoneInput = document.getElementById('patient-phone');
      if (nameInput) state.patientName = nameInput.value || 'Carlos Mendoza';
      if (phoneInput) state.patientPhone = phoneInput.value || '+593 99 824 1092';

      // Actualizar tarjeta resumen
      document.getElementById('summary-treatment').textContent = state.treatment;
      document.getElementById('summary-duration').textContent = '(' + state.duration + ')';
      document.getElementById('summary-doctor').textContent = state.doctor;
      document.getElementById('summary-datetime').textContent = state.date + ' • ' + state.time;
      document.getElementById('summary-price').textContent = '$' + state.price + ' USD';

      // Actualizar vista previa WhatsApp
      document.getElementById('wa-patient').textContent = state.patientName + ' (' + state.patientPhone + ')';
      document.getElementById('wa-treatment').textContent = state.treatment + ' ($' + parseInt(state.price) + ')';
      document.getElementById('wa-doctor').textContent = state.doctor;
      document.getElementById('wa-date').textContent = state.date + ' - ' + state.time.split(' ')[0];
    }

function confirmAppointment() {
      if (!state.patientName || !state.patientPhone) {
        alert("Escribe tu nombre y tu teléfono para continuar.");
        return;
      }
      const msg =
        "🗓️ *RESERVA DE CITA (DEMO)*\n" +
        "--------------------------------------\n" +
        "• *Paciente:* " + state.patientName + " (" + state.patientPhone + ")\n" +
        "• *Tratamiento:* " + state.treatment + " ($" + parseInt(state.price) + ")\n" +
        "• *Profesional:* " + state.doctor + "\n" +
        "• *Fecha:* " + state.date + " - " + state.time + "\n" +
        "--------------------------------------\n" +
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
        "🔔 *RECORDATORIO DE CITA (DEMO)*\n" +
        "Hola " + state.patientName.split(" ")[0] + ", te recordamos tu cita en ProSonrisa (negocio ficticio):\n" +
        "• " + state.treatment + "\n" +
        "• " + state.date + " a las " + state.time + "\n" +
        "• Con " + state.doctor + "\n" +
        "¿Podrás asistir? Responde SI o NO para liberar el horario.";
      const boton = document.getElementById("btn-enviar-confirmacion");
      if (boton) boton.setAttribute("href", "https://wa.me/593991371570?text=" + encodeURIComponent(bloque.textContent));
    });
  

(function () {
  /* La banda de urgencias y horario es el primer bloque de <main>, justo bajo el
     header fijo: se iguala el padding superior de <main> a la altura real del
     header (cambia entre móvil y escritorio porque la barra de demo se reordena). */
  var header = document.querySelector('header');
  var main = document.querySelector('main');
  if (!header || !main) return;
  function ajustar() {
    main.style.paddingTop = header.getBoundingClientRect().height + 'px';
  }
  ajustar();
  window.addEventListener('resize', ajustar);
  window.addEventListener('orientationchange', ajustar);
})();

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

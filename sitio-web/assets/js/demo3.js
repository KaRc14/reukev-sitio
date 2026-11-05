let currentRole = 'admin';

    function setRole(role) {
      currentRole = role;
      const adminBtn = document.getElementById('roleAdminBtn');
      const vendedorBtn = document.getElementById('roleVendedorBtn');
      const adminElements = document.querySelectorAll('.admin-only');

      if (role === 'admin') {
        adminBtn.className = 'flex items-center gap-1.5 px-space-sm py-1.5 rounded text-label-sm font-label-md bg-surface-container-lowest text-primary shadow-sm transition-all';
        vendedorBtn.className = 'flex items-center gap-1.5 px-space-sm py-1.5 rounded text-label-sm font-label-md text-on-surface-variant hover:text-on-surface transition-all';
        adminElements.forEach(el => el.classList.remove('hidden'));
      } else {
        vendedorBtn.className = 'flex items-center gap-1.5 px-space-sm py-1.5 rounded text-label-sm font-label-md bg-surface-container-lowest text-primary shadow-sm transition-all';
        adminBtn.className = 'flex items-center gap-1.5 px-space-sm py-1.5 rounded text-label-sm font-label-md text-on-surface-variant hover:text-on-surface transition-all';
        // Vendedor cannot perform manual inventory adjustments
        adminElements.forEach(el => el.classList.add('hidden'));
      }
    }

    function filterInventoryTable() {
      const input = document.getElementById('kardexSearch').value.toLowerCase();
      const rows = document.querySelectorAll('.item-row');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? '' : 'none';
      });
    }

    function filterCategory(cat) {
      const buttons = document.querySelectorAll('.category-btn');
      buttons.forEach(b => {
        if (b.innerText.trim() === cat) {
          b.className = 'category-btn px-3 py-1 rounded bg-surface-container-lowest text-primary font-semibold shadow-sm';
        } else {
          b.className = 'category-btn px-3 py-1 rounded text-on-surface-variant hover:text-on-surface';
        }
      });

      const rows = document.querySelectorAll('.item-row');
      rows.forEach(row => {
        if (cat === 'Todos') {
          row.style.display = '';
        } else {
          row.style.display = (row.getAttribute('data-category') === cat) ? '' : 'none';
        }
      });
    }

    function toggleLowStockFilter() {
      const checked = document.getElementById('toggleLowStock').checked;
      const rows = document.querySelectorAll('.item-row');
      rows.forEach(row => {
        const status = row.getAttribute('data-stock-status');
        if (checked) {
          row.style.display = (status === 'bajo' || status === 'critico') ? '' : 'none';
        } else {
          row.style.display = '';
        }
      });
    }

    function filterCriticalStockOnly() {
      const toggle = document.getElementById('toggleLowStock');
      toggle.checked = true;
      toggleLowStockFilter();
      const tableElem = document.getElementById('inventoryTable');
      tableElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function sendSupplierWhatsAppOrder() {
      const text = encodeURIComponent("[Demo · mensaje simulado] Estimado Proveedor Adelca / Indeco: Requiero reposición urgente para Distribuidora Morales Quito:\n- 50 varillas 12mm x 12m Adelca\n- 10 rollos Cable #14 AWG Indeco\nFavor confirmar fecha de entrega y factura proforma.");
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }

    function triggerManualWhatsAppNotification() {
      alert("✅ Notificación preparada (simulado): el resumen de ventas y el stock crítico de seguridad quedan listos para el WhatsApp del propietario.");
    }

    function openQuickMovementModal() {
      document.getElementById('quickMovementModal').classList.remove('hidden');
    }

    function closeQuickMovementModal() {
      document.getElementById('quickMovementModal').classList.add('hidden');
    }

    function quickStockOut(sku, productName) {
      openQuickMovementModal();
      document.getElementById('modalProductSelect').value = sku;
      document.querySelector('input[name="movType"][value="SALIDA"]').checked = true;
    }

    function viewKardexItem(sku) {
      alert(`Visualizando tarjeta de KARDEX simplificada para el SKU ${sku}.\nEntradas acumuladas: 240\nSalidas facturadas: 92\nSaldo contable disponible.`);
    }

    function handleMovementSubmit(e) {
      e.preventDefault();
      const sku = document.getElementById('modalProductSelect').value;
      const qty = document.getElementById('modalQty').value;
      alert(`✅ Movimiento registrado exitosamente:\nSKU: ${sku}\nCantidad: ${qty} unidades.\nEl stock y costo promedio han sido recalculados.`);
      closeQuickMovementModal();
    }

    function scrollToSection(id) {
      const elem = document.getElementById(id);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }

    function exportPDF() {
      alert("Generando PDF oficial: Kardex_Semana_42_Distribuidora_Morales.pdf con sello de bodega y balance valorizado.");
    }

    function exportExcel() {
      alert("Descargando archivo Excel (.xlsx) estructurado con fórmulas de costo promedio para conciliación contable.");
    }
  


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

/* Navegación del encabezado:Inventario, Movimientos, Reportes y Alertas. */
(function () {
  var enlaces = document.querySelectorAll("header nav a[data-path]");
  function marcar(activo) {
    enlaces.forEach(function (n) {
      n.classList.remove("bg-primary-container", "text-on-primary-container", "rounded-lg");
      n.removeAttribute("aria-current");
    });
    if (activo) {
      activo.classList.add("bg-primary-container", "text-on-primary-container", "rounded-lg");
      activo.setAttribute("aria-current", "page");
    }
  }
  enlaces.forEach(function (a) {
    a.addEventListener("click", function (evento) {
      evento.preventDefault();
      var path = a.getAttribute("data-path");
      marcar(a);
      if (path === "movimientos") {
        if (typeof openQuickMovementModal === "function") openQuickMovementModal();
        return;
      }
      if (path === "alertas-de-stock") {
        if (typeof filterCriticalStockOnly === "function") filterCriticalStockOnly();
        return;
      }
      var id = path === "reportes-semanales" ? "reporte-preview" : "inventoryTable";
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();

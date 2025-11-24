const CLAVE_HISTORIAL = "historial_ventas_dulce_tentacion";
const CLAVE_ORDEN     = "orden_dulce_tentacion";

function leerHistorial() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_HISTORIAL) || "[]");
    } catch {
        return [];
    }
}

function guardarHistorial(historial) {
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
}

function leerOrdenActual() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_ORDEN) || "null");
    } catch {
        return null;
    }
}

function guardarOrdenActual(orden) {
    if (!orden) return;
    localStorage.setItem(CLAVE_ORDEN, JSON.stringify(orden));
}

function formatearFecha(fechaIso) {
    if (!fechaIso) return "-";
    const f = new Date(fechaIso);
    return f.toLocaleString("es-CL");
}

function formatearMonto(valor) {
    return "$" + (valor || 0).toLocaleString("es-CL");
}

// ============================
// Pintar tabla
// ============================
const tbody        = document.getElementById("tablaVentas");
const totalOrdenes = document.getElementById("totalOrdenes");
const totalVendido = document.getElementById("totalVendido");

let historial = leerHistorial();
let sumaTotal = 0;

tbody.innerHTML = "";

historial.forEach((orden, index) => {
    sumaTotal += orden.total || 0;

    const tr = document.createElement("tr");

    const estados = ["Recibido", "En preparación", "En despacho", "Entregado", "Anulada"];

    const selectEstado = document.createElement("select");
    selectEstado.className = "form-select form-select-sm";
    estados.forEach(e => {
        const opt = document.createElement("option");
        opt.value = e;
        opt.textContent = e;
        if ((orden.estado || "Recibido") === e) {
            opt.selected = true;
        }
        selectEstado.appendChild(opt);
    });

    const btnGuardar = document.createElement("button");
    btnGuardar.className = "btn btn-sm btn-primary";
    btnGuardar.textContent = "Guardar";

    btnGuardar.addEventListener("click", () => {
        const nuevoEstado = selectEstado.value;
        historial[index].estado = nuevoEstado;

        // actualizar orden actual si es la misma
        const ordenActual = leerOrdenActual();
        if (ordenActual && ordenActual.numero === orden.numero) {
            ordenActual.estado = nuevoEstado;
            guardarOrdenActual(ordenActual);
        }

        guardarHistorial(historial);
        alert(`Estado actualizado a "${nuevoEstado}" para la orden ${orden.numero}`);
    });

    tr.innerHTML = `
        <td>${orden.numero || "-"}</td>
        <td>${formatearFecha(orden.fechaCreacion)}</td>
        <td>${formatearMonto(orden.total)}</td>
        <td></td>
        <td class="text-end"></td>
    `;

    tr.children[3].appendChild(selectEstado);
    tr.children[4].appendChild(btnGuardar);

    tbody.appendChild(tr);
});

totalOrdenes.textContent = historial.length;
totalVendido.textContent = formatearMonto(sumaTotal);

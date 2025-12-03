const CLAVE_ULTIMO = "ultimo_pedido_dulce_tentacion";
const API_PEDIDOS = "http://localhost:3900/api/pedidos";

//  utilidades 

function esAdminActual() {
    try {
        const u = JSON.parse(localStorage.getItem("usuario_dulce_tentacion") || "null");
        if (!u) return false;
        return u.rol === "admin" || (u.roles || []).includes("admin");
    } catch {
        return false;
    }
}

function estadoBackToFront(estado) {
    switch (estado) {
        case "pagado":         return "Recibido";
        case "en_preparacion": return "En preparación";
        case "en_despacho":    return "En despacho";
        case "entregado":      return "Entregado";
        case "cancelado":      return "Anulada";
        default:               return "Recibido";
    }
}

function estadoFrontToBack(label) {
    switch (label) {
        case "Recibido":             return "pagado";
        case "En preparación":       return "en_preparacion";
        case "En despacho":          return "en_despacho";
        case "Entregado":            return "entregado";
        case "Anulación solicitada": 
            return "pagado";
        case "Anulada":
            return "cancelado";
        default:
            return "pagado";
    }
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return "-";
    return new Date(fechaISO).toLocaleString("es-CL");
}

function guardarUltimoPedido(orden) {
    localStorage.setItem(CLAVE_ULTIMO, JSON.stringify(orden));
}

// lógica principal

document.addEventListener("DOMContentLoaded", () => {
    if (!esAdminActual()) {
        alert("Solo el administrador puede ver el reporte de ventas.");
        window.location.href = "index.html";
        return;
    }

    const tbody          = document.getElementById("tablaVentas");
    const totalOrdenesEl = document.getElementById("totalOrdenes");
    const totalVendidoEl = document.getElementById("totalVendido");

    if (!tbody) return;

    cargarYRenderizar();

    async function cargarYRenderizar() {
        try {
            const resp = await fetch(`${API_PEDIDOS}/listar`);
            if (!resp.ok) {
                throw new Error("No se pudo obtener la lista de pedidos");
            }
            const data = await resp.json();
            const pedidos = Array.isArray(data.pedidos) ? data.pedidos : [];

            // totales
            if (totalOrdenesEl) totalOrdenesEl.textContent = pedidos.length;

            if (totalVendidoEl) {
                const totalVendido = pedidos.reduce(
                    (acc, p) => acc + (Number(p.total) || 0),
                    0
                );
                totalVendidoEl.textContent =
                    "$" + totalVendido.toLocaleString("es-CL");
            }

            tbody.innerHTML = "";

            if (pedidos.length === 0) {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td colspan="6" class="text-center text-muted">
                        No hay ventas registradas.
                    </td>
                `;
                tbody.appendChild(tr);
                return;
            }

            // ordenados por fecha
            pedidos.forEach((p) => {
                const numero     = p.numero || "(sin número)";
                const fechaStr   = formatearFecha(p.fecha);
                const total      = Number(p.total) || 0;
                const cliente    = (p.usuario && p.usuario.nombre) || "Sin nombre";
                const estadoRaw  = p.estado || "pagado";
                const estadoText = estadoBackToFront(estadoRaw);

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${numero}</td>
                    <td>${fechaStr}</td>
                    <td>${cliente}</td>
                    <td>$${total.toLocaleString("es-CL")}</td>
                    <td>
                        <select class="form-select form-select-sm"
                                data-id="${p._id}"
                                data-numero="${numero}">
                            <option ${estadoText === "Recibido" ? "selected" : ""}>Recibido</option>
                            <option ${estadoText === "En preparación" ? "selected" : ""}>En preparación</option>
                            <option ${estadoText === "En despacho" ? "selected" : ""}>En despacho</option>
                            <option ${estadoText === "Entregado" ? "selected" : ""}>Entregado</option>
                            <option ${estadoText === "Anulada" ? "selected" : ""}>Anulada</option>
                        </select>
                    </td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-2"
                                data-ver-seg="${p._id}">
                            Ver seguimiento
                        </button>
                        <button class="btn btn-sm btn-outline-secondary"
                                data-ver-boleta="${p._id}">
                            Ver boleta
                        </button>
                    </td>
                `;
                tr.dataset.pedido = JSON.stringify(p);
                tbody.appendChild(tr);
            });

        } catch (err) {
            console.error(err);
            alert("Ocurrió un error al cargar el reporte de ventas.");
        }
    }

    // cambio de estado desde el select 
    tbody.addEventListener("change", async (e) => {
        const select = e.target.closest("select[data-id]");
        if (!select) return;

        const idPedido    = select.dataset.id;
        const nuevoLabel  = select.value;
        const nuevoEstado = estadoFrontToBack(nuevoLabel);

        try {
            const resp = await fetch(`${API_PEDIDOS}/estado/${idPedido}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            console.log("PATCH /estado:", resp.status); 

            if (!resp.ok) {
                throw new Error("No se pudo actualizar el estado");
            }
        } catch (err) {
            console.error(err);
            alert("Error al actualizar el estado del pedido.");
        }
    });

    // Ver seguimiento / boleta 
    tbody.addEventListener("click", (e) => {
        const btnSeg = e.target.closest("button[data-ver-seg]");
        const btnBol = e.target.closest("button[data-ver-boleta]");
        if (!btnSeg && !btnBol) return;

        const tr = e.target.closest("tr");
        if (!tr || !tr.dataset.pedido) return;

        const pedido = JSON.parse(tr.dataset.pedido);

        const entrega = pedido.entrega || {};
        const ordenFront = {
            _id:    pedido._id,
            numero: pedido.numero,
            usuario: pedido.usuario,
            entrega: {
                fecha:  entrega.fechaEntrega || "",
                comuna: entrega.comuna || "",
                franja: entrega.franjaEntrega || ""
            },
            total:  pedido.total,
            estado: estadoBackToFront(pedido.estado || "pagado"),
            fechaCreacion: pedido.fecha
        };

        guardarUltimoPedido(ordenFront);

        if (btnSeg) {
            window.location.href = "Seguimiento.html";
        } else if (btnBol) {
            window.location.href = "BoletaDigital.html";
        }
    });
});

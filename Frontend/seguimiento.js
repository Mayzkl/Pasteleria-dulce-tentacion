const CLAVE_ULTIMO = "ultimo_pedido_dulce_tentacion";
const API_PEDIDOS  = "http://localhost:3900/api/pedidos";

function guardarUltimoPedido(orden) {
    localStorage.setItem(CLAVE_ULTIMO, JSON.stringify(orden));
}

function obtenerUsuarioActual() {
    try {
        return JSON.parse(localStorage.getItem("usuario_dulce_tentacion") || "null");
    } catch {
        return null;
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

document.addEventListener("DOMContentLoaded", async () => {
    const usuario       = obtenerUsuarioActual();
    const tbody         = document.getElementById("tbodyPedidos");
    const msgSinPedidos = document.getElementById("mensajeSinPedidos");

    if (!tbody || !msgSinPedidos) return;

    if (!usuario) {
        msgSinPedidos.classList.remove("d-none");
        msgSinPedidos.textContent = "Debes iniciar sesión para ver tus pedidos.";
        tbody.innerHTML = "";
        return;
    }

    try {
        const resp = await fetch(`${API_PEDIDOS}/listar`);
        if (!resp.ok) throw new Error("No se pudo obtener la lista de pedidos");
        const data = await resp.json();
        const pedidos = Array.isArray(data.pedidos) ? data.pedidos : [];

        const misPedidos = pedidos.filter((o) => {
            const u = o.usuario || {};
            const mismoId    = u.id && usuario.userId && String(u.id) === String(usuario.userId);
            const mismoEmail = u.email && usuario.email && u.email === usuario.email;
            return mismoId || mismoEmail;
        });

        if (misPedidos.length === 0) {
            msgSinPedidos.classList.remove("d-none");
            msgSinPedidos.textContent = "Aún no tienes pedidos registrados.";
            tbody.innerHTML = "";
            return;
        }

        msgSinPedidos.classList.add("d-none");
        tbody.innerHTML = "";

        misPedidos
            .slice()
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) 
            .forEach((orden) => {
                const tr = document.createElement("tr");

                const fechaStr = orden.fecha
                    ? new Date(orden.fecha).toLocaleString("es-CL")
                    : "-";

                const total  = Number(orden.total) || 0;
                const estado = estadoBackToFront(orden.estado || "pagado");

                tr.innerHTML = `
                    <td>${orden.numero}</td>
                    <td>${fechaStr}</td>
                    <td>${estado}</td>
                    <td>$${total.toLocaleString("es-CL")}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-2" data-boleta="${orden._id}">
                            Ver boleta
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" data-detalle="${orden._id}">
                            Ver detalle
                        </button>
                    </td>
                `;

                tr.dataset.pedido = JSON.stringify(orden);
                tbody.appendChild(tr);
            });

        tbody.addEventListener("click", (e) => {
            const btnBoleta  = e.target.closest("button[data-boleta]");
            const btnDetalle = e.target.closest("button[data-detalle]");
            if (!btnBoleta && !btnDetalle) return;

            const tr = e.target.closest("tr");
            if (!tr || !tr.dataset.pedido) return;

            const orden = JSON.parse(tr.dataset.pedido);

            const entrega = orden.entrega || {};
            const ordenFront = {
                _id:    orden._id,
                numero: orden.numero,
                usuario: orden.usuario,
                entrega: {
                    fecha:  entrega.fechaEntrega || "",
                    comuna: entrega.comuna || "",
                    franja: entrega.franjaEntrega || ""
                },
                total: orden.total,
                estado: estadoBackToFront(orden.estado || "pagado"),
                fechaCreacion: orden.fecha
            };

            guardarUltimoPedido(ordenFront);

            if (btnBoleta) {
                window.location.href = "BoletaDigital.html";
            } else {
                // detalle / seguimiento
                window.location.href = "Seguimiento.html";
            }
        });
    } catch (err) {
        console.error(err);
        msgSinPedidos.classList.remove("d-none");
        msgSinPedidos.textContent =
            "Ocurrió un error al cargar tus pedidos. Intenta nuevamente más tarde.";
        tbody.innerHTML = "";
    }
});

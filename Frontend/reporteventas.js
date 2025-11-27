// reporteventas.js

const URL_API_PEDIDOS = "http://localhost:3900/api/pedidos";

function formatearPrecio(valor) {
    return "$" + (valor || 0).toLocaleString("es-CL");
}

let pedidosCache = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarReporteVentas();
});

async function cargarReporteVentas() {
    const tablaVentas    = document.getElementById("tablaVentas");
    const totalOrdenesEl = document.getElementById("totalOrdenes");
    const totalVendidoEl = document.getElementById("totalVendido");

    try {
        const resp = await fetch(`${URL_API_PEDIDOS}/listar`);
        const data = await resp.json();

        if (!resp.ok || data.status !== "success") {
            tablaVentas.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-danger">
                        No se pudieron cargar las ventas.
                    </td>
                </tr>
            `;
            return;
        }

        const pedidos = data.pedidos || [];
        pedidosCache = pedidos;

        if (pedidos.length === 0) {
            tablaVentas.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        Todavía no hay órdenes registradas.
                    </td>
                </tr>
            `;
            totalOrdenesEl.textContent = "0";
            totalVendidoEl.textContent = "$0";
            return;
        }

        tablaVentas.innerHTML = "";
        let totalVendido = 0;

        pedidos.forEach(p => {
            const numOrden = p._id ? p._id.slice(-6).toUpperCase() : "-";
            const fecha = p.fecha ? new Date(p.fecha).toLocaleString("es-CL") : "-";
            const total = p.total || (p.items || []).reduce((acc, it) => acc + (it.precio || 0), 0);
            const estado = p.estado || "pagado";

            totalVendido += total;

            tablaVentas.innerHTML += `
                <tr>
                    <td>${numOrden}</td>
                    <td>${fecha}</td>
                    <td>${formatearPrecio(total)}</td>
                    <td>${estado}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary" onclick="verDetallePedido('${p._id}')">
                            Ver detalle
                        </button>
                    </td>
                </tr>
            `;
        });

        totalOrdenesEl.textContent = pedidos.length;
        totalVendidoEl.textContent = formatearPrecio(totalVendido);

    } catch (error) {
        console.error("Error al cargar reporte de ventas:", error);
        tablaVentas.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger">
                    Error al conectar con el servidor.
                </td>
            </tr>
        `;
    }
}

// Muestra un resumen sencillo de los productos de la orden
function verDetallePedido(id) {
    const pedido = pedidosCache.find(p => p._id === id);
    if (!pedido) {
        alert("No se pudo encontrar el detalle de esta orden.");
        return;
    }

    const items = pedido.items || [];
    if (items.length === 0) {
        alert("Este pedido no tiene productos registrados.");
        return;
    }

    let mensaje = `Orden ${pedido._id.slice(-6).toUpperCase()}\n`;
    mensaje += `Fecha: ${pedido.fecha ? new Date(pedido.fecha).toLocaleString("es-CL") : "-"}\n\n`;
    mensaje += "Productos:\n";

    items.forEach((item, i) => {
        mensaje += `\n${i + 1}. ${item.nombre || "Producto"}`;
        if (item.tamano || item.relleno) {
            mensaje += `\n   Tamaño: ${item.tamano || "-"} | Relleno: ${item.relleno || "-"}`;
        }
        if (item.mensaje) {
            mensaje += `\n   Mensaje: ${item.mensaje}`;
        }
        mensaje += `\n   Precio: ${formatearPrecio(item.precio || 0)}\n`;
    });

    mensaje += `\nTotal: ${formatearPrecio(pedido.total || items.reduce((acc, it) => acc + (it.precio || 0), 0))}`;

    alert(mensaje);
}

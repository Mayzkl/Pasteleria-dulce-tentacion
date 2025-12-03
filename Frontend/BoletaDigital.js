const CLAVE_ULTIMO = "ultimo_pedido_dulce_tentacion";
const API_PEDIDOS  = "http://localhost:3900/api/pedidos"; 

function leerUltimoPedido() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_ULTIMO) || "null");
    } catch {
        return null;
    }
}

function formatoMoneda(valor) {
    return "$" + (Number(valor) || 0).toLocaleString("es-CL");
}

document.addEventListener("DOMContentLoaded", async () => {
    const spanNumero      = document.getElementById("bol-numero");
    const spanFecha       = document.getElementById("bol-fecha");
    const spanCliente     = document.getElementById("bol-cliente");
    const spanEmail       = document.getElementById("bol-email");
    const spanDireccion   = document.getElementById("bol-direccion");
    const spanComuna      = document.getElementById("bol-comuna");
    const spanTipoEntrega = document.getElementById("bol-tipo-entrega");
    const spanFranja      = document.getElementById("bol-franja");

    const tbodyItems  = document.getElementById("bol-items");
    const spanSubtotal = document.getElementById("bol-subtotal");
    const spanEnvio    = document.getElementById("bol-envio");
    const spanTotal    = document.getElementById("bol-total");

    const ultimo = leerUltimoPedido();

    if (!ultimo || !ultimo.numero) {
        spanNumero.textContent = "(sin pedido)";
        spanFecha.textContent  = "-";
        tbodyItems.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    No se encontró un pedido reciente. Realiza una compra primero.
                </td>
            </tr>`;
        return;
    }

    spanNumero.textContent = ultimo.numero;

    try {
        const resp = await fetch(`${API_PEDIDOS}/listar`);
        if (!resp.ok) throw new Error("No se pudo obtener pedidos");

        const data    = await resp.json();
        const pedidos = Array.isArray(data.pedidos) ? data.pedidos : [];

        const pedido = pedidos.find(p => p.numero === ultimo.numero);

        if (!pedido) {
            spanFecha.textContent = ultimo.fechaCreacion
                ? new Date(ultimo.fechaCreacion).toLocaleString("es-CL")
                : "-";
            spanCliente.textContent   = ultimo.usuario?.nombre || "-";
            spanEmail.textContent     = ultimo.usuario?.email  || "-";
            spanDireccion.textContent = "-";
            spanComuna.textContent    = ultimo.entrega?.comuna || "-";
            spanTipoEntrega.textContent = "-";
            spanFranja.textContent      = ultimo.entrega?.franja || "-";

            tbodyItems.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        No se encontró el detalle del pedido en el servidor.
                    </td>
                </tr>`;

            spanSubtotal.textContent = formatoMoneda(ultimo.total);
            spanEnvio.textContent    = formatoMoneda(0);
            spanTotal.textContent    = formatoMoneda(ultimo.total);
            return;
        }

        const entrega = pedido.entrega || {};
        const usuario = pedido.usuario || {};

        spanFecha.textContent = pedido.fecha
            ? new Date(pedido.fecha).toLocaleString("es-CL")
            : "-";
        spanCliente.textContent   = usuario.nombre || "-";
        spanEmail.textContent     = usuario.email  || "-";
        spanDireccion.textContent = entrega.direccion || "-";
        spanComuna.textContent    = entrega.comuna    || "-";
        spanTipoEntrega.textContent = entrega.tipoEntrega   || "-";
        spanFranja.textContent      = entrega.franjaEntrega || "-";

        // Items
        tbodyItems.innerHTML = "";
        const items = Array.isArray(pedido.items) ? pedido.items : [];

        if (items.length === 0) {
            tbodyItems.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        Este pedido no tiene ítems registrados.
                    </td>
                </tr>`;
        } else {
            items.forEach((it) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${it.nombre || "-"}</td>
                    <td>${it.tamano || "-"}</td>
                    <td>${it.relleno || "-"}</td>
                    <td>${it.mensaje || "-"}</td>
                    <td class="text-end">${formatoMoneda(it.precio)}</td>
                `;
                tbodyItems.appendChild(tr);
            });
        }

        const subtotal   = pedido.total || 0;
        const costoEnvio = entrega.costoEnvio || 0;
        const total      = subtotal + costoEnvio;

        spanSubtotal.textContent = formatoMoneda(subtotal);
        spanEnvio.textContent    = formatoMoneda(costoEnvio);
        spanTotal.textContent    = formatoMoneda(total);

    } catch (err) {
        console.error(err);
        tbodyItems.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    Ocurrió un error al cargar la boleta. Intenta nuevamente.
                </td>
            </tr>`;
    }
});

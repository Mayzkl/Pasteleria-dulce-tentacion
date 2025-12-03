const CLAVE_ORDEN     = "ultimo_pedido_dulce_tentacion";
const CLAVE_HISTORIAL = "historial_ventas_dulce_tentacion"; 
const API_PEDIDOS     = "http://localhost:3900/api/pedidos";

const formAnulacion  = document.getElementById("formAnulacion");
const formContacto   = document.getElementById("formContacto");
const modalAnulacion = new bootstrap.Modal(document.getElementById("modalAnulacion"));
const alertaEstado   = document.querySelector(".alert"); 

function leerOrdenActual() {
    try {
        const json = localStorage.getItem(CLAVE_ORDEN);
        console.log("[AnularCompra] orden bruta:", json);
        return json ? JSON.parse(json) : null;
    } catch (err) {
        console.error("[AnularCompra] Error al leer orden:", err);
        return null;
    }
}

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

function formatearFecha(fechaIso) {
    if (!fechaIso) return "-";
    const f = new Date(fechaIso);
    return f.toLocaleString("es-CL");
}

// CARGAR DATOS DE LA ORDEN 

let ordenActual = leerOrdenActual();

if (ordenActual && alertaEstado) {
    const estado = ordenActual.estado || "Pagada";
    const fechaText =
        formatearFecha(ordenActual.fechaAnulacion || ordenActual.fecha || ordenActual.fechaCreacion);

    const numero = ordenActual.numero
        ? ordenActual.numero
        : (ordenActual._id
            ? "DT-" + ordenActual._id.slice(-6).toUpperCase()
            : "DT-XXXXXX");

    alertaEstado.textContent =
        `Pedido ${numero} — Estado actual: ${estado} — ${fechaText}`;
} else if (alertaEstado) {
    alertaEstado.textContent =
        "No se encontró un pedido reciente para anular.";
}

// FORMULARIO DE ANULACIÓN
formAnulacion.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!formAnulacion.checkValidity()) {
        e.stopPropagation();
        formAnulacion.classList.add("was-validated");
        return;
    }

    if (!ordenActual) {
        alert("No hay un pedido vigente para anular.");
        return;
    }

    const motivo = document.getElementById("motivo").value.trim();

    try {
        // Si el pedido tiene _id, intentamos avisar al backend.
        if (ordenActual._id) {
            const resp = await fetch(`${API_PEDIDOS}/cancelar/${ordenActual._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ motivo })
            });

            const data = await resp.json();

            if (!resp.ok) {
                alert(data.mensaje || "Error interno al cancelar el pedido");
                return;
            }
        } else {
            console.warn("[AnularCompra] Pedido sin _id; se cancelará solo en localStorage.");
        }

        // 1) Actualizar orden actual en localStorage
        const nuevoEstado = "Anulada"; 

        ordenActual.estado          = nuevoEstado;
        ordenActual.motivoAnulacion = motivo;
        ordenActual.fechaAnulacion  = new Date().toISOString();

        localStorage.setItem(CLAVE_ORDEN, JSON.stringify(ordenActual));

        // 2) Actualizar también el historial en localStorage 
        const historial = leerHistorial();
        let idx = -1;

        // Primero intentamos por _id 
        if (ordenActual._id) {
            idx = historial.findIndex(o => o._id === ordenActual._id);
        }

        // Si no hay _id o no lo encuentra se busca por número de pedido
        if (idx === -1 && ordenActual.numero) {
            idx = historial.findIndex(
                (o) => (o.numero || "") === (ordenActual.numero || "")
            );
        }

        if (idx !== -1) {
            historial[idx].estado          = nuevoEstado;
            historial[idx].motivoAnulacion = motivo;
            historial[idx].fechaAnulacion  = ordenActual.fechaAnulacion;
            guardarHistorial(historial);
        } else {
            console.warn("[AnularCompra] No se encontró la orden en historial para actualizar estado.");
        }

        // 3) Actualizar alerta de estado
        if (alertaEstado) {
            const numero = ordenActual.numero
                ? ordenActual.numero
                : (ordenActual._id
                    ? "DT-" + ordenActual._id.slice(-6).toUpperCase()
                    : "DT-XXXXXX");

            alertaEstado.textContent =
                `Pedido ${numero} — Estado actual: ${nuevoEstado} — ` +
                new Date(ordenActual.fechaAnulacion).toLocaleString("es-CL");
        }


        // 4) Reset form + mostrar modal
        formAnulacion.reset();
        formAnulacion.classList.remove("was-validated");
        modalAnulacion.show();

    } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor para anular el pedido.");
    }
});

// FORMULARIO DE CONTACTO

formContacto.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!formContacto.checkValidity()) {
        e.stopPropagation();
        formContacto.classList.add("was-validated");
        return;
    }

    const correo   = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    const datosContacto = {
        correo,
        telefono,
        fecha: new Date().toISOString(),
        idPedido: ordenActual ? ordenActual._id : null
    };

    localStorage.setItem(
        "contacto_anulacion_dulce_tentacion",
        JSON.stringify(datosContacto)
    );

    formContacto.classList.remove("was-validated");
    alert("Datos de contacto guardados correctamente.");
});

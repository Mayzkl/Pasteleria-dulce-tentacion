    const CLAVE_ORDEN     = "orden_dulce_tentacion";
    const CLAVE_HISTORIAL = "historial_ventas_dulce_tentacion";

    const formAnulacion  = document.getElementById('formAnulacion');
    const formContacto   = document.getElementById('formContacto');
    const modalAnulacion = new bootstrap.Modal(document.getElementById('modalAnulacion'));
    const alertaEstado   = document.querySelector('.alert'); // la de "Pedido recibido — ..."

    function leerOrdenActual() {
        try {
            return JSON.parse(localStorage.getItem(CLAVE_ORDEN) || "null");
        } catch {
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

    function formatearMonto(valor) {
        return "$" + (valor || 0).toLocaleString("es-CL");
    }
    // Cargar datos de la orden
    let ordenActual = leerOrdenActual();

    if (ordenActual && alertaEstado) {
        const estado    = ordenActual.estado || "En preparación";
        const fechaText = formatearFecha(ordenActual.fechaCreacion);
        const numero    = ordenActual.numero || "DT-XXXXXX";

        alertaEstado.textContent =
            `Pedido ${numero} — Estado actual: ${estado} — ${fechaText}`;
    } else if (alertaEstado) {
        alertaEstado.textContent =
            "No se encontró un pedido reciente para anular.";
    }

    // Formulario de anulacion

    formAnulacion.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!formAnulacion.checkValidity()) {
            e.stopPropagation();
            formAnulacion.classList.add('was-validated');
            return;
        }

        if (!ordenActual) {
            alert("No hay un pedido vigente para anular.");
            return;
        }

        const motivo = document.getElementById('motivo').value.trim();

        // 1) Actualizar orden actual
        ordenActual.estado                = "Anulada";
        ordenActual.motivoAnulacion       = motivo;
        ordenActual.fechaAnulacion        = new Date().toISOString();

        localStorage.setItem(CLAVE_ORDEN, JSON.stringify(ordenActual));

        // 2) Actualizar historial
        const historial = leerHistorial();
        const idx = historial.findIndex(o => (o.numero || "") === (ordenActual.numero || ""));
        if (idx !== -1) {
            historial[idx].estado          = "Anulada";
            historial[idx].motivoAnulacion = motivo;
            historial[idx].fechaAnulacion  = ordenActual.fechaAnulacion;
            guardarHistorial(historial);
        }

        // 3) Actualizar alerta de estado
        if (alertaEstado) {
            alertaEstado.textContent =
                `Pedido ${ordenActual.numero} — Estado actual: Anulada — ` +
                formatearFecha(ordenActual.fechaAnulacion);
            alertaEstado.classList.remove("alert-info");
            alertaEstado.classList.add("alert-danger");
        }

        // 4) Reset form + mostrar modal
        formAnulacion.reset();
        formAnulacion.classList.remove('was-validated');
        modalAnulacion.show();
    });

    // Formulario de contacto

    formContacto.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!formContacto.checkValidity()) {
            e.stopPropagation();
            formContacto.classList.add('was-validated');
            return;
        }

        const correo   = document.getElementById('correo').value.trim();
        const telefono = document.getElementById('telefono').value.trim();

        const datosContacto = {
            correo,
            telefono,
            fecha: new Date().toISOString(),
            numeroOrden: ordenActual ? ordenActual.numero : null
        };

        localStorage.setItem(
            "contacto_anulacion_dulce_tentacion",
            JSON.stringify(datosContacto)
        );

        formContacto.classList.remove('was-validated');
        alert("Datos de contacto guardados correctamente.");
    });

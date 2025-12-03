document.addEventListener("DOMContentLoaded", () => {

    console.log("SeleccionDeEntrega.js cargado correctamente");

    const nombreEl = document.getElementById("nombre");
    const direccionEl = document.getElementById("direccion");
    const comunaEl = document.getElementById("comuna");
    const fechaEl = document.getElementById("fecha");
    const franjaEl = document.getElementById("franja");
    const tipoEntregaEl = document.getElementById("tipoEntrega");

    const totalProductosEl = document.getElementById("totalProductos");
    const costoEnvioEl = document.getElementById("costoEnvio");
    const totalPedidoEl = document.getElementById("totalPedido");

    const btnContinuar = document.getElementById("btnContinuarPago");

    // Leer carrito
    const carrito = JSON.parse(localStorage.getItem("carrito_dulce_tentacion")) || [];

    const costoPorComuna = {
        "Las Condes": 4500,
        "Providencia": 4000,
        "Santiago Centro": 3500,
        "Ñuñoa": 3000,
        "La Florida": 5000
    };

    function calcularTotales() {
        const totalProductos = carrito.reduce((acc, item) => acc + (item.precio || 0), 0);
        let costoEnvio = 0;
        if (tipoEntregaEl.value === "domicilio") {
            costoEnvio = costoPorComuna[comunaEl.value] || 0;
        } else {
            costoEnvio = 0;
        }
        const total = totalProductos + costoEnvio;

        totalProductosEl.textContent = "$" + totalProductos.toLocaleString("es-CL");
        costoEnvioEl.textContent = "$" + costoEnvio.toLocaleString("es-CL");
        totalPedidoEl.textContent = "$" + total.toLocaleString("es-CL");
    }

    comunaEl.addEventListener("change", calcularTotales);
    tipoEntregaEl.addEventListener("change", calcularTotales);

    btnContinuar.addEventListener("click", () => {
        // Validar datos obligatorios
        if (!nombreEl.value.trim() ||
            !direccionEl.value.trim() ||
            !comunaEl.value ||
            !fechaEl.value ||
            !franjaEl.value) {
            alert("Por favor completa todos los datos de entrega.");
            return;
        }
        // Guardar datos de entrega en localStorage
        const entrega = {
            nombreDestinatario: nombreEl.value.trim(),
            direccion: direccionEl.value.trim(),
            comuna: comunaEl.value,
            fechaEntrega: fechaEl.value,
            franjaEntrega: franjaEl.value,
            tipoEntrega: tipoEntregaEl.value,
            costoEnvio: parseInt(costoEnvioEl.textContent.replace("$", "").replace(".", "")) || 0
        };
        localStorage.setItem("entrega_dulce_tentacion", JSON.stringify(entrega));
        window.location.href = "PagoElectronico.html";
    });
    calcularTotales();
});

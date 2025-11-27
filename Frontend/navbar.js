document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("navbar-container");
    if (!contenedor) return;

    contenedor.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light border-bottom">
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.html">Dulce Tentación</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto" id="navbar-right">
                    <!-- Aquí se rellenan los links según sesión -->
                </ul>
            </div>
        </div>
    </nav>
    `;

    const navRight = document.getElementById("navbar-right");
    // Usuario actual usando usuarios.js
    const usuario = (typeof obtenerUsuarioActual === "function")
        ? obtenerUsuarioActual()
        : null;

    if (usuario) {
        // Usuario logueado
        let items = `
            <li class="nav-item">
                <span class="nav-link disabled">Hola, ${usuario.nombre || "Usuario"}</span>
            </li>
            <li class="nav-item">
                <a id="linkCerrarSesion" class="nav-link" href="#">Cerrar sesión</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="catalogo.html">Catálogo</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="carrito_compra.html">Carrito</a>
            </li>
        `;

        const esAdmin = usuario.email === "admin@dulcetentacion.cl";

        if (esAdmin) {
            items += `
                <li class="nav-item">
                    <a class="nav-link" href="AdministracionDeProductos.html">Administración</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="ReporteVentas.html">Reporte de ventas</a>
                </li>
            `;
        }

        navRight.innerHTML = items;

        // Logout: borrar sesión y redirigir al login
        const linkCerrarSesion = document.getElementById("linkCerrarSesion");
        if (linkCerrarSesion) {
            linkCerrarSesion.addEventListener("click", (e) => {
                e.preventDefault();
                if (typeof cerrarSesion === "function") {
                    cerrarSesion();
                } else {
                    localStorage.removeItem("usuario_dulce_tentacion");
                }
                window.location.href = "login.html";
            });
        }

    } else {
        // Usuario NO logueado
        navRight.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="catalogo.html">Catálogo</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="registro.html">Registro</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="login.html">Iniciar sesión</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="carrito_compra.html">Carrito</a>
            </li>
        `;
    }
});
document.addEventListener("DOMContentLoaded", () => {

    const navbarContainer = document.getElementById("navbar-container");

    // 👇 vamos a aceptar varias posibles keys
    const USUARIO_KEYS = ["usuario", "usuario_dulce_tentacion"];

    let usuario = null;
    let usuarioKeyUsada = null;

    for (const key of USUARIO_KEYS) {
        const dataStr = localStorage.getItem(key);
        if (dataStr) {
            try {
                usuario = JSON.parse(dataStr);
                usuarioKeyUsada = key;
                break;
            } catch (e) {
                console.error("Error parseando usuario desde localStorage (" + key + ")", e);
            }
        }
    }

    // Si encontramos usuario pero sin rol, lo inferimos:
    if (usuario && !usuario.rol) {
        // aquí puedes poner la lógica que quieras
        if (usuario.nombre && usuario.nombre.toLowerCase() === "admin") {
            usuario.rol = "admin";
        } else {
            usuario.rol = "cliente";
        }
    }


    navbarContainer.innerHTML = `
    <nav class="navbar navbar-expand-md navbar-light shadow-sm" style="background-color: #E5989B;">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold" href="index.html" style="color:#4E342E;">Dulce Tentación</a>

            <!-- Botón Hamburguesa -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Opciones del Menú -->
            <div class="collapse navbar-collapse justify-content-end" id="menuNav">
                <ul class="navbar-nav" id="navItems" style="gap: .5rem;"></ul>
            </div>
        </div>
    </nav>
    `;

    const navItems = document.getElementById("navItems");

    if (!usuario) {
        navItems.innerHTML += `
            <li class="nav-item"><a class="nav-link" href="catalogo.html">Catálogo</a></li>
            <li class="nav-item"><a class="nav-link" href="registro.html">Registro</a></li>
            <li class="nav-item"><a class="nav-link" href="login.html">Iniciar sesión</a></li>
            <li class="nav-item"><a class="nav-link" href="carrito.html">Carrito</a></li>
        `;
    } else {
        navItems.innerHTML += `
            <li class="nav-item"><span class="nav-link fw-bold" style="pointer-events:none;">Hola, ${usuario.nombre}</span></li>
            <li class="nav-item"><a class="nav-link" href="catalogo.html">Catálogo</a></li>
        `;

        if (usuario.rol === "admin") {
            navItems.innerHTML += `
                <li class="nav-item"><a class="nav-link" href="AdministracionDeProductos.html">Administración</a></li>
                <li class="nav-item"><a class="nav-link" href="ReporteVentas.html">Reporte ventas</a></li>
            `;
        } else {
            navItems.innerHTML += `
                <li class="nav-item"><a class="nav-link" href="Seguimiento.html">Seguimiento</a></li>
            `;
        }

        navItems.innerHTML += `
            <li class="nav-item"><a class="nav-link text-danger fw-semibold" href="#" id="logout">Cerrar sesión</a></li>
            <li class="nav-item"><a class="nav-link" href="carrito.html">Carrito</a></li>
        `;

        document.getElementById("logout").addEventListener("click", () => {
            ["usuario", "usuario_dulce_tentacion"].forEach(k => localStorage.removeItem(k));
            window.location.href = "login.html";
        });
    }
});

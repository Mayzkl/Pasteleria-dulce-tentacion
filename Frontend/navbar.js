function obtenerUsuarioActual() {
    const KEYS = ["usuario_dulce_tentacion", "usuario"]; 

    for (const key of KEYS) {
        const str = localStorage.getItem(key);
        if (!str) continue;
        try {
            const u = JSON.parse(str);
            if (!u.rol) {
                if (u.roles && u.roles.includes("admin")) {
                    u.rol = "admin";
                } else if ((u.nombre || "").toLowerCase() === "admin") {
                    u.rol = "admin";
                } else {
                    u.rol = "cliente";
                }
            }
            return u;
        } catch {
            continue;
        }
    }
    return null;
}

function construirNavbar(usuario) {
    const navbarContainer = document.getElementById("navbar-container");
    if (!navbarContainer) return;

    navbarContainer.innerHTML = `
        <nav class="navbar navbar-expand-md navbar-light shadow-sm" style="background-color: #E5989B;">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold" href="index.html" style="color:#4E342E;">Dulce Tentación</a>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNav">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="menuNav">
                    <ul class="navbar-nav ms-auto mb-2 mb-md-0" id="navItems"></ul>
                </div>
            </div>
        </nav>
    `;

    const navItems = document.getElementById("navItems");
    if (!navItems) return;

    // MENÚ DE INVITADO
    if (!usuario) {
        navItems.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="catalogo.html">Catálogo</a></li>
            <li class="nav-item"><a class="nav-link" href="registro.html">Registro</a></li>
            <li class="nav-item"><a class="nav-link" href="#" id="btn-login">Iniciar sesión</a></li>
            <li class="nav-item"><a class="nav-link" href="carrito.html">Carrito</a></li>
        `;
        return;
    }

    if (usuario.rol === "admin") {
        // MENÚ ADMIN
        navItems.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="AdministracionDeProductos.html">Administrar productos</a></li>
            <li class="nav-item"><a class="nav-link" href="ReporteVentas.html">Reporte de ventas</a></li>
            <li class="nav-item"><a class="nav-link" href="Destacados.html">Destacados</a></li>
            <li class="nav-item"><a class="nav-link text-danger fw-semibold" href="#" id="logout">Cerrar sesión</a></li>
        `;
    } else {
        // MENÚ CLIENTE
        navItems.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="catalogo.html">Catálogo</a></li>
            <li class="nav-item"><a class="nav-link" href="Destacados.html">Destacados</a></li>
            <li class="nav-item"><a class="nav-link" href="Seguimiento.html">Mis pedidos</a></li>
            <li class="nav-item"><a class="nav-link" href="carrito.html">Carrito</a></li>
            <li class="nav-item"><a class="nav-link text-danger fw-semibold" href="#" id="logout">Cerrar sesión</a></li>
        `;
    }
}

function configurarEventosNavbar(usuario) {
    // Botón login (invitado)
    const btnLogin = document.getElementById("btn-login");
    if (btnLogin && window.keycloak) {
        btnLogin.addEventListener("click", (e) => {
            e.preventDefault();
            const redirectUri = window.location.origin + "/Frontend/index.html";
            window.keycloak.login({ redirectUri });
        });
    }

    // Botón logout (logueado)
    const btnLogout = document.getElementById("logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault();

            ["usuario", "usuario_dulce_tentacion"].forEach((k) => localStorage.removeItem(k));

            if (window.keycloak) {
                const redirectUri = window.location.origin + "/Frontend/index.html";
                window.keycloak.logout({ redirectUri });
            } else {
                window.location.href = "index.html";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const esperaKeycloak = window.keycloakReady || Promise.resolve();

    esperaKeycloak.finally(() => {
        const usuario = obtenerUsuarioActual();
        construirNavbar(usuario);
        configurarEventosNavbar(usuario);
    });
});

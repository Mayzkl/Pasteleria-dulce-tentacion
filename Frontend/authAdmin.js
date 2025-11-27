document.addEventListener("DOMContentLoaded", () => {
    const usuario = typeof obtenerUsuarioActual === "function"
        ? obtenerUsuarioActual()
        : null;

    if (!usuario) {
        alert("Debes iniciar sesión para acceder aquí.");
        window.location.href = "login.html";
        return;
    }

    const esAdmin = usuario.email === "admin@dulcetentacion.cl";

    if (!esAdmin) {
        alert("No tienes permisos para acceder a esta sección.");
        window.location.href = "index.html";
    }
});

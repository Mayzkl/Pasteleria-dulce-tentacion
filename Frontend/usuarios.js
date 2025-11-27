// ==== Claves de almacenamiento ====
const CLAVE_USUARIOS        = "usuarios_dulce_tentacion";   // si lo usas para registrar usuarios
const CLAVE_USUARIO_SESION  = "usuario_dulce_tentacion";    // <--- clave única de sesión

// ==== Manejo de sesión ====

// Guarda el usuario logueado
function guardarSesion(usuario) {
    if (!usuario) return;
    localStorage.setItem(CLAVE_USUARIO_SESION, JSON.stringify(usuario));
}

// Obtiene el usuario actual desde localStorage
function obtenerUsuarioActual() {
    const json = localStorage.getItem(CLAVE_USUARIO_SESION);
    if (!json) return null;

    try {
        return JSON.parse(json);
    } catch (e) {
        console.error("Error al parsear usuario en sesión:", e);
        return null;
    }
}

// Cierra sesión
function cerrarSesion() {
    localStorage.removeItem(CLAVE_USUARIO_SESION);
}
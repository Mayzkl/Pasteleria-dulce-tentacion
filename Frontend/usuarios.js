// Claves de almacenamiento
const CLAVE_USUARIOS = "usuarios_dulce_tentacion";
const CLAVE_SESION   = "sesion_dulce_tentacion";

function cargarUsuarios() {
    const data = localStorage.getItem(CLAVE_USUARIOS);
    return data ? JSON.parse(data) : [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

function registrarUsuario({ nombre, correo, password }) {
    const usuarios = cargarUsuarios();

    const existe = usuarios.some(u => u.correo === correo);
    if (existe) {
        throw new Error("El correo ya está registrado.");
    }

    usuarios.push({ nombre, correo, password });
    guardarUsuarios(usuarios);
}

function iniciarSesion(correo, password) {
    const usuarios = cargarUsuarios();
    const usuario = usuarios.find(
        u => u.correo === correo && u.password === password
    );

    if (!usuario) {
        throw new Error("Correo o contraseña incorrectos.");
    }

    localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
    return usuario;
}

function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
}

function obtenerUsuarioActual() {
    const data = localStorage.getItem(CLAVE_SESION);
    return data ? JSON.parse(data) : null;
}

const CLAVE_CARRITO = "carrito_dulce_tentacion";

function obtenerCarrito() {
    const data = localStorage.getItem(CLAVE_CARRITO);
    return data ? JSON.parse(data) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function agregarAlCarrito(producto, opciones) {
    const carrito = obtenerCarrito();

    carrito.push({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    imagen: producto.imagen,
    tamano: opciones.tamano,
    relleno: opciones.relleno,
    mensaje: opciones.mensaje
    });

    guardarCarrito(carrito);
}

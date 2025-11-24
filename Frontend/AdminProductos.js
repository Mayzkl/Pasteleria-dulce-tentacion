// ===============================
// Configuración y helpers
// ===============================
const CLAVE_PRODUCTOS = "productos_dulce_tentacion";

// Si productos.js ya define PRODUCTOS, lo usamos.
// Si no, evitamos romper todo.
if (typeof PRODUCTOS === "undefined") {
    var PRODUCTOS = [];
}

// Fallback por si no existe en productos.js
if (typeof formatearPrecio === "undefined") {
    function formatearPrecio(valor) {
        return "$" + (valor || 0).toLocaleString("es-CL");
    }
}

function obtenerProductos() {
    return PRODUCTOS;
}

function cargarProductosDesdeStorage() {
    try {
        const guardados = JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS) || "[]");
        if (Array.isArray(guardados) && guardados.length > 0) {
            PRODUCTOS.length = 0;
            guardados.forEach(p => PRODUCTOS.push(p));
        }
    } catch (e) {
        console.error("Error leyendo productos desde storage", e);
    }
}

function guardarProductosEnStorage() {
    try {
        localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(PRODUCTOS));
    } catch (e) {
        console.error("Error guardando productos en storage", e);
    }
}

// Al cargar la página de administración, sincronizamos con storage
cargarProductosDesdeStorage();

// ===============================
// DOM
// ===============================
const gridProductosAdmin = document.getElementById("gridProductosAdmin");
const formProducto       = document.getElementById("formProducto");

const inputId          = document.getElementById("productoId");
const inputNombre      = document.getElementById("nombre");
const inputPrecio      = document.getElementById("precio");
const inputDescripcion = document.getElementById("descripcion");
const inputImagen      = document.getElementById("imagen");
const inputCategoria   = document.getElementById("categoria");

const modalProductoEl = document.getElementById("productoModal");
const modalProducto   = new bootstrap.Modal(modalProductoEl);
const modalConfirm    = new bootstrap.Modal(document.getElementById("confirmModal"));

// Botón "Cambiar o agregar producto" (el que abre el modal vacío)
const btnNuevo = document.querySelector('button[data-bs-target="#productoModal"]');

// ===============================
// Render de tarjetas
// ===============================
function renderProductosAdmin() {
    const productos = obtenerProductos();
    gridProductosAdmin.innerHTML = "";

    if (!productos || productos.length === 0) {
        gridProductosAdmin.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    No hay productos registrados. Usa el botón "Cambiar o agregar producto" para crear uno nuevo.
                </div>
            </div>
        `;
        return;
    }

    productos.forEach(prod => {
        const col = document.createElement("div");
        col.className = "col-md-3";

        col.innerHTML = `
            <div class="border p-3 text-center bg-white shadow-sm rounded h-100 d-flex flex-column">
                <p class="fw-bold mb-1">${prod.nombre}</p>
                <p class="text-muted mb-1">${formatearPrecio(prod.precio)}</p>
                <p class="small text-muted mb-2">${prod.categoria || ""}</p>
                <div class="mt-auto d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary w-50 btn-editar">Editar</button>
                    <button class="btn btn-sm btn-outline-danger  w-50 btn-eliminar">Eliminar</button>
                </div>
            </div>
        `;

        const btnEditar   = col.querySelector(".btn-editar");
        const btnEliminar = col.querySelector(".btn-eliminar");

        // Editar producto
        btnEditar.addEventListener("click", () => {
            inputId.value          = prod.id || "";
            inputNombre.value      = prod.nombre || "";
            inputPrecio.value      = prod.precio || "";
            inputDescripcion.value = prod.descripcion || "";
            inputImagen.value      = prod.imagen || "";
            inputCategoria.value   = prod.categoria || "";

            formProducto.classList.remove("was-validated");
            modalProducto.show();
        });

        // Eliminar producto
        btnEliminar.addEventListener("click", () => {
            if (!confirm(`¿Eliminar "${prod.nombre}" del catálogo?`)) return;

            const lista = obtenerProductos();
            const index = lista.findIndex(p => p.id === prod.id);
            if (index !== -1) {
                lista.splice(index, 1);
                guardarProductosEnStorage();
                renderProductosAdmin();
            }
        });

        gridProductosAdmin.appendChild(col);
    });
}

// ===============================
// Nuevo producto (limpiar formulario)
// ===============================
if (btnNuevo) {
    btnNuevo.addEventListener("click", () => {
        inputId.value          = "";
        inputNombre.value      = "";
        inputPrecio.value      = "";
        inputDescripcion.value = "";
        inputImagen.value      = "";
        inputCategoria.value   = "";

        formProducto.classList.remove("was-validated");
    });
}

// ===============================
// Guardar (crear / editar)
// ===============================
formProducto.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!formProducto.checkValidity()) {
        e.stopPropagation();
        formProducto.classList.add("was-validated");
        return;
    }

    const lista = obtenerProductos();

    let id = inputId.value;
    if (!id) {
        if (window.crypto && crypto.randomUUID) {
            id = crypto.randomUUID();
        } else {
            id = "prod_" + Date.now();
        }
    }

    const nuevoProd = {
        id,
        nombre:      inputNombre.value.trim(),
        precio:      Number(inputPrecio.value),
        descripcion: inputDescripcion.value.trim(),
        imagen:      inputImagen.value.trim(),   // URL
        categoria:   inputCategoria.value
    };

    const existenteIdx = lista.findIndex(p => p.id === id);
    if (existenteIdx !== -1) {
        lista[existenteIdx] = nuevoProd;
    } else {
        lista.push(nuevoProd);
    }

    guardarProductosEnStorage();
    modalProducto.hide();
    formProducto.reset();
    inputId.value = "";
    formProducto.classList.remove("was-validated");

    // Mostrar modal de confirmación
    modalConfirm.show();

    renderProductosAdmin();
});

// Primera carga
renderProductosAdmin();

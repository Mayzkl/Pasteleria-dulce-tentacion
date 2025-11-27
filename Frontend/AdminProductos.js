const URL_API_PRODUCTOS = "http://localhost:3900/api/productos";

let modalProducto = null;
let modalConfirm = null;

document.addEventListener("DOMContentLoaded", () => {
    cargarProductosAdmin();
    prepararFormularioProducto();
});

// LISTAR PRODUCTOS EN EL GRID
async function cargarProductosAdmin() {
    const grid = document.getElementById("gridProductosAdmin");

    if (!grid) {
        console.error("No se encontró el contenedor gridProductosAdmin");
        return;
    }

    try {
        const resp = await fetch(`${URL_API_PRODUCTOS}/listar`);
        const data = await resp.json();

        if (data.status !== "success") {
            grid.innerHTML = `<p class="text-center text-danger">No se pudieron cargar los productos.</p>`;
            return;
        }

        const productos = data.productos || [];

        if (productos.length === 0) {
            grid.innerHTML = `<p class="text-center text-muted">No hay productos registrados aún.</p>`;
            return;
        }

        grid.innerHTML = "";

        productos.forEach((p) => {
            const titulo = p.titulo || p.nombre || "Producto sin nombre";
            const descripcion = p.descripcion || p.relleno || "";
            const precio = p.precio || 0;
            const imagen = p.imagen || "";
            const categoria = p.categoria || "";

            grid.innerHTML += `
                <div class="col-sm-6 col-md-4 col-lg-3">
                    <div class="card h-100 shadow-sm">
                        ${
                            imagen
                                ? `<img src="${imagen}" class="card-img-top" alt="${titulo}">`
                                : ``
                        }
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${titulo}</h5>
                            ${
                                categoria
                                    ? `<span class="badge bg-secondary mb-2">${categoria}</span>`
                                    : ``
                            }
                            <p class="card-text small flex-grow-1">${descripcion}</p>
                            <p class="fw-bold text-success mt-2">$${precio}</p>
                            <div class="mt-2 d-flex justify-content-between">
                                <button class="btn btn-sm btn-warning" onclick="abrirEditarProducto('${p._id}')">
                                    Editar
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="eliminarProducto('${p._id}')">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error al cargar productos", error);
        grid.innerHTML = `<p class="text-center text-danger">Error al conectar con el servidor.</p>`;
    }
}

// === PREPARAR FORMULARIO DEL MODAL (CREAR / EDITAR) ===
function prepararFormularioProducto() {
    const form = document.getElementById("formProducto");
    const inputId = document.getElementById("productoId");
    const inputNombre = document.getElementById("nombre");
    const inputPrecio = document.getElementById("precio");
    const inputDescripcion = document.getElementById("descripcion");
    const inputImagen = document.getElementById("imagen");
    const inputCategoria = document.getElementById("categoria");

    const modalProductoEl = document.getElementById("productoModal");
    const modalConfirmEl = document.getElementById("confirmModal");

    modalProducto = new bootstrap.Modal(modalProductoEl);
    modalConfirm = new bootstrap.Modal(modalConfirmEl);

    // Limpiar formulario solo cuando no hay id 
    modalProductoEl.addEventListener("show.bs.modal", () => {
        if (!inputId.value) {
            form.classList.remove("was-validated");
            inputNombre.value = "";
            inputPrecio.value = "";
            inputDescripcion.value = "";
            inputImagen.value = "";
            inputCategoria.value = "";
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        form.classList.add("was-validated");

        if (!form.checkValidity()) {
            return;
        }

        const id = inputId.value.trim();
        const producto = {
            titulo: inputNombre.value.trim(),
            precio: Number(inputPrecio.value),
            descripcion: inputDescripcion.value.trim(),
            imagen: inputImagen.value.trim(),
            categoria: inputCategoria.value.trim()
        };

        try {
            let resp;
            let data;

            if (!id) {
                // CREAR producto
                resp = await fetch(`${URL_API_PRODUCTOS}/crear`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(producto)
                });
            } else {
                // EDITAR producto
                resp = await fetch(`${URL_API_PRODUCTOS}/editar/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(producto)
                });
            }

            data = await resp.json();

            if (!resp.ok || data.status !== "success") {
                alert(data.mensaje || "Ocurrió un error al guardar el producto.");
                return;
            }

            // Dejar el id vacío para la próxima vez 
            inputId.value = "";

            // Cerrar modal de edición y mostrar confirmación
            modalProducto.hide();
            modalConfirm.show();

            // Cuando se cierre el confirm, recargamos el grid
            modalConfirmEl.addEventListener("hidden.bs.modal", () => {
                cargarProductosAdmin();
            }, { once: true });

        } catch (error) {
            console.error("Error al guardar producto", error);
            alert("Error al conectar con el servidor.");
        }
    });
}

// === EDITAR: abrir modal con datos existentes ===
async function abrirEditarProducto(id) {
    try {
        const resp = await fetch(`${URL_API_PRODUCTOS}/obtener/${id}`);
        const data = await resp.json();

        if (!resp.ok || data.status !== "success") {
            alert(data.mensaje || "No se pudo obtener el producto.");
            return;
        }

        const p = data.producto;

        const inputId = document.getElementById("productoId");
        const inputNombre = document.getElementById("nombre");
        const inputPrecio = document.getElementById("precio");
        const inputDescripcion = document.getElementById("descripcion");
        const inputImagen = document.getElementById("imagen");
        const inputCategoria = document.getElementById("categoria");
        const form = document.getElementById("formProducto");

        // Llenar campos
        inputId.value = p._id;
        inputNombre.value = p.titulo || "";
        inputPrecio.value = p.precio || "";
        inputDescripcion.value = p.descripcion || p.relleno || "";
        inputImagen.value = p.imagen || "";
        inputCategoria.value = p.categoria || "";

        form.classList.remove("was-validated");

        // Abrir modal en modo edición
        modalProducto.show();

    } catch (error) {
        console.error("Error al abrir producto para edición", error);
        alert("Error al obtener datos del producto.");
    }
}

async function eliminarProducto(id) {
    const confirmar = confirm("¿Seguro que quieres eliminar este producto?");
    if (!confirmar) return;

    try {
        const resp = await fetch(`${URL_API_PRODUCTOS}/eliminar/${id}`, {
            method: "DELETE"
        });

        const data = await resp.json();

        if (!resp.ok || data.status !== "success") {
            alert(data.mensaje || "No se pudo eliminar el producto.");
            return;
        }

        // Opcional: mensaje rápido
        alert("Producto eliminado correctamente.");

        // Recargar el grid
        cargarProductosAdmin();

    } catch (error) {
        console.error("Error al eliminar producto", error);
        alert("Error al conectar con el servidor.");
    }
}


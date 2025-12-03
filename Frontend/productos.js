const URL_API_PRODUCTOS = "http://localhost:3900/api/productos";

// Helper global para formatear precios 
if (typeof formatearPrecio === "undefined") {
    function formatearPrecio(valor) {
        return "$" + (valor || 0).toLocaleString("es-CL");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarCatalogoCliente();
});

// Cargar productos del backend 
async function cargarCatalogoCliente() {
    const grid = document.getElementById("gridCatalogo");
    if (!grid) {
        console.error("No se encontró el contenedor gridCatalogo");
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
            grid.innerHTML = `<p class="text-center text-muted">No hay productos disponibles por el momento.</p>`;
            return;
        }

        grid.innerHTML = "";

        productos.forEach((p) => {
            const titulo = p.titulo || "Producto sin nombre";
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
                            <p class="fw-bold text-success mt-2">${formatearPrecio(precio)}</p>
                            <button 
                                class="btn btn-primary mt-2"
                                onclick="window.location.href='personalizacion.html?id=${p._id}'"
                            >
                                Personalizar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error al cargar catálogo", error);
        grid.innerHTML = `<p class="text-center text-danger">Error al conectar con el servidor.</p>`;
    }
}

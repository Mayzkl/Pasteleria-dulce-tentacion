// Lista base de productos disponibles en el sitio
const PRODUCTOS = [
    {
        id: "selva",
        nombre: "Torta Selva Negra",
        precio: 19990,
        imagen: "https://www.paulinacocina.net/wp-content/uploads/2022/04/selva-negra-receta-1.jpg.webp",
        descripcionCorta: "Clásica y esponjosa, rellena de cerezas y crema batida.",
        descripcionLarga: "Capas de bizcocho de chocolate, cerezas y crema batida, ideal para celebraciones clásicas.",
        esFavorito: true,
        esDestacado: true,
        etiquetaDestacado: "Clásico de la casa"
    },
    {
        id: "tresleches",
        nombre: "Torta Tres Leches",
        precio: 22990,
        imagen: "https://www.pasteleriaelparron.cl/wp-content/uploads/2023/08/Tres-Leches-2024.png",
        descripcionCorta: "Suave, húmeda y perfecta para cualquier celebración.",
        descripcionLarga: "Bizcocho bañado en mezcla de tres leches, decorado con crema y detalles de chocolate.",
        esFavorito: true,
        esDestacado: true,
        etiquetaDestacado: "Recomendada del chef"
    },
    {
        id: "frambuesa",
        nombre: "Torta Frambuesa",
        precio: 21990,
        imagen: "https://velvetbakery.cl/cdn/shop/products/MerengueFrambuesaCSh.jpg?v=1666199845",
        descripcionCorta: "Relleno de manjar y frambuesas frescas, nuestra favorita.",
        descripcionLarga: "Torta de bizcocho de vainilla con manjar y frambuesas frescas, terminada con crema suave.",
        esFavorito: true,
        esDestacado: true,
        etiquetaDestacado: "Más vendida"
    },
    {
        id: "milhojas",
        nombre: "Torta Milhojas",
        precio: 18990,
        imagen: "https://cdn0.recetasgratis.net/es/posts/8/0/2/torta_milhojas_24208_orig.jpg",
        descripcionCorta: "Láminas crujientes de hojaldre rellenas de manjar.",
        descripcionLarga: "Capas de masa de milhojas horneada y manjar casero, espolvoreada con azúcar flor.",
        esFavorito: false,
        esDestacado: false,
        etiquetaDestacado: ""
    },
    {
        id: "durazno",
        nombre: "Torta Durazno-Manjar",
        precio: 20990,
        imagen: "https://media.falabella.com/tottusCL/20248718_1/w=800,h=800,fit=pad",
        descripcionCorta: "Bizcocho suave con manjar y duraznos en conserva.",
        descripcionLarga: "Torta fresca y cremosa, rellena de manjar y láminas de durazno en conserva.",
        esFavorito: false,
        esDestacado: false,
        etiquetaDestacado: ""
    },
    {
        id: "chocolate",
        nombre: "Torta de Chocolate",
        precio: 23990,
        imagen: "https://mozart.cl/wp-content/uploads/2025/05/12_MIF_1936_Torta_Manjar_Chantilly_Durazno_1080x1080.jpg",
        descripcionCorta: "Bizcocho húmedo con ganache de chocolate.",
        descripcionLarga: "Torta intensa de cacao, con relleno y cobertura de ganache de chocolate.",
        esFavorito: false,
        esDestacado: false,
        etiquetaDestacado: ""
    }
    ];

    function buscarProductoPorId(id) {
    return PRODUCTOS.find(p => p.id === id);
    }

    function formatearPrecio(valor) {
    return "$" + valor.toLocaleString("es-CL");
    }

    const CLAVE_PRODUCTOS = "productos_dulce_tentacion";

    // Devolver siempre la misma referencia
    function obtenerProductos() {
        return PRODUCTOS;
    }

    function guardarProductosEnStorage() {
        try {
            localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(PRODUCTOS));
        } catch (e) {
            console.error("Error guardando productos en storage", e);
        }
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

    cargarProductosDesdeStorage();


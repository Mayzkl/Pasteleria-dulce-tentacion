const Articulo = require("../modelos/Articulo");

// Crear producto
const crear = async (req, res) => {
    try {
        const datos = req.body;

        const nuevo = new Articulo(datos);
        await nuevo.save();

        return res.status(201).json({
            status: "success",
            mensaje: "Producto creado correctamente",
            producto: nuevo
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno al crear producto"
        });
    }
};

// Listar productos
const listar = async (req, res) => {
    try {
        const productos = await Articulo.find().sort({ fecha: -1 });

        return res.status(200).json({
            status: "success",
            productos
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error al listar productos"
        });
    }
};

// Obtener producto por ID
const obtener = async (req, res) => {
    const id = req.params.id;

    try {
        const producto = await Articulo.findById(id);

        if (!producto) {
            return res.status(404).json({
                status: "error",
                mensaje: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            status: "success",
            producto
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al obtener producto"
        });
    }
};

// Editar producto
const editar = async (req, res) => {
    const id = req.params.id;
    const cambios = req.body;

    try {
        const producto = await Articulo.findByIdAndUpdate(id, cambios, { new: true });

        return res.status(200).json({
            status: "success",
            mensaje: "Producto actualizado",
            producto
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al editar producto"
        });
    }
};

// Eliminar producto
const eliminar = async (req, res) => {
    const id = req.params.id;

    try {
        await Articulo.findByIdAndDelete(id);

        return res.status(200).json({
            status: "success",
            mensaje: "Producto eliminado"
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al eliminar producto"
        });
    }
};

// Validar disponibilidad de los productos del carrito
const validar_disponibilidad = async (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se han enviado productos para validar."
            });
        }

        return res.status(200).json({
            status: "success",
            disponible: true,
            mensaje: "Todos los productos están disponibles para tu pedido."
        });
    } catch (error) {
        console.error("Error al validar disponibilidad:", error);
        return res.status(500).json({
            status: "error",
            disponible: false,
            mensaje: "Error interno al validar disponibilidad."
        });
    }
};


module.exports = {
    crear,
    listar,
    obtener,
    editar,
    eliminar,
    validar_disponibilidad
};

const Pedido = require("../modelos/Pedido");

// Crear pedido 
const crear = async (req, res) => {
    try {
        const { usuario, items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se enviaron productos en el pedido."
            });
        }

        // Calcular total en el servidor
        const total = items.reduce((acc, item) => acc + (item.precio || 0), 0);

        const nuevo = new Pedido({
            usuario: usuario
                ? {
                    id: usuario.id || usuario._id || null,
                    nombre: usuario.nombre || "",
                    email: usuario.email || ""
                }
                : null,
            items: items.map(i => ({
                idProducto: i.id,
                nombre:  i.nombre,
                precio:  i.precio,
                imagen:  i.imagen || "",
                tamano:  i.tamano || "",
                relleno: i.relleno || "",
                mensaje: i.mensaje || ""
            })),
            total
        });

        await nuevo.save();

        return res.status(201).json({
            status: "success",
            mensaje: "Pedido registrado correctamente.",
            pedido: nuevo
        });

    } catch (error) {
        console.error("Error al crear pedido:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno al crear el pedido."
        });
    }
};

// Listar pedidos 
const listar = async (req, res) => {
    try {
        const pedidos = await Pedido.find().sort({ fecha: -1 });

        return res.status(200).json({
            status: "success",
            pedidos
        });
    } catch (error) {
        console.error("Error al listar pedidos:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno al listar pedidos."
        });
    }
};

const cancelarPedido = async (req, res) => {
    try {
        const id = req.params.id;
        const { motivo } = req.body || {};

        console.log("Cancelar pedido – ID recibido:", id);

        // Actualizar directamente por ID
        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            id,
            {
                estado: "Cancelado",
                motivoAnulacion: motivo || "No especificado",
                fechaAnulacion: new Date()
            },
            { new: true } // devuelve el doc actualizado
        );

        if (!pedidoActualizado) {
            console.error("No se encontró pedido con ID:", id);
            return res.status(404).json({ mensaje: "Pedido no encontrado" });
        }

        console.log("Pedido cancelado correctamente:", pedidoActualizado._id.toString());

        return res.json({
            mensaje: "Pedido cancelado exitosamente",
            pedido: pedidoActualizado
        });

    } catch (error) {
        console.error("Error al cancelar pedido:", error);
        return res
            .status(500)
            .json({ mensaje: "Error interno al cancelar el pedido" });
    }
};

module.exports = {
    crear,
    listar,
    cancelarPedido
};

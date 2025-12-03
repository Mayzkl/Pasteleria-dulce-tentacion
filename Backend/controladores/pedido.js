const Pedido = require("../modelos/Pedido");

//  Crear pedido

const crear = async (req, res) => {
    try {
        const { numero, usuario, entrega, items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se enviaron productos en el pedido."
            });
        }

        // Calcular total en el servidor 
        const total = items.reduce((acc, item) => {
            return acc + (Number(item.precio) || 0);
        }, 0);

        const nuevoPedido = new Pedido({
            numero: numero || null,
            usuario: usuario
                ? {
                    id: usuario.id || usuario._id || null,
                    nombre: usuario.nombre || "",
                    email: usuario.email || ""
                }
                : null,
            entrega: entrega || null,
            items: items.map((i) => ({
                idProducto: i.id || i.idProducto || null,
                nombre:  i.nombre,
                precio:  Number(i.precio) || 0,
                imagen:  i.imagen || "",
                tamano:  i.tamano || i.tamaño || "",
                relleno: i.relleno || "",
                mensaje: i.mensaje || ""
            })),
            total,
            estado: "pagado"
        });

        const pedidoGuardado = await nuevoPedido.save();

        return res.status(201).json({
            status: "success",
            mensaje: "Pedido creado correctamente",
            pedido: pedidoGuardado
        });

    } catch (error) {
        console.error("Error al crear pedido:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno al crear el pedido"
        });
    }
};

//  Listar pedidos

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
            mensaje: "Error interno al listar pedidos"
        });
    }
};

//  Cambiar estado genérico
const actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const permitidos = [
            "pagado",
            "en_preparacion",
            "en_despacho",
            "entregado",
            "cancelado"
        ];

        if (!permitidos.includes(estado)) {
            return res.status(400).json({
                status: "error",
                mensaje: "Estado no permitido"
            });
        }

        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        );

        if (!pedidoActualizado) {
            return res.status(404).json({
                status: "error",
                mensaje: "Pedido no encontrado"
            });
        }

        return res.status(200).json({
            status: "success",
            mensaje: "Estado actualizado correctamente",
            pedido: pedidoActualizado
        });

    } catch (error) {
        console.error("Error al actualizar estado:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno al actualizar el estado del pedido"
        });
    }
};

//  Cancelar 
const cancelarPedido = async (req, res) => {
    try {
        const { id } = req.params;

        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            id,
            { estado: "cancelado" },
            { new: true }
        );

        if (!pedidoActualizado) {
            return res.status(404).json({
                status: "error",
                mensaje: "Pedido no encontrado"
            });
        }

        return res.status(200).json({
            status: "success",
            mensaje: "Pedido cancelado correctamente",
            pedido: pedidoActualizado
        });
    } catch (error) {
        console.error("Error al cancelar pedido:", error);
        return res.status(500).json({
            status: "error",
            mensaje: "Error interno al cancelar el pedido"
        });
    }
};

module.exports = {
    crear,
    listar,
    actualizarEstado,
    cancelarPedido
};

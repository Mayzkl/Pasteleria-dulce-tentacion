const { Schema, model } = require("mongoose");

const PedidoSchema = Schema({
    usuario: {
        id:   { type: Schema.Types.ObjectId, ref: "Usuario", required: false },
        nombre: String,
        email:  String
    },
    items: [
        {
            idProducto: { type: Schema.Types.ObjectId, ref: "Articulo" },
            nombre:  String,
            precio:  Number,
            imagen:  String,
            tamano:  String,
            relleno: String,
            mensaje: String
        }
    ],
    total:   Number,
    fecha:   { type: Date, default: Date.now },
    estado:  {
        type: String,
        enum: ["pagado", "en_preparacion", "en_despacho", "entregado", "cancelado"],
        default: "pagado"
    }
});

module.exports = model("Pedido", PedidoSchema, "pedidos");

const { Schema, model } = require("mongoose");

const PedidoSchema = new Schema({
    numero: {
        type: String,
    },

    usuario: {
        id:     { type: Schema.Types.ObjectId, ref: "Usuario", required: false },
        nombre: String,
        email:  String
    },

    entrega: {
        nombreDestinatario: String,
        direccion:         String,
        comuna:            String,
        fechaEntrega:      String,
        franjaEntrega:     String,
        tipoEntrega:       String,
        costoEnvio:        Number
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

    total: {
        type: Number,
        default: 0
    },

    fecha: {
        type: Date,
        default: Date.now
    },

    estado: {
        type: String,
        enum: ["pagado", "en_preparacion", "en_despacho", "entregado", "cancelado"],
        default: "pagado"
    }
});

module.exports = model("Pedido", PedidoSchema, "pedidos");

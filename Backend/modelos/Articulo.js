const { Schema, model } = require("mongoose");

const ArticuloSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    tamaño: {
        type: String,
        enum: ["10 personas", "15 personas", "20 personas"],
    },
    relleno: {
        type: String,
        enum: ["Manjar", "Crema", "Chocolate"],
    },
    mensaje: {
        type: String,
        maxlength: 40,
        default: "",
    },
    precio: {
        type: Number,
        required: true
    },
    imagen: {
        type: String,
        default: "default.png"
    },
    fecha_creacion: {
        type: Date,
        default: Date.now,
    },
    destacado: {
    type: Boolean,
    default: false
}
});

module.exports = model("Articulo", ArticuloSchema, "articulos");

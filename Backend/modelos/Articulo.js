// Es como realizar un import, aquí añadimos o incorporamos la dependencia
// de mongoose al archivo o modelo implementado.
const { Schema, model } = require("mongoose");

const ArticuloSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    tamaño: {
        type: String,
        enum: ["10 personas", "15 personas", "20 personas"],
        required: true
    },
    relleno: {
        type: String,
        enum: ["Manjar", "Crema", "Chocolate"],
        required: true
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
    }
});

module.exports = model("Articulo", ArticuloSchema, "articulos");

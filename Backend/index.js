const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");

console.log("App de node arrancada");

// Conexión a MongoDB
conexion();

// Crear servidor
const app = express();
const puerto = 3900;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de usuarios
const rutasUsuarios = require("./rutas/articulo");
app.use("/api", rutasUsuarios);

// Rutas de productos
const rutasProductos = require("./rutas/producto");
app.use("/api/productos", rutasProductos);

// Rutas de pedidos
const rutasPedidos = require("./rutas/pedido");
app.use("/api/pedidos", require("./rutas/pedido")); 

// Ruta de prueba
app.get("/", (req, res) => {
    return res.status(200).send("<h1>API Dulce Tentación funcionando</h1>");
});

// Poner servidor a escuchar
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto " + puerto);
});

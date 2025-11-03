const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");

console.log("App de node arrancada");

conexion();

const app = express();
const puerto = 3900;

app.use(cors());

app.use(express.json()); 
app.use(express.urlencoded({extended:true})); 

const rutas_articulo = require("./rutas/articulo");

app.use("/api", rutas_articulo);

app.get("/probando", (req, res) => {

    console.log("Se ha ejecutado el endpoint probando");

    return res.status(200).json([{
        curso: "Desarrollo Web y Movil",
        autor: "Vicente Diaz",
        url: ""
    },
    ]);

});

app.get("/", (req, res) => {


    return res.status(200).send(
        "<h1>Empezando a crear un api rest con node</h1>"
    );

});


app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto " + puerto);
});
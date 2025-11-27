const express = require("express");
const multer = require("multer");

const ArticuloControlador = require("../controladores/articulo");
const UsuarioControlador = require("../controladores/usuario");

const router = express.Router();

const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './imagenes/articulos/');
    },

    filename: function(req, file, cb){
        cb(null, "articulo" + Date.now() + file.originalname);
    }
})

const subidas = multer({storage: almacenamiento});

// Rutas Artículo
router.post("/crearUsuario", UsuarioControlador.crear_usuario);
router.get("/listarUsuarios", UsuarioControlador.listar_usuario);
router.get("/listarUsuario/:nombre", UsuarioControlador.listar_un_usuario);
router.post("/borrarUsuario/:id", UsuarioControlador.borrar_usuario);
router.post("/editarUsuario/:id", UsuarioControlador.editar_usuario);
router.post("/login", UsuarioControlador.login_usuario);
module.exports = router;



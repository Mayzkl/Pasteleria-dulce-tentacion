const express = require("express");
const ProductoControlador = require("../controladores/articulo");

const router = express.Router();

router.post("/crear", ProductoControlador.crear);
router.get("/listar", ProductoControlador.listar);
router.get("/obtener/:id", ProductoControlador.obtener);
router.put("/editar/:id", ProductoControlador.editar);
router.delete("/eliminar/:id", ProductoControlador.eliminar);
router.post("/validar-disponibilidad", ProductoControlador.validar_disponibilidad);

module.exports = router;

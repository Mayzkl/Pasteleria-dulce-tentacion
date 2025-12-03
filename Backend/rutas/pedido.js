const express = require("express");
const PedidoControlador = require("../controladores/pedido");
const router = express.Router();

router.post("/crear", PedidoControlador.crear);
router.get("/listar", PedidoControlador.listar);
router.patch("/estado/:id", PedidoControlador.actualizarEstado);
router.put("/cancelar/:id", PedidoControlador.cancelarPedido);

module.exports = router;


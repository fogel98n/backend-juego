const express = require("express");
const router = express.Router();

// Controladores
const loginController = require("../controllers/logincontroller");
const juegosController = require("../controllers/juegoscontroller");
const nivelescontroller = require("../controllers/nivelescontroller");
const partidascontroller = require("../controllers/partidacontroller");
const usuarioscontroller = require("../controllers/usuarioscontroller");
const partidamemoriacontroller = require("../controllers/partidamemoriacontroller");

router.post("/guardaresultado", partidamemoriacontroller.guardarResultado);
router.get("/obteneresultados", partidamemoriacontroller.getPartidasMemoria);

// Rutas para usuarios
router.post("/usuarios", usuarioscontroller.registrarUsuario);

// Rutas para partidas
router.post("/partidas", partidascontroller.crearPartida);
router.get("/partidas/:id", partidascontroller.obtenerPartida);
router.get("/partidas/codigo/:codigo", partidascontroller.obtenerPartidaPorCodigo);

// Rutas para autenticación/login
router.post("/login", loginController.login);

// Rutas para obtener datos de juegos y niveles
router.get("/juegos", juegosController.Juegos);
router.get("/niveles", nivelescontroller.tNiveles);

module.exports = router;

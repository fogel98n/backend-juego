const express = require("express");
const router = express.Router();

const loginController = require("../controllers/logincontroller");
const juegosController = require("../controllers/juegoscontroller");
const nivelescontroller = require("../controllers/nivelescontroller");
const partidascontroller = require("../controllers/partidacontroller");
const usuarioscontroller = require("../controllers/usuarioscontroller");
const partidamemoriacontroller = require("../controllers/partidamemoriacontroller");
const partida_adivina = require("../controllers/paritda_adivina");
const partida_emoji = require("../controllers/partida_emoji"); 
const frutascontroller=require("../controllers/patida_adivinaLafruta")
const simonDiceController = require("../controllers/partida_simondice");
// Rutas de partida memoria
router.post("/guardaresultado", partidamemoriacontroller.guardarResultado);
router.get("/obteneresultados", partidamemoriacontroller.getPartidasMemoria);

// Rutas de partida adivina
router.post("/adivina/guardarresultado", partida_adivina.guardarResultadoAdivina);
router.get("/adivina/partidas", partida_adivina.getPartidasAdivina);
router.get("/adivina/promedio", partida_adivina.getPromedioPuntuacion);
// rutas juego de emoji 
router.post("/emoji/guardarresultado", partida_emoji.guardarResultadoEmoji);
router.get("/emoji/partidas", partida_emoji.getResultadosEmoji);
router.get("/emoji/promedio", partida_emoji.getPromedioEmoji);

// ruta  juego de adivina la fruta 
router.get("/frutas/partidas", frutascontroller.getResultadosFruta);
router.post("/frutas/guardarresultado", frutascontroller.guardarResultadoFruta);

//ruta para simon dice 
// Ruta para Simón Dice
router.post("/simondice/guardarresultado", simonDiceController.guardarResultadoSimonDice);
router.get("/simondice/resultados", simonDiceController.getResultadosSimonDice);

router.post("/usuarios", usuarioscontroller.registrarUsuario);

router.post("/partidas", partidascontroller.crearPartida);
router.get("/partidas/:id", partidascontroller.obtenerPartida);
router.get("/partidas/codigo/:codigo", partidascontroller.obtenerPartidaPorCodigo);

// Rutas para autenticación/login
router.post("/login", loginController.login);

// Rutas para obtener datos de juegos y niveles
router.get("/juegos", juegosController.Juegos);
router.get("/niveles", nivelescontroller.tNiveles);

module.exports = router;

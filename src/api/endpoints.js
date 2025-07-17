const express = require("express");
const router = express.Router();

const loginController = require("../controllers/logincontroller");
const juegosController = require("../controllers/juegoscontroller");
const nivelescontroller = require("../controllers/nivelescontroller");
const partidascontroller = require("../controllers/partidacontroller");

const partidamemoriacontroller = require("../controllers/partidamemoriacontroller");
const partida_adivina = require("../controllers/paritda_adivina");
const partida_emoji = require("../controllers/partida_emoji");
const frutascontroller = require("../controllers/patida_adivinaLafruta");
const simonDiceController = require("../controllers/partida_simondice");
const avataresController = require("../controllers/avatares");
// Importar controlador de usuarios
const usuariosController = require("../controllers/usuarioscontroller");

// Rutas de partida memoria
router.post("/guardaresultado", partidamemoriacontroller.guardarResultado);
router.get("/obteneresultados", partidamemoriacontroller.getPartidasMemoria);

// Rutas de partida adivina
router.post("/adivina/guardarresultado", partida_adivina.guardarResultadoAdivina);
router.get("/adivina/partidas", partida_adivina.getPartidasAdivina);
router.get("/adivina/promedio", partida_adivina.getPromedioPuntuacion);

// Rutas juego de emoji
router.post("/emoji/guardarresultado", partida_emoji.guardarResultadoEmoji);
router.get("/emoji/partidas", partida_emoji.getResultadosEmoji);
router.get("/emoji/promedio", partida_emoji.getPromedioEmoji);

// Rutas juego adivina la fruta
router.get("/frutas/partidas", frutascontroller.getResultadosFruta);
router.post("/frutas/guardarresultado", frutascontroller.guardarResultadoFruta);

// Rutas simon dice
router.post("/simondice/guardarresultado", simonDiceController.guardarResultadoSimonDice);
router.get("/simondice/resultados", simonDiceController.getResultadosSimonDice);

// Rutas partidas
router.post("/partidas", partidascontroller.crearPartida);
router.get("/partidas/:id", partidascontroller.obtenerPartida);
router.get("/partidas/codigo/:codigo", partidascontroller.obtenerPartidaPorCodigo);
router.post("/partidas/iniciar", partidascontroller.cambiarEstadoPartida);
router.get("/partidas/:id/estado",partidascontroller.obtenerEstadoPartida)
// Rutas login
router.post("/login", loginController.login);

// Rutas juegos y niveles
router.get("/juegos", juegosController.Juegos);
router.get("/niveles", nivelescontroller.tNiveles);

// Rutas para usuarios con prefijo /usuarios
router.post("/usuarios/registrar", usuariosController.registrarUsuario);
router.post("/usuarios/asociar", usuariosController.asociarUsuarioAPartida);
router.get("/usuarios/:tipo/:idPartida", usuariosController.obtenerUsuariosEnPartidaPorTipo);

// ruta de avatares
router.get("/avatares", avataresController.avatares);

// cambiar ele estaodl de la partida 
router.post("/usuarios/cambiar-estado", usuariosController.cambiarEstadoUsuarioEnPartida);
module.exports = router;

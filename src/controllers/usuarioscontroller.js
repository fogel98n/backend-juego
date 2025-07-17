const pool = require('../models/db');

// Registrar usuario en tabla usuarios (con avatar)
module.exports.registrarUsuario = async (req, res) => {
  const { nombre, codigo_partida, avatar } = req.body;

  if (!nombre || !codigo_partida || !avatar) {
    return res.status(400).json({ error: "Nombre, código de partida y avatar son requeridos." });
  }

  try {
    // Verificar que la partida exista y esté activa
    const queryPartida = 'SELECT id FROM partidas WHERE codigo_partida = ? AND estado = "en_proceso" LIMIT 1';
    const [results] = await pool.query(queryPartida, [codigo_partida]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Código de partida no válido o partida finalizada." });
    }

    // Crear correo simulado para el usuario
    const correo = `${nombre.toLowerCase().replace(/\s+/g, "_")}@juego.com`;

    // Insertar usuario con avatar
    const queryInsert = `INSERT INTO usuarios (nombre, correo, estado, id_avatar) VALUES (?, ?, 'en_proceso', ?)`;
    const [result] = await pool.query(queryInsert, [nombre, correo, avatar]);

    res.status(201).json({
      id: result.insertId,
      nombre,
      correo,
      estado: "en_proceso",
      id_avatar: avatar,
      mensaje: "Usuario registrado correctamente en la partida.",
      id_partida: results[0].id
    });

  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// Asociar usuario a partida según tipo
module.exports.asociarUsuarioAPartida = async (req, res) => {
  const { id_usuario, id_partida, tipo_partida } = req.body;

  const tablasValidas = {
    emoji: "partida_emoji",
    memoria: "partida_memoria",
    fruta: "partida_fruta",
    adivina: "partida_adivina",
    simondice: "partida_simondice",
  };

  const tabla = tablasValidas[tipo_partida];
  if (!tabla) {
    return res.status(400).json({ error: "Tipo de partida no válido" });
  }

  try {
    const queryInsert = `
      INSERT INTO ${tabla} (id_partida, id_usuario, estado)
      VALUES (?, ?, 'en_juego')
    `;

    await pool.query(queryInsert, [id_partida, id_usuario]);

    res.status(201).json({ mensaje: "Usuario asociado a la partida correctamente" });
  } catch (error) {
    console.error("Error al asociar usuario a partida:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener usuarios en partida por tipo (incluyendo avatar)
module.exports.obtenerUsuariosEnPartidaPorTipo = async (req, res) => {
  const { tipo, idPartida } = req.params;

  const tablasValidas = {
    emoji: "partida_emoji",
    memoria: "partida_memoria",
    fruta: "partida_fruta",
    adivina: "partida_adivina",
    simondice: "partida_simondice",
  };

  const tabla = tablasValidas[tipo];
  if (!tabla) {
    return res.status(400).json({ mensaje: "Tipo de partida no válido" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.correo, u.id_avatar
       FROM ${tabla} p
       JOIN usuarios u ON p.id_usuario = u.id
       WHERE p.id_partida = ? AND p.estado = 'en_juego'`,
      [idPartida]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

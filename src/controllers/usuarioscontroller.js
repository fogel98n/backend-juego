const connection = require('../models/db');

// Registrar usuario en partida verificando el código
module.exports.registrarUsuario = (req, res) => {
  const { nombre, codigo_partida } = req.body;

  if (!nombre || !codigo_partida) {
    return res.status(400).json({ error: "Nombre y código de partida son requeridos." });
  }

  // Verificar si la partida existe y está en proceso
  const queryPartida = 'SELECT id FROM partidas WHERE codigo_partida = ? AND estado = "en_proceso" LIMIT 1';

  connection.query(queryPartida, [codigo_partida], (err, results) => {
    if (err) {
      console.error("Error al consultar partida:", err);
      return res.status(500).json({ error: "Error en la base de datos." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Código de partida no válido o partida finalizada." });
    }

    // Generar correo automáticamente a partir del nombre
    const correo = `${nombre.toLowerCase().replace(/\s+/g, "_")}@juego.com`;

    // Insertar usuario
    const queryInsert = `
      INSERT INTO usuarios (nombre, correo, estado)
      VALUES (?, ?, 'en_proceso')
    `;

    connection.query(queryInsert, [nombre, correo], (err, result) => {
      if (err) {
        console.error("Error al insertar usuario:", err);
        return res.status(500).json({ error: "Error al registrar usuario." });
      }

      res.status(201).json({
        id: result.insertId,
        nombre,
        correo,
        estado: "en_proceso",
        mensaje: "Usuario registrado correctamente en la partida."
      });
    });
  });
};

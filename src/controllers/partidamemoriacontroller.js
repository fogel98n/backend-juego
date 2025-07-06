const pool = require("../models/db");

// GET - Obtener resultados con nombre de usuario (JOIN con usuarios)
exports.getPartidasMemoria = async (req, res) => {
  try {
    const { id_usuario, id_partida } = req.query;
    let sql = `
      SELECT pm.*, u.nombre 
      FROM partida_memoria pm
      JOIN usuarios u ON pm.id_usuario = u.id
      WHERE 1
    `;
    const params = [];

    if (id_usuario) {
      sql += " AND pm.id_usuario = ?";
      params.push(id_usuario);
    }

    if (id_partida) {
      sql += " AND pm.id_partida = ?";
      params.push(id_partida);
    }

    const [results] = await pool.query(sql, params);
    res.json(results);
  } catch (err) {
    console.error("Error al obtener partidas de memoria:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// POST - Guardar resultado al finalizar la partida
exports.guardarResultado = async (req, res) => {
  try {
    const { id_usuario, id_partida, puntuacion, aciertos, movimientos } = req.body;

    if (!id_usuario || !id_partida) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const sql = `
      INSERT INTO partida_memoria (id_usuario, id_partida, puntuacion, aciertos, movimientos, estado)
      VALUES (?, ?, ?, ?, ?, 'finalizada')
    `;

    const [result] = await pool.query(sql, [
      id_usuario,
      id_partida,
      puntuacion || 0,
      aciertos || 0,
      movimientos || 0,
    ]);

    res.json({ message: "Resultado guardado correctamente", id: result.insertId });
  } catch (err) {
    console.error("Error al guardar resultado:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

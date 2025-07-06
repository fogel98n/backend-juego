const pool = require("../models/db");

// Obtener resultados de Simón Dice
exports.getResultadosSimonDice = async (req, res) => {
  try {
    const { id_usuario, id_partida } = req.query;
    let sql = `
      SELECT psd.*, u.nombre
      FROM partida_simondice psd
      JOIN usuarios u ON psd.id_usuario = u.id
      WHERE 1
    `;
    const params = [];

    if (id_usuario) {
      sql += " AND psd.id_usuario = ?";
      params.push(id_usuario);
    }

    if (id_partida) {
      sql += " AND psd.id_partida = ?";
      params.push(id_partida);
    }

    const [results] = await pool.query(sql, params);
    res.json(results);
  } catch (err) {
    console.error("Error al obtener partidas simon dice:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Guardar resultado de Simón Dice
exports.guardarResultadoSimonDice = async (req, res) => {
  try {
    const { id_usuario, id_partida, aciertos, intentos_fallidos, tiempo, estado } = req.body;

    if (
      !id_usuario ||
      !id_partida ||
      aciertos == null ||
      intentos_fallidos == null ||
      tiempo == null ||
      !estado
    ) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const sql = `
      INSERT INTO partida_simondice 
      (id_usuario, id_partida, aciertos, intentos_fallidos, tiempo, estado)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      id_usuario,
      id_partida,
      aciertos,
      intentos_fallidos,
      tiempo,
      estado,
    ]);

    res.json({ message: "Resultado guardado correctamente", id: result.insertId });
  } catch (err) {
    console.error("Error al guardar resultado simon dice:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

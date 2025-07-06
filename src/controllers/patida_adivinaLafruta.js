const pool = require("../models/db");

// Obtener resultados deL juego de la fruta
exports.getResultadosFruta = async (req, res) => {
  try {
    const { id_usuario, id_partida } = req.query;
    let sql = `
      SELECT pf.*, u.nombre
      FROM partida_fruta pf
      JOIN usuarios u ON pf.id_usuario = u.id
      WHERE 1
    `;
    const params = [];

    if (id_usuario) {
      sql += " AND pf.id_usuario = ?";
      params.push(id_usuario);
    }

    if (id_partida) {
      sql += " AND pf.id_partida = ?";
      params.push(id_partida);
    }

    const [results] = await pool.query(sql, params);
    res.json(results);
  } catch (err) {
    console.error("Error al obtener partidas fruta:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Guardar el resultado de la partida de fruta
exports.guardarResultadoFruta = async (req, res) => {
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
      INSERT INTO partida_fruta (id_usuario, id_partida, aciertos, intentos_fallidos, tiempo, estado)
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
    console.error("Error al guardar resultado fruta:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

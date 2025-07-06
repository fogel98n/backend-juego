const pool = require("../models/db");

// Obtener resultados de partidas emoji
exports.getResultadosEmoji = async (req, res) => {
  try {
    const { id_usuario, id_partida } = req.query;

    let sql = `
      SELECT pe.*, u.nombre
      FROM partida_emoji pe
      JOIN usuarios u ON pe.id_usuario = u.id
      WHERE 1
    `;
    const params = [];

    if (id_usuario) {
      sql += " AND pe.id_usuario = ?";
      params.push(id_usuario);
    }

    if (id_partida) {
      sql += " AND pe.id_partida = ?";
      params.push(id_partida);
    }

    const [results] = await pool.query(sql, params);
    res.json(results);
  } catch (err) {
    console.error("❌ Error al obtener partidas emoji:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Guardar resultado de partida emoji
exports.guardarResultadoEmoji = async (req, res) => {
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
      INSERT INTO partida_emoji (id_usuario, id_partida, aciertos, intentos_fallidos, tiempo_total, estado)
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
    console.error("❌ Error al guardar resultado emoji:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

// Obtener promedios de partidas emoji
exports.getPromedioEmoji = async (req, res) => {
  try {
    const { id_usuario } = req.query;

    let sql = `
      SELECT AVG(aciertos) AS promedio_aciertos, AVG(intentos_fallidos) AS promedio_fallos
      FROM partida_emoji
      WHERE estado = 'finalizada'
    `;
    const params = [];

    if (id_usuario) {
      sql += " AND id_usuario = ?";
      params.push(id_usuario);
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows[0] || { promedio_aciertos: 0, promedio_fallos: 0 });
  } catch (err) {
    console.error("❌ Error al obtener promedio emoji:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

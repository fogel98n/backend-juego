const pool = require("../models/db");

exports.getPartidasAdivina = async (req, res) => {
  try {
    const { id_usuario, id_partida } = req.query;
    let sql = `
      SELECT pa.*, u.nombre
      FROM partida_adivina pa
      JOIN usuarios u ON pa.id_usuario = u.id
      WHERE 1
    `;
    const params = [];

    if (id_usuario) {
      sql += " AND pa.id_usuario = ?";
      params.push(id_usuario);
    }
    if (id_partida) {
      sql += " AND pa.id_partida = ?";
      params.push(id_partida);
    }

    const [results] = await pool.query(sql, params);
    res.json(results);
  } catch (err) {
    console.error("Error al obtener partidas adivina:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

exports.guardarResultadoAdivina = async (req, res) => {
  try {
    const { id_usuario, id_partida, puntuacion, intentos, tiempo, estado } = req.body;

    if (
      !id_usuario ||
      !id_partida ||
      puntuacion == null ||
      intentos == null ||
      tiempo == null ||
      !estado
    ) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const sql = `
      INSERT INTO partida_adivina (id_usuario, id_partida, puntuacion, intentos, tiempo, estado)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      id_usuario,
      id_partida,
      puntuacion,
      intentos,
      tiempo,
      estado,
    ]);

    res.json({ message: "Resultado guardado correctamente", id: result.insertId });
  } catch (err) {
    console.error("Error al guardar resultado adivina:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

exports.getPromedioPuntuacion = async (req, res) => {
  try {
    const { id_usuario } = req.query;
    let sql = `
      SELECT AVG(puntuacion) as promedio_puntuacion, AVG(intentos) as promedio_intentos
      FROM partida_adivina
      WHERE estado = 'finalizada'
    `;
    const params = [];

    if (id_usuario) {
      sql += " AND id_usuario = ?";
      params.push(id_usuario);
    }

    const [rows] = await pool.query(sql, params);

    res.json(rows[0] || { promedio_puntuacion: 0, promedio_intentos: 0 });
  } catch (err) {
    console.error("Error al obtener promedio de puntuación:", err);
    res.status(500).json({ error: "Error interno" });
  }
};

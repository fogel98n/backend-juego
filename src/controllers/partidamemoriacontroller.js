const connection = require("../models/db");

// GET - Obtener resultados con nombre de usuario (JOIN con usuarios)
exports.getPartidasMemoria = (req, res) => {
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

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error al obtener partidas de memoria:", err);
      return res.status(500).json({ error: "Error interno" });
    }
    res.json(results);
  });
};

// POST - Guardar resultado al finalizar la partida
exports.guardarResultado = (req, res) => {
  const { id_usuario, id_partida, puntuacion, aciertos, movimientos } = req.body;

  if (!id_usuario || !id_partida) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const sql = `
    INSERT INTO partida_memoria (id_usuario, id_partida, puntuacion, aciertos, movimientos, estado)
    VALUES (?, ?, ?, ?, ?, 'finalizada')
  `;

  connection.query(
    sql,
    [id_usuario, id_partida, puntuacion || 0, aciertos || 0, movimientos || 0],
    (err, result) => {
      if (err) {
        console.error("Error al guardar resultado:", err);
        return res.status(500).json({ error: "Error interno" });
      }
      res.json({ message: "Resultado guardado correctamente", id: result.insertId });
    }
  );
};

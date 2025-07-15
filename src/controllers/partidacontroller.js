const pool = require('../models/db');

function generarCodigoPartida() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// 📌 Crear una nueva partida
module.exports.crearPartida = async (req, res) => {
  try {
    const { id_juego, id_nivel, duracion_minutos } = req.body;
    const codigo_partida = generarCodigoPartida();

    const query = `
      INSERT INTO partidas 
      (codigo_partida, id_juego, id_nivel, duracion_minutos, estado) 
      VALUES (?, ?, ?, ?, 'en_proceso')
    `;

    const [result] = await pool.query(query, [codigo_partida, id_juego, id_nivel, duracion_minutos]);

    res.status(201).json({
      id: result.insertId,
      codigo_partida,
      id_juego,
      id_nivel,
      duracion_minutos,
      estado: 'en_proceso',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Obtener datos de una partida por su ID
module.exports.obtenerPartida = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        id,
        codigo_partida,
        id_juego,
        id_nivel,
        duracion_minutos,
        estado,
        fecha_creacion
      FROM partidas
      WHERE id = ?
    `;

    const [results] = await pool.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Partida no encontrada" });
    }

    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Obtener una partida por su código
module.exports.obtenerPartidaPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;

    const query = `
      SELECT 
        partidas.*,
        juegos.nombre AS nombre_juego,
        niveles.nombre AS nombre_nivel
      FROM partidas
      JOIN juegos ON partidas.id_juego = juegos.id
      LEFT JOIN niveles ON partidas.id_nivel = niveles.id
      WHERE partidas.codigo_partida = ? AND partidas.estado = 'en_proceso'
      LIMIT 1
    `;

    const [results] = await pool.query(query, [codigo]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Código de partida no encontrado o partida no activa." });
    }

    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.cambiarEstadoPartida = async (req, res) => {
  const{id_partida}=req.body;

  if (!id_partida) {
    return res.status(400).json({ error: "ID de partida es requerido." });
  }

   try{
    const[result]=await pool.execute(
      "UPDATE partidas SET estado = 'iniciada' WHERE id = ?",
      [id_partida]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Partida no encontrada." });
    }
   
   res.json({ message: "Estado de la partida actualizado a 'iniciada'." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
   }
  
  module.exports.obtenerEstadoPartida = async (req, res) => {
    const{id}=req.params;

    try{
      const[rows]=await pool.execute(
        "SELECT estado FROM partidas WHERE id = ?",
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: "Partida no encontrada." });
      }
      res.json({ estado: rows[0].estado });
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.error("Error al obtener el estado de la partida:", err);
      res.status(500).json({ error: "Error al obtener el estado de la partida." }); 
    }
  }
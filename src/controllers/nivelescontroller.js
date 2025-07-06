const pool = require('../models/db');

module.exports.tNiveles = async (req, res) => {
  const id_juego = req.query.id_juego;

  let query = "SELECT * FROM niveles";
  const params = [];

  if (id_juego) {
    query += " WHERE id_juego = ?";
    params.push(id_juego);
  }

  try {
    const [results] = await pool.query(query, params);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


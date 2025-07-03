const connection = require('../models/db');

module.exports.tNiveles = (req, res) => {
  const id_juego = req.query.id_juego;

  let query = "SELECT * FROM niveles";
  const params = [];

  if (id_juego) {
    query += " WHERE id_juego = ?";
    params.push(id_juego);
  }

  connection.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};


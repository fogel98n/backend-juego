const pool = require('../models/db');

module.exports.Juegos = async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM juegos');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

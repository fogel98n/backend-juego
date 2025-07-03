const connection = require('../models/db');

module.exports.Juegos = (req, res) => {
  connection.query('SELECT * FROM juegos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

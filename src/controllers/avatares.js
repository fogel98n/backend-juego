const pool = require('../models/db');

module.exports.avatares = async (req, res) => {
  try {
    const query = "SELECT * FROM avatares";
    const [results] = await pool.query(query);
    res.json(results);
  } catch (error) {
    console.error("Error al obtener los avatares:", error);
    res.status(500).json({ error: "Error al obtener los avatares" });
  }
};

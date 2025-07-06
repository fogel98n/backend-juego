const pool = require("../models/db");
const jwt = require("jsonwebtoken");

module.exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;
  console.log("Datos recibidos en login:", correo, contrasena);  

  const query = "SELECT * FROM maestros WHERE correo = ? AND contrasena = ?";

  try {
    const [result] = await pool.query(query, [correo, contrasena]);

    if (result.length > 0) {
      const token = jwt.sign({ correo }, "stack", {
        expiresIn: "365d"
      });
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error("Error en la consulta:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};


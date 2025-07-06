const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'bizo3sitbcyjksvbaiss-mysql.services.clever-cloud.com',
  user: 'upz4mz2lehm44rpb',
  password: 'BEH2PObShbO8J8URQXJB',
  database: 'bizo3sitbcyjksvbaiss',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    // Para desarrollo, acepta certificados autofirmados
    rejectUnauthorized: false
  }
});

module.exports = pool;

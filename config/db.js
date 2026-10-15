
require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

const connectDB = async () => {
  try {
    const requiredConfig = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    const missingConfig = requiredConfig.filter((key) => process.env[key] === undefined || process.env[key] === '');

    if (missingConfig.length > 0) {
      throw new Error(`Missing required database environment variables: ${missingConfig.join(', ')}`);
    }

    const connection = await pool.getConnection();

    console.log('MySQL connected successfully.');

    connection.release();
    return pool;
  } catch (error) {
    console.error('MySQL connection failed:', error);
    throw error;
  }
};

module.exports = {
  pool,
  connectDB,
};
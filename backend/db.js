const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'hirdesh1234',
  database: process.env.DB_NAME || 'student_enrollment',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

// ✅ Database connection check
(async () => {
  try {
    await promisePool.query('SELECT 1');
    console.log('✅ MySQL Database Connected Successfully');
  } catch (error) {
    console.error('❌ MySQL Database Connection Failed:', error.message);
    process.exit(1); // stop server if DB not connected
  }
})();

module.exports = promisePool;

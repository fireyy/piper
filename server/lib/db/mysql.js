require('dotenv').config();

module.exports = function (mysql) {
  return mysql.createPool({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: process.env.DATABASE_PORT || '3306',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'piper'
  }, (err) => {
    console.log(err);
  });
}
